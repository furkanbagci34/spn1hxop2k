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

        const userFriendList = await this.getUserFriendList(tokenResult.username)
        this.sendOnlineMessage(tokenResult.username,userFriendList)
    }

    handleDisconnect(socket: Socket) {
        this.server.emit('message', `${socket.id} left the chat.`);
    }

    async addConnectedUser(username: string, socket: Socket) {
        await this.redisService.sadd('connectedUsers', [username]);
        await this.redisService.sadd(`userSockets:${username}`, [socket.id]);
    }

    async removeConnectedUser(username: string, socket: Socket) {
        await this.redisService.srem('connectedUsers', [username]);
        await this.redisService.srem(`userSockets:${username}`, [socket.id]);
    }

    async getUserFriendList(username: string) {
        const userFriends = await this.userFriendModel.find({ username: username }).exec();

        if(userFriends.length === 0) {
            return []
        }

        await this.redisService.sadd(`friends:${username}`, userFriends.map(userFriend => userFriend.friendUsername));

        return userFriends.map(userFriend => userFriend.friendUsername)
    }

    async sendOnlineMessage(username: string, userFriendList: any) {
        const socketKeys = userFriendList.map((friend) => `userSockets:${friend}`);

        if(socketKeys.length === 0) {
            return
        }

        const friendSockets = await this.redisService.sunion(...socketKeys);

        await Promise.all(friendSockets.map((socketId) => this.server.to(socketId).emit('chat', `${username} is online`)));
    }

    @SubscribeMessage('chat')
    async handleMessage(socket: Socket, message: string) {

    }
}