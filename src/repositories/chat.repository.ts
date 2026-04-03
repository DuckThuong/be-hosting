import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  ContactToUserDto,
  ConversationResponseDto,
  SendMessageDto,
} from '../dtos/chat/chat.dto';
import { UserResponseDto } from '../dtos/user/user.dto';
import {
  ConversationStatus,
  ConversationType,
  TbConversation,
} from '../entities/chat/conversation.entity';
import { PublicConversationType } from '../dtos/chat/chat.dto';
import { TbConversationParticipant } from '../entities/chat/conversation_participant.entity';
import { TbMessageAttachment } from '../entities/chat/message_attachment.entity';
import { MessageStatus, MessageType, TbMessage } from '../entities/chat/message.entity';
import { UserRepository } from './user.repository';
import { MessageAttachmentPayloadDto, MessagePayloadDto, MessageTypeEnum } from '../dtos/chat/message.dto';
import {
  ContactMessageTemplate,
  RentLocationMessageTemplate,
} from '../templates/message.template';
import { LocationRepository } from './location.repository';

@Injectable()
export class ChatRepository {
  private readonly privateConversationTypes = [
    ConversationType.RENT,
    ConversationType.CONTACT,
    ConversationType.NORMAL,
    ConversationType.PRIVATE,
  ];

  constructor(
    @InjectRepository(TbConversation)
    private readonly conversation: Repository<TbConversation>,

    @InjectRepository(TbConversationParticipant)
    private readonly conversationParticipant: Repository<TbConversationParticipant>,

    @InjectRepository(TbMessage)
    private readonly message: Repository<TbMessage>,

    @InjectRepository(TbMessageAttachment)
    private readonly messageAttachment: Repository<TbMessageAttachment>,

    @Inject(forwardRef(() => UserRepository))
    private readonly userRepo: UserRepository,

    @Inject(forwardRef(() => LocationRepository))
    private readonly locationRepo: LocationRepository,
  ) {}

  private getMessagePreview(
    type: MessageType,
    content?: string,
    attachments?: MessageAttachmentPayloadDto[],
  ): string {
    if (content?.trim()) {
      return content.trim().slice(0, 255);
    }

    if (type === MessageType.IMAGE) {
      return '[Image]';
    }

    if (type === MessageType.FILE) {
      return '[File]';
    }

    if (attachments?.length) {
      return attachments[0].mimeType.startsWith('image/') ? '[Image]' : '[File]';
    }

    return '[Message]';
  }

  private normalizeConversationType(
    type: ConversationType,
  ): PublicConversationType {
    if (type === ConversationType.RENT) {
      return PublicConversationType.RENT;
    }

    if (type === ConversationType.CONTACT) {
      return PublicConversationType.CONTACT;
    }

    return PublicConversationType.NORMAL;
  }

  private resolveConversationType(type?: string): ConversationType {
    if (type === MessageTypeEnum.RENT) {
      return ConversationType.RENT;
    }

    if (type === MessageTypeEnum.CONTACT) {
      return ConversationType.CONTACT;
    }

    return ConversationType.NORMAL;
  }

  private async createConversation(
    user: UserResponseDto,
    contactId: number,
    type: ConversationType,
  ): Promise<TbConversation> {
    const contact = await this.userRepo.getUserProfileByUserId(contactId);

    const newConversation = this.conversation.create({
      type,
      name: contact?.fullName ?? contact?.userName ?? undefined,
      avatar: contact?.avatarUrl || undefined,
      createdByUserId: user.id!,
      status: ConversationStatus.ACTIVE,
    });
    const savedConversation = await this.conversation.save(newConversation);

    const participants = this.conversationParticipant.create([
      { conversationId: savedConversation.id, userId: user.id!, unreadCount: 0 },
      { conversationId: savedConversation.id, userId: contactId, unreadCount: 0 },
    ]);

    await this.conversationParticipant.save(participants);

    return savedConversation;
  }

