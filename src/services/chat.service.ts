import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorChatMessage } from '../assests/messages/chat.message';
import {
  ContactToUserDto,
  ContactToUserPayloadDto,
  MarkConversationReadDto,
  MuteConversationDto,
  MuteConversationPreset,
  PinConversationDto,
  SendMessageDto,
  SetConversationNicknameDto,
} from '../dtos/chat/chat.dto';
import { ChatRepository } from '../repositories/chat.repository';
import { UserRepository } from '../repositories/user.repository';
import {
  UserDecoratorDtoResponse,
  UserResponseDto,
} from '../dtos/user/user.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private async validateParticipantAccess(
    conversationId: number,
    userId: number,
  ) {
    const conversation =
      await this.chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundException(ErrorChatMessage.CONVERSATION_NOT_FOUND);
    }

    const participant = await this.chatRepository.findParticipant(
      conversationId,
      userId,
    );
    if (!participant) {
      throw new ForbiddenException(ErrorChatMessage.NOT_A_PARTICIPANT);
    }

    return participant;
  }

  private resolveMuteUntil(preset: MuteConversationPreset): Date {
    const now = new Date();

    switch (preset) {
      case MuteConversationPreset.FIFTEEN_MINUTES:
        return new Date(now.getTime() + 15 * 60 * 1000);
      case MuteConversationPreset.ONE_HOUR:
        return new Date(now.getTime() + 60 * 60 * 1000);
      case MuteConversationPreset.EIGHT_HOURS:
        return new Date(now.getTime() + 8 * 60 * 60 * 1000);
      case MuteConversationPreset.TWENTY_FOUR_HOURS:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case MuteConversationPreset.NO_END_TIME_YET:
        return new Date('2099-12-31T23:59:59.999Z');
      default:
        throw new BadRequestException(ErrorChatMessage.MUTE_PRESET_INVALID);
    }
  }

  public async contactToUser(
    user: UserDecoratorDtoResponse,
    payload: ContactToUserPayloadDto,
  ): Promise<any> {
    let [fromUser, toUser] = [{}, {}] as UserResponseDto[];

    try {
      if (payload.toUserId) {
        [fromUser, toUser] = await Promise.all([
          this.userRepository.getUserProfileByUserId(user.id),
          this.userRepository.getUserProfileByUserId(payload.toUserId),
        ]);
      } else if (payload.toUserCd) {
        [fromUser, toUser] = await Promise.all([
          this.userRepository.getUserProfileByUserId(user.id),
          this.userRepository.GetUserInfomation(payload.toUserCd),
        ]);
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException(ErrorChatMessage.TO_USER_NOT_FOUND);
    }
    if (!fromUser)
      throw new NotFoundException(ErrorChatMessage.FROM_USER_NOT_FOUND);
    if (!toUser)
      throw new NotFoundException(ErrorChatMessage.TO_USER_NOT_FOUND);

    if (fromUser.id === toUser.id) {
      throw new BadRequestException(ErrorChatMessage.CANNOT_CHAT_WITH_YOURSELF);
    }
    const contactData: ContactToUserDto = {
      fromUser,
      toUserId: toUser.id as number,
      type: payload.type,
      locationCd: payload.locationCd,
    };

    return this.chatRepository.contactToUser(contactData);
  }

  public async getConversations(userId: number): Promise<any> {
    const user = await this.userRepository.getUserProfileByUserId(userId);
    if (!user)
      throw new NotFoundException(ErrorChatMessage.FROM_USER_NOT_FOUND);
    return this.chatRepository.getAllConversations(userId);
  }

  public async getMessages(
    conversationId: number,
    userId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    if (page < 1) {
      throw new BadRequestException(ErrorChatMessage.PAGE_INVALID);
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException(ErrorChatMessage.LIMIT_INVALID);
    }

    await this.validateParticipantAccess(conversationId, userId);

    return this.chatRepository.getMessages(conversationId, page, limit);
  }

  public async sendMessage(
    user: UserDecoratorDtoResponse,
    dto: SendMessageDto,
  ): Promise<any> {
    const hasContent = !!dto.content?.trim();
    const hasAttachments = !!dto.attachments?.length;

    if (!hasContent && !hasAttachments) {
      throw new BadRequestException(ErrorChatMessage.MESSAGE_CONTENT_NOTEMPTY);
    }

    if (dto.content && dto.content.length > 2000) {
      throw new BadRequestException(ErrorChatMessage.MESSAGE_CONTENT_TOO_LONG);
    }

    const conversation = await this.chatRepository.findConversationById(
      dto.conversationId,
    );
    if (!conversation) {
      throw new NotFoundException(ErrorChatMessage.CONVERSATION_NOT_FOUND);
    }

    const isMember = await this.chatRepository.isParticipant(
      dto.conversationId,
      user.id,
    );
    if (!isMember) {
      throw new ForbiddenException(ErrorChatMessage.FORBIDDEN_SEND_MESSAGE);
    }

    const sender = await this.userRepository.getUserProfileByUserId(user.id);

    return this.chatRepository.sendMessage(
      user.id,
      {
        ...dto,
        content: dto.content?.trim(),
      },
      sender?.avatarUrl,
    );
  }

  public async markConversationAsRead(
    userId: number,
    dto: MarkConversationReadDto,
  ): Promise<any> {
    await this.validateParticipantAccess(dto.conversationId, userId);

    return this.chatRepository.markConversationAsRead(
      dto.conversationId,
      userId,
      dto.messageId,
    );
  }

  public async setConversationNickname(
    userId: number,
    dto: SetConversationNicknameDto,
  ): Promise<any> {
    await this.validateParticipantAccess(dto.conversationId, userId);

    const nickname = dto.nickname?.trim() || null;
    if (nickname && nickname.length > 255) {
      throw new BadRequestException(ErrorChatMessage.NICKNAME_TOO_LONG);
    }

    return this.chatRepository.updateConversationNickname(
      dto.conversationId,
      userId,
      nickname,
    );
  }

  public async pinConversation(
    userId: number,
    dto: PinConversationDto,
  ): Promise<any> {
    await this.validateParticipantAccess(dto.conversationId, userId);

    return this.chatRepository.updateConversationPinState(
      dto.conversationId,
      userId,
      dto.isPinned,
    );
  }

  public async muteConversation(
    userId: number,
    dto: MuteConversationDto,
  ): Promise<any> {
    await this.validateParticipantAccess(dto.conversationId, userId);

    return this.chatRepository.updateConversationMuteState(
      dto.conversationId,
      userId,
      this.resolveMuteUntil(dto.preset),
    );
  }
}
