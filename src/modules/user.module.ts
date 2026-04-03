import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/user.controller';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { UserService } from '../services/user.service';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import { UserRepository } from '../repositories/user.repository';
import { ChatRepository } from '../repositories/chat.repository';
import { TbConversation } from '../entities/chat/conversation.entity';
import { TbConversationParticipant } from '../entities/chat/conversation_participant.entity';
import { TbMessageAttachment } from '../entities/chat/message_attachment.entity';
import { TbMessage } from '../entities/chat/message.entity';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbLocationFavorite } from '../entities/location/locationFavorite.entity';
import { TbLocationMedia } from '../entities/location/locationMedia.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationRepository } from '../repositories/location.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TbUserDefault,
      TbUserProfile,
      TbConversation,
      TbConversationParticipant,
      TbMessage,
      TbMessageAttachment,
      TbLocation,
      TbLocationAddress,
      TbLocationFavorite,
      TbLocationMedia,
      TbLocationService,
      TbLocationType,
    ]),
  ],
  providers: [UserService, UserRepository, ChatRepository, LocationRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
