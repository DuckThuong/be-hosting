import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TbMessage } from '../entities/chat/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagePayloadDto } from '../dtos/chat/message.dto';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(TbMessage)
    private readonly message: Repository<TbMessage>,
  ) {}

  public async createMessage(dto: MessagePayloadDto): Promise<TbMessage> {
    const newMessage = this.message.create({
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      content: dto.content,
      type: dto.type,
      metadata: dto.metaData,
      createdAt: new Date(),
      isDeleted: false,
    });
    return await this.message.save(newMessage);
  }
}
