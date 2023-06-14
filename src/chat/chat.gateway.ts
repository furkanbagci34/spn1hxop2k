import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
  
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;

    users: { [key: string]: string } = {};

    handleConnection(socket: Socket) {
        const username = `User-${Math.floor(Math.random() * 1000)}`;
        this.users[socket.id] = username;
        this.server.emit('users', Object.values(this.users));
        this.server.emit('message', `${username} joined the chat.`);
        socket.disconnect()
    }

    handleDisconnect(socket: Socket) {
        const username = this.users[socket.id];
        delete this.users[socket.id];
        this.server.emit('users', Object.values(this.users));
        this.server.emit('message', `${username} left the chat.`);
    }

    @SubscribeMessage('chat')
    handleMessage(socket: Socket, message: string) {
        console.log(socket.id)
        const username = this.users[socket.id];
        this.server.emit('message', `${username}: ${message}`);
    }
}
  