import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ContactToUserDto,
  ConversationResponseDto,
} from '../dtos/chat/chat.dto';
import { UserResponseDto } from '../dtos/user/user.dto';
import {
  ConversationType,
  TbConversation,
} from '../entities/chat/converation.entity';
import { TbConversationParticipant } from '../entities/chat/converation_paticipant.entity';
import { MessageType, TbMessage } from '../entities/chat/message.entity';
import { UserRepository } from './user.repository';
import { MessagePayloadDto, MessageTypeEnum } from '../dtos/chat/message.dto';
import {
  ContactMessageTemplate,
  RentLocationMessageTemplate,
} from '../templates/message.template';
import { LocationRepository } from './location.repository';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(TbConversation)
    private readonly conversation: Repository<TbConversation>,

    @InjectRepository(TbConversationParticipant)
    private readonly conversationParticipant: Repository<TbConversationParticipant>,

    @InjectRepository(TbMessage)
    private readonly message: Repository<TbMessage>,

    @Inject(forwardRef(() => UserRepository))
    private readonly userRepo: UserRepository,

    @Inject(forwardRef(() => LocationRepository))
    private readonly locationRepo: LocationRepository,
  ) {}

  private async createConversation(
    user: UserResponseDto,
    contactId: number,
    type: string,
  ): Promise<TbConversation> {
    const contact = await this.userRepo.getUserProfileByUserId(contactId);

    const newConversation = this.conversation.create({
      type: ConversationType.PRIVATE,
      name: `Cuộc trò chuyện giữa ${user.fullName ?? user.userName} và ${contact.fullName ?? contact.userName}`,
      avatar: contact.avatarUrl || '',
      lastMessage: 'Xin chào!',
      lastMessageAt: new Date(),
      lastMessageType: type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedConversation = await this.conversation.save(newConversation);

    const participants = this.conversationParticipant.create([
      { conversationId: savedConversation.id, userId: user.id },
      { conversationId: savedConversation.id, userId: contactId },
    ]);

    await this.conversationParticipant.save(participants);

    return savedConversation;
  }

  private async checkConversationExistence(
    user: UserResponseDto,
    contactId: number,
    type: string,
  ): Promise<TbConversation> {
    const result = await this.conversation
      .createQueryBuilder('c')
      .innerJoin(
        'tb_conversation_participant',
        'p1',
        'p1.conversationId = c.id AND p1.userId = :userA',
        { userA: user.id },
      )
      .innerJoin(
        'tb_conversation_participant',
        'p2',
        'p2.conversationId = c.id AND p2.userId = :userB',
        { userB: contactId },
      )
      .where('c.type = :type', { type: ConversationType.PRIVATE })
      .getOne();

    if (!result) {
      return this.createConversation(user, contactId, type);
    } else {
      return result;
    }
  }

  public async findConversationById(
    conversationId: number,
  ): Promise<TbConversation> {
    return (await this.conversation.findOne({
      where: { id: conversationId },
    })) as TbConversation;
  }

  public async isParticipant(
    conversationId: number,
    userId: number,
  ): Promise<boolean> {
    const result = await this.conversationParticipant.findOne({
      where: { conversationId, userId },
    });
    return !!result;
  }

  public async contactToUser(payload: ContactToUserDto): Promise<any> {
    const conversation = await this.checkConversationExistence(
      payload.fromUser,
      payload.toUserId,
      payload.type as string,
    );

    if (payload.type === MessageTypeEnum.RENT && payload.locationCd) {
      const location = await this.locationRepo.GetLocationByCode(
        payload.locationCd,
      );
      const newMessage: MessagePayloadDto = {
        avartarUrl: payload.fromUser.avatarUrl,
        conversationId: conversation.id,
        senderId: payload.fromUser.id!,
        content: RentLocationMessageTemplate({
          imgUrl: location?.locationLogo as string,
          locationName: location?.locationName || '',
          locationPriceStart: location?.locationPriceStart || '0',
          locationPriceEnd: location?.locationPriceEnd || '0',
          typeName: location?.typeName as string,
          time: new Date().toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          }),
        }),
        type: MessageType.SYSTEM,
        metaData: '',
      };
      await this.message.save(this.message.create(newMessage));
    } else if (payload.type === MessageTypeEnum.CONTACT && payload.locationCd) {
      const location = await this.locationRepo.GetLocationByCode(
        payload.locationCd,
      );
      const newMessage: MessagePayloadDto = {
        avartarUrl: payload.fromUser.avatarUrl,
        conversationId: conversation.id,
        senderId: payload.fromUser.id!,
        content: ContactMessageTemplate({
          imgUrl: location?.locationLogo as string,
          locationName: location?.locationName || '',
          locationPriceStart: location?.locationPriceStart || '0',
          locationPriceEnd: location?.locationPriceEnd || '0',
          typeName: location?.typeName as string,
        }),
        type: MessageType.SYSTEM,
        metaData: '',
      };
      await this.message.save(this.message.create(newMessage));
    }

    return conversation;
  }

  public async getConversations(userId: number): Promise<TbConversation[]> {
    return await this.conversation
      .createQueryBuilder('c')
      .innerJoin(
        'tb_conversation_participant',
        'p',
        'p.conversationId = c.id AND p.userId = :userId',
        { userId },
      )
      .orderBy('c.lastMessageAt', 'DESC')
      .getMany();
  }

  public async getMessages(
    conversationId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<TbMessage[]> {
    return await this.message.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  public async sendMessage(
    conversationId: number,
    senderId: number,
    content: string,
  ): Promise<TbMessage> {
    const newMessage = this.message.create({
      conversationId,
      senderId,
      content,
      createdAt: new Date(),
    });
    const saved = await this.message.save(newMessage);

    await this.conversation.update(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date(),
    });

    return saved;
  }

  public async getAllConversations(
    userId: number,
  ): Promise<ConversationResponseDto[]> {
    const conversations = await this.getConversations(userId);
    if (conversations.length === 0) return [];

    const conversationIds = conversations.map((c) => c.id);

    const allParticipants = await this.conversationParticipant
      .createQueryBuilder('cp')
      .where('cp.conversationId IN (:...conversationIds)', { conversationIds })
      .getMany();

    const lastMessages = await this.message
      .createQueryBuilder('m')
      .where('m.conversationId IN (:...conversationIds)', { conversationIds })
      .orderBy('m.createdAt', 'DESC')
      .getMany();

    const otherParticipantIds = [
      ...new Set(
        allParticipants
          .filter((cp) => cp.userId !== userId)
          .map((cp) => cp.userId),
      ),
    ];

    const otherUsers =
      await this.userRepo.getUserProfilesByUserIds(otherParticipantIds);

    const userMap = new Map(otherUsers.map((u) => [u.id, u]));

    return conversations.map((conversation) => {
      const participants = allParticipants.filter(
        (cp) => cp.conversationId === conversation.id,
      );

      const otherParticipant = participants.find((cp) => cp.userId !== userId);

      const toUser = otherParticipant
        ? (userMap.get(otherParticipant.userId) ?? null)
        : null;

      const lastMessage =
        lastMessages.find((m) => m.conversationId === conversation.id) ?? null;

      return {
        conversationId: conversation.id,
        conversationType: conversation.type,
        conversationName: conversation.name,
        conversationAvatar: conversation.avatar,
        lastMessage: lastMessage?.content ?? conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        lastMessageType: conversation.lastMessageType,
        conversationCreatedAt: conversation.createdAt,
        participants,
        toUser,
      } as ConversationResponseDto;
    });
  }
}
