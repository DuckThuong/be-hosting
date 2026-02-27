import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TbConversation } from '../entities/chat/converation.entity';
import { Repository } from 'typeorm';
import { TbConversationParticipant } from '../entities/chat/converation_paticipant.entity';
import { TbMessage } from '../entities/chat/message.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(TbConversation)
    private readonly conversation: Repository<TbConversation>,

    @InjectRepository(TbConversationParticipant)
    private readonly conversationParticipant: Repository<TbConversationParticipant>,

    @InjectRepository(TbMessage)
    private readonly message: Repository<TbMessage>,
  ) {}
}
