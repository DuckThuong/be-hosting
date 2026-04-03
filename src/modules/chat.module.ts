import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from '../controllers/chat.controller';
import { TbConversation } from '../entities/chat/converation.entity';
import { TbConversationParticipant } from '../entities/chat/converation_paticipant.entity';
import { TbMessage } from '../entities/chat/message.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatService } from '../services/chat.service';
import { UserRepository } from '../repositories/user.repository';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import { LocationRepository } from '../repositories/location/location.repository';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TbConversation,
      TbConversationParticipant,
      TbMessage,
      TbUserDefault,
      TbUserProfile,
      TbLocation,
      TbLocationAddress,
      TbLocationService,
      TbLocationType,
    ]),
  ],
  providers: [ChatService, ChatRepository, UserRepository, LocationRepository],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
