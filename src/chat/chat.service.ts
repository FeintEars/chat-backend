import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MessageDto } from './dto/message.dto';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  private messages: MessageDto[] = [];
  private cachedModel: { name: string; apiVersion: string } | null = null;

  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  addMessage(message: MessageDto) {
    if (message.id && message.username && message.message) {
      this.messages.push(message);
      while (this.messages.length > 10) {
        this.messages.shift();
      }

      this.callGeminiAPI(message);
    }
  }

  private async getAvailableModel(): Promise<{
    name: string;
    apiVersion: string;
  }> {
    if (this.cachedModel) {
      return this.cachedModel;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set.');
    }

    const modelsData = await this.listGeminiModels();
    const models = modelsData.models || [];

    for (const model of models) {
      const supportedMethods = model.supportedGenerationMethods || [];
      if (supportedMethods.includes('generateContent')) {
        const apiVersion = modelsData.apiVersion || 'v1beta';
        const modelInfo = {
          name: model.name.replace('models/', ''),
          apiVersion,
        };
        this.cachedModel = modelInfo;
        return modelInfo;
      }
    }

    this.cachedModel = { name: 'gemini-pro', apiVersion: 'v1beta' };
    return this.cachedModel;
  }

  private async callGeminiAPI(userMessage: MessageDto): Promise<void> {
    const apiKey = process.env.GEMINI_API_KEY;

    const modelInfo = await this.getAvailableModel();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/${modelInfo.apiVersion}/models/${modelInfo.name}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage.message,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const geminiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response.';

    const geminiMessage: MessageDto = {
      id: `message-id-${uuidv4()}`,
      username: 'Gemini AI',
      message: geminiResponse,
    };

    this.messages.push(geminiMessage);
    while (this.messages.length > 10) {
      this.messages.shift();
    }

    this.chatGateway.emitMessage(geminiMessage);
  }

  getMessages(): MessageDto[] {
    return this.messages;
  }

  private async listGeminiModels(): Promise<any> {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return { ...data, apiVersion: 'v1beta' };
    }

    const responseV1 = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!responseV1.ok) {
      const errorData = await responseV1.json().catch(() => ({}));
      throw new Error(
        `Failed to list models: ${responseV1.status} ${responseV1.statusText}. ${JSON.stringify(errorData)}`,
      );
    }

    const data = await responseV1.json();
    return { ...data, apiVersion: 'v1' };
  }
}
