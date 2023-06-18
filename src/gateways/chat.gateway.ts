import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtTokenValidator } from '../validators/jwt.token-validator';
import { RedisService } from '../services/redis.service';
import { UserFriendDocument } from '../shema/user-friends.shema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    constructor(private readonly redisService: RedisService,
        @InjectModel('UserFriend') private readonly userFriendModel: Model<UserFriendDocument>) {}

    tokenValidator = new JwtTokenValidator();

    async handleConnection(socket: Socket) {

        const token = socket.handshake.headers.token as string;

        const tokenResult = await this.tokenValidator.isValidToken(token)

        if (!tokenResult) {
            socket.disconnect();
            return
        } 

        this.addConnectedUser(tokenResult.username,socket)

        this.sendOnlineMessage(tokenResult.username)

        const pendingMessages = await this.getPendingMessages(tokenResult.username);

        if(pendingMessages.length === 0) {
            return
        }

        for (const message of pendingMessages) {
            this.server.to(socket.id).emit('chat', message);
        }

        await this.clearPendingMessages(tokenResult.username);
    }

    async handleDisconnect(socket: Socket) {
        const username = await this.getUserName(socket.id)

        this.sendOfflineMessage(username)
        this.removeConnectedUser(username,socket)
    }

    async addConnectedUser(username: string, socket: Socket) {
        // await this.redisService.set(`onlineUsers:${socket.id}`, 'online');
        await this.redisService.sadd(`userName:${username}`, [socket.id]);
        await this.redisService.sadd(`userSockets:${socket.id}`, [username]);
    }

    async removeConnectedUser(username: string, socket: Socket) {
        // await this.redisService.del(`onlineUsers:${socket.id}`);
        await this.redisService.srem(`userName:${username}`, [socket.id]);
        await this.redisService.srem(`userSockets:${socket.id}`, [username]);
    }

    async getUserFriendListSocket(username: string) {
        const userFriends = await this.userFriendModel.find({ username: username }).exec();

        if(userFriends.length === 0) {
            return []
        }

        const userFriendList = userFriends.map(userFriend => userFriend.friendUsername)

        await this.redisService.sadd(`friends:${username}`, userFriendList );

        const socketKeys = userFriendList.map((friend) => `userName:${friend}`);

        if(socketKeys.length === 0) {
            return []
        }

        const userFriendListSocket = await this.redisService.sunion(...socketKeys);

        return userFriendListSocket
    }

    async getUserFriendListUserName(username: string) {
        const userFriends = await this.userFriendModel.find({ username: username }).exec();

        if(userFriends.length === 0) {
            return []
        }

        const userFriendListUserName = userFriends.map(userFriend => userFriend.friendUsername)

        return userFriendListUserName
    }

    async sendOnlineMessage(username: string) {

        const friendSockets = await this.getUserFriendListSocket(username)

        if(friendSockets.length === 0) {
            return
        }

        await Promise.all(friendSockets.map((socketId) => this.server.to(socketId).emit('chat', `${username} is online`)));
    }

    async sendOfflineMessage(username: string) {

        const friendSockets = await this.getUserFriendListSocket(username)

        if(friendSockets.length === 0) {
            return
        }

        await Promise.all(friendSockets.map((socketId) => this.server.to(socketId).emit('chat', `${username} is offline`)));
    }

    async isOnline(userName: string): Promise<boolean> {
        return await this.redisService.exists(`userName:${userName}`);
    }

    async getUserName(socket: string) {
        const username = await this.redisService.smembers(`userSockets:${socket}`)

        return username[0]
    }

    async enqueueMessage(userName: string, message: string) {
        await this.redisService.rpush(`messageQueue:${userName}`, [message]);
    }

    async getPendingMessages(userName: string) {
        const messages = await this.redisService.lrange(`messageQueue:${userName}`, 0, -1);
        return messages;
    }

    async clearPendingMessages(userName: string) {
        await this.redisService.del(`messageQueue:${userName}`);
    }

    @SubscribeMessage('chat')
    async handleMessage(socket: Socket, message: string) {
        const username = await this.getUserName(socket.id)
        const friendsUser = await this.getUserFriendListUserName(username)

        for (const userNameToMessage of friendsUser) {

            const isOnline = await this.isOnline(userNameToMessage);

            if (isOnline) {
                const socketId = await this.redisService.smembers(`userName:${userNameToMessage}`);

                this.server.to(socketId).emit('chat', `${username}: ${message}`);
            } 
            else {
                await this.enqueueMessage(userNameToMessage, `${username}: ${message}`);
            }
        }
    }
}