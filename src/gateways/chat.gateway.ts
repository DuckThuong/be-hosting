import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayDisconnect,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import {
  ChatJoinLeavePayloadDto,
  MarkMessageReadSocketPayloadDto,
  SendMessageSocketPayloadDto,
  SocketAckDto,
} from '../dtos/chat/chat-realtime.dto';
import { MessageResponseDto } from '../dtos/chat/message-response.dto';
import { JwtPayload } from '../dtos/jwt/jwt.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import { ChatRealtimeService } from '../services/chat-realtime.service';
import { ChatService } from '../services/chat.service';

type AuthenticatedSocket = Socket & {
  data: {
    user?: UserDecoratorDtoResponse;
  };
};

@WebSocketGateway({
  cors: {
    origin: [process.env.LOCAL_DOMAIN || 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly chatRealtimeService: ChatRealtimeService,
  ) {}

  public afterInit(server: Server): void {
    this.chatRealtimeService.setServer(server);
  }

  public async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const user = this.authenticateClient(client);
      client.data.user = user;
      this.chatRealtimeService.joinUserRoom(client, user.id);
    } catch (error) {
      this.logger.warn(`Socket authentication failed: ${String(error)}`);
      client.disconnect(true);
    }
  }

  public handleDisconnect(client: AuthenticatedSocket): void {
    const user = client.data.user;
    if (!user) return;

    this.chatRealtimeService.disconnectUser(client, user.id);
  }

  @SubscribeMessage('chat.join')
  public async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: ChatJoinLeavePayloadDto,
  ): Promise<SocketAckDto<null>> {
    return this.wrapAck(payload?.conversationId, undefined, async () => {
      const user = this.getClientUser(client);
      await this.chatService.ensureParticipantAccess(payload.conversationId, user.id);
      await this.chatRealtimeService.joinConversationRoom(
        client,
        payload.conversationId,
      );
      return null;
    });
  }

  @SubscribeMessage('chat.leave')
  public async handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: ChatJoinLeavePayloadDto,
  ): Promise<SocketAckDto<null>> {
    return this.wrapAck(payload?.conversationId, undefined, async () => {
      const user = this.getClientUser(client);
      await this.chatService.ensureParticipantAccess(payload.conversationId, user.id);
      await this.chatRealtimeService.leaveConversationRoom(
        client,
        payload.conversationId,
      );
      return null;
    });
  }

  @SubscribeMessage('chat.message.send')
  public async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: SendMessageSocketPayloadDto,
  ): Promise<SocketAckDto<MessageResponseDto>> {
    return this.wrapAck(payload?.conversationId, payload?.requestId, async () => {
      const user = this.getClientUser(client);
      const message = await this.chatService.sendMessage(user, payload, payload.requestId);
      return MessageResponseDto.fromEntity(message);
    });
  }

  @SubscribeMessage('chat.message.read')
  public async handleReadMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: MarkMessageReadSocketPayloadDto,
  ): Promise<SocketAckDto<null>> {
    return this.wrapAck(payload?.conversationId, payload?.requestId, async () => {
      const user = this.getClientUser(client);
      await this.chatService.markConversationAsReadViaSocket(
        user.id,
        payload,
        payload.requestId,
      );
      return null;
    });
  }

  private authenticateClient(client: AuthenticatedSocket): UserDecoratorDtoResponse {
    const handshakeToken = client.handshake.auth?.token;
    const headerToken = client.handshake.headers.authorization;
    const rawToken =
      typeof handshakeToken === 'string' && handshakeToken
        ? handshakeToken
        : typeof headerToken === 'string'
          ? headerToken
          : '';
    const token = rawToken.startsWith('Bearer ')
      ? rawToken.slice('Bearer '.length)
      : rawToken;

    if (!token) {
      throw new UnauthorizedException('Missing socket token');
    }

    const payload = this.jwtService.verify<JwtPayload>(token);

    return {
      id: payload.sub,
      userCode: payload.userCode,
      username: payload.username,
      email: payload.email,
      password: '',
      fullName: payload.fullName,
      dateOfBirth: payload.dateOfBirth,
      status: payload.status,
      role: payload.role,
      isEmailVerified: payload.isEmailVerified,
    };
  }

  private getClientUser(client: AuthenticatedSocket): UserDecoratorDtoResponse {
    const user = client.data.user;
    if (!user) {
      throw new UnauthorizedException('Socket user not found');
    }
    return user;
  }

  private async wrapAck<T>(
    conversationId: number | undefined,
    requestId: string | undefined,
    action: () => Promise<T>,
  ): Promise<SocketAckDto<T>> {
    try {
      const data = await action();
      return {
        success: true,
        data,
        requestId,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Socket request failed';

      return {
        success: false,
        message,
        errorCode: `CHAT_SOCKET_${conversationId ?? 'UNKNOWN'}`,
        requestId,
      };
    }
  }
}