  private async checkConversationExistence(
    user: UserResponseDto,
    contactId: number,
    type: ConversationType,
  ): Promise<TbConversation> {
    const result = await this.conversation
      .createQueryBuilder('c')
      .innerJoin(
        'tb_conversation_participant',
        'p1',
        'p1.conversationId = c.id AND p1.userId = :userA AND p1.deletedAt IS NULL',
        { userA: user.id },
      )
      .innerJoin(
        'tb_conversation_participant',
        'p2',
        'p2.conversationId = c.id AND p2.userId = :userB AND p2.deletedAt IS NULL',
        { userB: contactId },
      )
      .where('c.type IN (:...types)', { types: this.privateConversationTypes })
      .andWhere('c.status != :blocked', {
        blocked: ConversationStatus.BLOCKED,
      })
      .andWhere(
        `(SELECT COUNT(*) FROM tb_conversation_participant cp WHERE cp.conversationId = c.id AND cp.deletedAt IS NULL) = 2`,
      )
      .getOne();

    if (!result) {
      return this.createConversation(user, contactId, type);
    }

    if (result.type !== type && type !== ConversationType.NORMAL) {
      result.type = type;
      return this.conversation.save(result);
    }

    return result;
  }

  private async persistMessage(
    payload: MessagePayloadDto,
  ): Promise<TbMessage> {
    return this.message.manager.transaction(async (manager) => {
      const messageRepo = manager.getRepository(TbMessage);
      const conversationRepo = manager.getRepository(TbConversation);
      const participantRepo = manager.getRepository(TbConversationParticipant);
      const attachmentRepo = manager.getRepository(TbMessageAttachment);

      const createdMessage = messageRepo.create({
        conversationId: payload.conversationId,
        senderId: payload.senderId,
        senderAvatarUrl: payload.senderAvatarUrl,
        content: payload.content?.trim() || undefined,
        type: payload.type,
        metadata: payload.metadata ?? null,
        replyToMessageId: payload.replyToMessageId,
        status: payload.status ?? MessageStatus.SENT,
      });
      const savedMessage = await messageRepo.save(createdMessage);

      if (payload.attachments?.length) {
        const attachments = attachmentRepo.create(
          payload.attachments.map((attachment) => ({
            ...attachment,
            messageId: savedMessage.id,
          })),
        );
        await attachmentRepo.save(attachments);
      }

      await conversationRepo.update(payload.conversationId, {
        lastMessageId: savedMessage.id,
        lastMessagePreview: this.getMessagePreview(
          payload.type,
          payload.content,
          payload.attachments,
        ),
        lastMessageType: payload.type,
        lastMessageAt: savedMessage.createdAt,
        status: ConversationStatus.ACTIVE,
      });

      await participantRepo
        .createQueryBuilder()
        .update(TbConversationParticipant)
        .set({
          unreadCount: () => 'unreadCount + 1',
          deletedAt: () => 'NULL',
        })
        .where('conversationId = :conversationId', {
          conversationId: payload.conversationId,
        })
        .andWhere('userId != :senderId', { senderId: payload.senderId })
        .execute();

      await participantRepo
        .createQueryBuilder()
        .update(TbConversationParticipant)
        .set({
          deletedAt: () => 'NULL',
        })
        .where('conversationId = :conversationId', {
          conversationId: payload.conversationId,
        })
        .andWhere('userId = :senderId', { senderId: payload.senderId })
        .execute();

      return savedMessage;
    });
  }

  public async findConversationById(
    conversationId: number,
  ): Promise<TbConversation | null> {
    return await this.conversation.findOne({
      where: { id: conversationId },
    });
  }

  public async isParticipant(
    conversationId: number,
    userId: number,
  ): Promise<boolean> {
    const result = await this.conversationParticipant.findOne({
      where: { conversationId, userId, deletedAt: IsNull() },
    });
    return !!result;
  }

