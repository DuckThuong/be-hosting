import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/user.controller';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { UserService } from '../services/user.service';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import { UserRepository } from '../repositories/user.repository';
import { ChatRepository } from '../repositories/chat.repository';
import { TbConversation } from '../entities/chat/converation.entity';
import { TbConversationParticipant } from '../entities/chat/converation_paticipant.entity';
import { TbMessage } from '../entities/chat/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TbUserDefault,
      TbUserProfile,
      TbConversation,
      TbConversationParticipant,
      TbMessage,
    ]),
  ],
  providers: [UserService, UserRepository, ChatRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
