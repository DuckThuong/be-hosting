import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from '../controllers/chat.controller';
import { TbConversation } from '../entities/chat/conversation.entity';
import { TbConversationParticipant } from '../entities/chat/conversation_participant.entity';
import { TbMessageAttachment } from '../entities/chat/message_attachment.entity';
import { TbMessage } from '../entities/chat/message.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatService } from '../services/chat.service';
import { UserRepository } from '../repositories/user.repository';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import { LocationRepository } from '../repositories/location/location.repository';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbLocationFavorite } from '../entities/location/locationFavorite.entity';
import { TbLocationMedia } from '../entities/location/locationMedia.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { ChatGateway } from '../gateways/chat.gateway';
import { ChatRealtimeService } from '../services/chat-realtime.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TbConversation,
      TbConversationParticipant,
      TbMessage,
      TbMessageAttachment,
      TbUserDefault,
      TbUserProfile,
      TbLocation,
      TbLocationAddress,
      TbLocationFavorite,
      TbLocationMedia,
      TbLocationService,
      TbLocationType,
    ]),
  ],
  providers: [
    ChatService,
    ChatRepository,
    UserRepository,
    LocationRepository,
    ChatGateway,
    ChatRealtimeService,
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
