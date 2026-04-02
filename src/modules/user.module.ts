import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/user.controller';
import { TbConversation } from '../entities/chat/converation.entity';
import { TbConversationParticipant } from '../entities/chat/converation_paticipant.entity';
import { TbMessage } from '../entities/chat/message.entity';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { LocationRepository } from '../repositories/location.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TbUserDefault,
      TbUserProfile,
      TbConversation,
      TbConversationParticipant,
      TbMessage,
      TbLocation,
      TbLocationAddress,
      TbLocationService,
      TbLocationType,
    ]),
  ],
  providers: [UserService, UserRepository, ChatRepository, LocationRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
