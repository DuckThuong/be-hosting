import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from '../controllers/chat.controller';
import { TbConversation } from '../entities/chat/converation.entity';
import { TbConversationParticipant } from '../entities/chat/converation_paticipant.entity';
import { TbMessage } from '../entities/chat/message.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatService } from '../services/chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TbConversation,
      TbConversationParticipant,
      TbMessage,
    ]),
  ],
  providers: [ChatService, ChatRepository],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
