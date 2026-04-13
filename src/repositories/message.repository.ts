import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessagePayloadDto } from '../dtos/chat/message.dto';
import { MessageStatus, TbMessage } from '../entities/chat/message.entity';

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
      senderAvatarUrl: dto.senderAvatarUrl,
      content: dto.content,
      type: dto.type,
      metadata: dto.metadata ?? null,
      replyToMessageId: dto.replyToMessageId,
      status: dto.status ?? MessageStatus.SENT,
    });
    return await this.message.save(newMessage);
  }
}
