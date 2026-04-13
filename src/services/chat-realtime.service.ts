import { Injectable, Logger } from '@nestjs/common';
import type { Socket, Server } from 'socket.io';
import { ConversationResponseDto } from '../dtos/chat/chat.dto';
import {
  ConversationUpdatedEventDto,
  MessageSentEventDto,
  MessageStatusUpdatedEventDto,
  MessageStatusUpdatedPayloadDto,
  SocketEventEnvelopeDto,
} from '../dtos/chat/chat-realtime.dto';
import { MessageResponseDto } from '../dtos/chat/message-response.dto';

@Injectable()
export class ChatRealtimeService {
  private readonly logger = new Logger(ChatRealtimeService.name);
  private server?: Server;
  private readonly onlineUserSockets = new Map<number, Set<string>>();

  public readonly events = {
    join: 'chat.join',
    leave: 'chat.leave',
    sendMessage: 'chat.message.send',
    readMessage: 'chat.message.read',
    messageSent: 'chat.message.sent',
    messageStatusUpdated: 'chat.message.status.updated',
    conversationUpdated: 'chat.conversation.updated',
  } as const;

  public setServer(server: Server): void {
    this.server = server;
  }

  public getConversationRoom(conversationId: number): string {
    return `conversation:${conversationId}`;
  }

  public getUserRoom(userId: number): string {
    return `user:${userId}`;
  }

  public joinUserRoom(client: Socket, userId: number): void {
    const currentSockets = this.onlineUserSockets.get(userId) ?? new Set<string>();
    currentSockets.add(client.id);
    this.onlineUserSockets.set(userId, currentSockets);
    void client.join(this.getUserRoom(userId));
  }

  public disconnectUser(client: Socket, userId: number): void {
    const currentSockets = this.onlineUserSockets.get(userId);
    if (!currentSockets) return;

    currentSockets.delete(client.id);
    if (currentSockets.size === 0) {
      this.onlineUserSockets.delete(userId);
      return;
    }

    this.onlineUserSockets.set(userId, currentSockets);
  }

  public isUserOnline(userId: number): boolean {
    return (this.onlineUserSockets.get(userId)?.size ?? 0) > 0;
  }

  public async joinConversationRoom(
    client: Socket,
    conversationId: number,
  ): Promise<void> {
    await client.join(this.getConversationRoom(conversationId));
  }

  public async leaveConversationRoom(
    client: Socket,
    conversationId: number,
  ): Promise<void> {
    await client.leave(this.getConversationRoom(conversationId));
  }

  public publishMessageSent(
    message: MessageResponseDto,
    requestId?: string,
  ): void {
    const payload: MessageSentEventDto = this.buildEnvelope(
      this.events.messageSent,
      message,
      message.conversationId,
      requestId,
    );

    this.server
      ?.to(this.getConversationRoom(message.conversationId))
      .emit(this.events.messageSent, payload);
  }

  public publishConversationUpdated(
    userId: number,
    conversation: ConversationResponseDto,
    requestId?: string,
  ): void {
    const payload: ConversationUpdatedEventDto = this.buildEnvelope(
      this.events.conversationUpdated,
      conversation,
      conversation.conversationId,
      requestId,
    );

    this.server
      ?.to(this.getUserRoom(userId))
      .emit(this.events.conversationUpdated, payload);
  }

  public publishMessageStatusUpdated(
    payload: MessageStatusUpdatedPayloadDto,
    requestId?: string,
  ): void {
    const eventPayload: MessageStatusUpdatedEventDto = this.buildEnvelope(
      this.events.messageStatusUpdated,
      payload,
      payload.conversationId,
      requestId,
    );

    this.server
      ?.to(this.getConversationRoom(payload.conversationId))
      .emit(this.events.messageStatusUpdated, eventPayload);
  }

  private buildEnvelope<T>(
    event: string,
    data: T,
    conversationId?: number,
    requestId?: string,
  ): SocketEventEnvelopeDto<T> {
    return {
      event,
      data,
      meta: {
        requestId,
        conversationId,
        sentAt: new Date().toISOString(),
        version: 1,
      },
    };
  }

  public warnUnavailable(): void {
    if (!this.server) {
      this.logger.warn('Socket server has not been attached yet.');
    }
  }
}
