import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  private messages: MessageDto[] = [];

  addMessage(message: MessageDto) {
    if (message.id && message.username && message.username) {
      this.messages.push(message);
      while (this.messages.length > 10) {
        this.messages.shift();
      }
    }
  }

  getMessages(): MessageDto[] {
    return this.messages;
  }
}
