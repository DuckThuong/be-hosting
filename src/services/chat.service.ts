import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repositories/chat.repository';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}
}
