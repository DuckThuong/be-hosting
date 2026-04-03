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
  SendMessageDto,
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

    const conversation =
      await this.chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundException(ErrorChatMessage.CONVERSATION_NOT_FOUND);
    }

    const isMember = await this.chatRepository.isParticipant(
      conversationId,
      userId,
    );
    if (!isMember) {
      throw new ForbiddenException(ErrorChatMessage.NOT_A_PARTICIPANT);
    }

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
    const conversation = await this.chatRepository.findConversationById(
      dto.conversationId,
    );
    if (!conversation) {
      throw new NotFoundException(ErrorChatMessage.CONVERSATION_NOT_FOUND);
    }

    const isMember = await this.chatRepository.isParticipant(
      dto.conversationId,
      userId,
    );
    if (!isMember) {
      throw new ForbiddenException(ErrorChatMessage.NOT_A_PARTICIPANT);
    }

    return this.chatRepository.markConversationAsRead(
      dto.conversationId,
      userId,
      dto.messageId,
    );
  }
}
