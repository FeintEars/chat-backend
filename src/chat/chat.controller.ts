import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageDto } from './dto/message.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('messages')
  getMessages(): MessageDto[] {
    return this.chatService.getMessages();
  }

  @Post('message')
  createMessage(@Body() message: MessageDto): MessageDto {
    this.chatService.addMessage(message);
    this.chatGateway.emitMessage(message);

    console.log(`Message from ${message.username}: ${message.message}`);

    return message;
  }
}
