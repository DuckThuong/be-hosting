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
    if (user.id === payload.toUserId) {
      throw new BadRequestException(ErrorChatMessage.CANNOT_CHAT_WITH_YOURSELF);
    }

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

    const contactData: ContactToUserDto = {
      fromUser,
      toUserId: toUser.id as number,
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

    return this.chatRepository.getMessages(conversationId, page, limit);
  }

  public async sendMessage(
    conversationId: number,
    senderId: number,
    content: string,
  ): Promise<any> {
    if (!content || content.trim().length === 0) {
      throw new BadRequestException(ErrorChatMessage.MESSAGE_CONTENT_NOTEMPTY);
    }

    if (content.length > 2000) {
      throw new BadRequestException(ErrorChatMessage.MESSAGE_CONTENT_TOO_LONG);
    }

    const conversation =
      await this.chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundException(ErrorChatMessage.CONVERSATION_NOT_FOUND);
    }

    const isMember = await this.chatRepository.isParticipant(
      conversationId,
      senderId,
    );
    if (!isMember) {
      throw new ForbiddenException(ErrorChatMessage.FORBIDDEN_SEND_MESSAGE);
    }

    return this.chatRepository.sendMessage(
      conversationId,
      senderId,
      content.trim(),
    );
  }
}
