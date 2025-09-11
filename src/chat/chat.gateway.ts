import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() message: MessageDto) {
    this.chatService.addMessage(message);
    this.emitMessage(message);

    console.log(`Message from ${message.username}: ${message.message}`);
  }

  @SubscribeMessage('getMessages')
  getMessages(@ConnectedSocket() client: Socket) {
    const messages = this.chatService.getMessages();
    client.emit('messagesHistory', messages);
  }

  emitMessage(message: MessageDto) {
    if (message.id && message.username && message.username) {
      this.server.emit('newMessage', message);
    }
  }
}