  public async contactToUser(payload: ContactToUserDto): Promise<TbConversation> {
    const conversationType = this.resolveConversationType(payload.type);
    const conversation = await this.checkConversationExistence(
      payload.fromUser,
      payload.toUserId,
      conversationType,
    );

    if (payload.type === MessageTypeEnum.RENT && payload.locationCd) {
      const location = await this.locationRepo.GetLocationByCode(
        payload.locationCd,
      );
      await this.persistMessage({
        senderAvatarUrl: payload.fromUser.avatarUrl,
        conversationId: conversation.id,
        senderId: payload.fromUser.id!,
        content: RentLocationMessageTemplate({
          imgUrl: location?.locationLogo as string,
          locationName: location?.locationName || '',
          locationPriceStart: String(location?.locationPriceStart || '0'),
          locationPriceEnd: String(location?.locationPriceEnd || '0'),
          typeName: location?.typeName as string,
          time: new Date().toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          }),
        }),
        type: MessageType.SYSTEM,
        metadata: {
          messageType: MessageTypeEnum.RENT,
          locationCd: payload.locationCd,
        },
      });
    } else if (payload.type === MessageTypeEnum.CONTACT && payload.locationCd) {
      const location = await this.locationRepo.GetLocationByCode(
        payload.locationCd,
      );
      await this.persistMessage({
        senderAvatarUrl: payload.fromUser.avatarUrl,
        conversationId: conversation.id,
        senderId: payload.fromUser.id!,
        content: ContactMessageTemplate({
          imgUrl: location?.locationLogo as string,
          locationName: location?.locationName || '',
          locationPriceStart: String(location?.locationPriceStart || '0'),
          locationPriceEnd: String(location?.locationPriceEnd || '0'),
          typeName: location?.typeName as string,
        }),
        type: MessageType.SYSTEM,
        metadata: {
          messageType: MessageTypeEnum.CONTACT,
          locationCd: payload.locationCd,
        },
      });
    }

    return conversation;
  }

  public async getConversations(userId: number): Promise<TbConversation[]> {
    return await this.conversation
      .createQueryBuilder('c')
      .innerJoin(
        'tb_conversation_participant',
        'p',
        'p.conversationId = c.id AND p.userId = :userId AND p.deletedAt IS NULL',
        { userId },
      )
      .where('c.type IN (:...types)', { types: this.privateConversationTypes })
      .orderBy('p.isPinned', 'DESC')
      .addOrderBy('c.lastMessageAt', 'DESC')
      .getMany();
  }

  public async getMessages(
    conversationId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<TbMessage[]> {
    return await this.message.find({
      where: { conversationId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  public async sendMessage(
    senderId: number,
    dto: SendMessageDto,
    senderAvatarUrl?: string,
  ): Promise<TbMessage> {
    const type =
      dto.type ??
      (dto.attachments?.[0]?.mimeType?.startsWith('image/')
        ? MessageType.IMAGE
        : dto.attachments?.length
          ? MessageType.FILE
          : MessageType.TEXT);

    return await this.persistMessage({
      conversationId: dto.conversationId,
      senderId,
      senderAvatarUrl,
      content: dto.content,
      type,
      replyToMessageId: dto.replyToMessageId,
      attachments: dto.attachments,
    });
  }

  public async markConversationAsRead(
    conversationId: number,
    userId: number,
    messageId?: number,
  ): Promise<TbConversationParticipant | null> {
    const lastMessage =
      messageId != null
        ? await this.message.findOne({
            where: { id: messageId, conversationId, deletedAt: IsNull() },
          })
        : await this.message.findOne({
            where: { conversationId, deletedAt: IsNull() },
            order: { createdAt: 'DESC' },
          });

    if (!lastMessage) {
      return await this.conversationParticipant.findOne({
        where: { conversationId, userId, deletedAt: IsNull() },
      });
    }

    await this.conversationParticipant.update(
      { conversationId, userId, deletedAt: IsNull() },
      {
        lastReadMessageId: lastMessage.id,
        lastReadAt: new Date(),
        unreadCount: 0,
      },
    );

    await this.message.update(
      { id: lastMessage.id },
      { status: MessageStatus.READ },
    );

    return await this.conversationParticipant.findOne({
      where: { conversationId, userId, deletedAt: IsNull() },
    });
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
      .andWhere('cp.deletedAt IS NULL')
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

      const currentParticipant =
        participants.find((cp) => cp.userId === userId) ?? null;
      const otherParticipant =
        participants.find((cp) => cp.userId !== userId) ?? null;

      const toUser = otherParticipant
        ? (userMap.get(otherParticipant.userId) ?? null)
        : null;

      return {
        conversationId: conversation.id,
        conversationType: this.normalizeConversationType(conversation.type),
        conversationStatus: conversation.status,
        conversationName:
          toUser?.fullName ?? toUser?.userName ?? conversation.name ?? null,
        conversationAvatar: toUser?.avatarUrl ?? conversation.avatar ?? null,
        lastMessageId: conversation.lastMessageId ?? null,
        lastMessagePreview: conversation.lastMessagePreview ?? null,
        lastMessageAt: conversation.lastMessageAt ?? null,
        lastMessageType: conversation.lastMessageType ?? null,
        conversationCreatedAt: conversation.createdAt,
        unreadCount: currentParticipant?.unreadCount ?? 0,
        lastReadMessageId: currentParticipant?.lastReadMessageId ?? null,
        participants,
        toUser,
      } as ConversationResponseDto;
    });
  }
}
