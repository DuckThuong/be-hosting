import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactToUserDto } from '../dtos/chat/chat.dto';
import {
  ConversationType,
  TbConversation,
} from '../entities/chat/converation.entity';
import { TbConversationParticipant } from '../entities/chat/converation_paticipant.entity';
import { TbMessage } from '../entities/chat/message.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(TbConversation)
    private readonly conversation: Repository<TbConversation>,

    @InjectRepository(TbConversationParticipant)
    private readonly conversationParticipant: Repository<TbConversationParticipant>,

    @InjectRepository(TbMessage)
    private readonly message: Repository<TbMessage>,

    private readonly userRepo: UserRepository,
  ) {}

  private async createConversation(
    userId: number,
    contactId: number,
  ): Promise<TbConversation> {
    const user = await this.userRepo.getUserProfileByUserId(userId);
    const contact = await this.userRepo.getUserProfileByUserId(contactId);

    const newConversation = this.conversation.create({
      type: ConversationType.PRIVATE,
      name: `Cuộc trò chuyện giữa ${user.fullName} và ${contact.fullName}`,
      avatar: contact.avatarUrl || '',
      lastMessage: 'Xin chào!',
      lastMessageAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedConversation = await this.conversation.save(newConversation);

    const participants = this.conversationParticipant.create([
      { conversationId: savedConversation.id, userId: userId },
      { conversationId: savedConversation.id, userId: contactId },
    ]);
    await this.conversationParticipant.save(participants);

    return savedConversation;
  }

  private async checkConversationExistence(
    userId: number,
    contactId: number,
  ): Promise<TbConversation> {
    const result = await this.conversation
      .createQueryBuilder('c')
      .innerJoin(
        'tb_conversation_participant',
        'p1',
        'p1.conversationId = c.id AND p1.userId = :userA',
        { userA: userId },
      )
      .innerJoin(
        'tb_conversation_participant',
        'p2',
        'p2.conversationId = c.id AND p2.userId = :userB',
        { userB: contactId },
      )
      .where('c.type = :type', { type: ConversationType.PRIVATE })
      .limit(1)
      .getOne();

    if (result === null) {
      return this.createConversation(userId, contactId);
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
      payload.fromUserId,
      payload.toUserId,
    );
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
}
