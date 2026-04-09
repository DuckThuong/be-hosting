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
import { MarkMessageReadSocketPayloadDto } from '../dtos/chat/chat-realtime.dto';
import { MessageStatus } from '../entities/chat/message.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { UserRepository } from '../repositories/user.repository';
import {
  UserDecoratorDtoResponse,
  UserResponseDto,
} from '../dtos/user/user.dto';
import { ChatRealtimeService } from './chat-realtime.service';
import { MessageResponseDto } from '../dtos/chat/message-response.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
    private readonly chatRealtimeService: ChatRealtimeService,
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

  public async ensureParticipantAccess(conversationId: number, userId: number) {
    return this.validateParticipantAccess(conversationId, userId);
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

    const messages = await this.chatRepository.getMessages(
      conversationId,
      page,
      limit,
    );

    return messages.map((message) => MessageResponseDto.fromEntity(message));
  }

  public async sendMessage(
    user: UserDecoratorDtoResponse,
    dto: SendMessageDto,
    requestId?: string,
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

    const savedMessage = await this.chatRepository.sendMessage(
      user.id,
      {
        ...dto,
        content: dto.content?.trim(),
      },
      sender?.avatarUrl,
    );

    const participantIds =
      await this.chatRepository.getConversationParticipantIds(
        dto.conversationId,
      );
    const recipientIds = participantIds.filter(
      (participantId) => participantId !== user.id,
    );
    let latestStatus = savedMessage.status;

    for (const recipientId of recipientIds) {
      if (!this.chatRealtimeService.isUserOnline(recipientId)) continue;

      const deliveredMessage = await this.chatRepository.updateMessageStatus(
        savedMessage.id,
        MessageStatus.DELIVERED,
      );
      if (deliveredMessage) {
        savedMessage.status = deliveredMessage.status;
        latestStatus = deliveredMessage.status;
      }
      break;
    }

    this.chatRealtimeService.publishMessageSent(
      MessageResponseDto.fromEntity(savedMessage),
      requestId,
    );

    if (latestStatus !== MessageStatus.SENT) {
      this.chatRealtimeService.publishMessageStatusUpdated(
        {
          conversationId: savedMessage.conversationId,
          messageId: savedMessage.id,
          status: latestStatus,
          updatedAt: new Date().toISOString(),
          actorUserId: user.id,
        },
        requestId,
      );
    }

    const conversations = await Promise.all(
      participantIds.map(async (participantId) => ({
        userId: participantId,
        conversation: await this.chatRepository.getConversationResponseForUser(
          participantId,
          dto.conversationId,
        ),
      })),
    );

    conversations.forEach(({ userId, conversation }) => {
      if (!conversation) return;
      this.chatRealtimeService.publishConversationUpdated(
        userId,
        conversation,
        requestId,
      );
    });

    return savedMessage;
  }

  public async markConversationAsReadViaSocket(
    userId: number,
    dto: MarkMessageReadSocketPayloadDto,
    requestId?: string,
  ): Promise<void> {
    await this.validateParticipantAccess(dto.conversationId, userId);

    const updatedMessage =
      await this.chatRepository.markConversationAsReadAndReturnMessage(
        dto.conversationId,
        userId,
        dto.messageId,
      );

    if (!updatedMessage) {
      return;
    }

    this.chatRealtimeService.publishMessageStatusUpdated(
      {
        conversationId: updatedMessage.conversationId,
        messageId: updatedMessage.id,
        status: MessageStatus.READ,
        updatedAt: new Date().toISOString(),
        actorUserId: userId,
      },
      requestId,
    );

    const participantIds =
      await this.chatRepository.getConversationParticipantIds(
        dto.conversationId,
      );
    const conversations = await Promise.all(
      participantIds.map(async (participantId) => ({
        userId: participantId,
        conversation: await this.chatRepository.getConversationResponseForUser(
          participantId,
          dto.conversationId,
        ),
      })),
    );

    conversations.forEach(({ userId: participantId, conversation }) => {
      if (!conversation) return;

      this.chatRealtimeService.publishConversationUpdated(
        participantId,
        conversation,
        requestId,
      );
    });
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
