import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  ContactToUserPayloadDto,
  MarkConversationReadDto,
  MuteConversationDto,
  PinConversationDto,
  SendMessageDto,
  SetConversationNicknameDto,
} from '../dtos/chat/chat.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import { ChatService } from '../services/chat.service';
import { User } from '../user.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  private buildContentDisposition(
    mode: 'inline' | 'attachment',
    fileName?: string,
  ): string {
    const originalName = fileName || 'attachment';
    const fallbackName = originalName
      .replace(/[^\x20-\x7E]+/g, '_')
      .replace(/["\\]/g, '_');
    const encodedName = encodeURIComponent(originalName);

    return `${mode}; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`;
  }

  @ApiOperation({ summary: 'Tao hoac lay cuoc tro chuyen voi nguoi dung khac' })
  @Post('contact')
  public async contactToUser(
    @Body() body: ContactToUserPayloadDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.contactToUser(user, body);
  }

  @ApiOperation({ summary: 'Lay danh sach cuoc tro chuyen cua user' })
  @Get('conversations')
  public async getConversations(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.getConversations(user.id);
  }

  @ApiOperation({ summary: 'Lay danh sach tin nhan trong cuoc tro chuyen' })
  @Get('messages')
  public async getMessages(
    @Query('conversationId', ParseIntPipe) conversationId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.getMessages(conversationId, user.id, +page, +limit);
  }

  @ApiOperation({ summary: 'Xem file dinh kem trong chat' })
  @Get('attachments/:id/view')
  public async viewAttachment(
    @Param('id', ParseIntPipe) attachmentId: number,
    @User() user: UserDecoratorDtoResponse,
    @Res() response: Response,
  ): Promise<void> {
    const attachment = await this.chatService.getAttachmentForUser(
      attachmentId,
      user.id,
    );
    // Redirect to the file URL directly instead of proxying through server
    response.redirect(attachment.url);
  }

  @ApiOperation({ summary: 'Tai file dinh kem trong chat' })
  @Get('attachments/:id/download')
  public async downloadAttachment(
    @Param('id', ParseIntPipe) attachmentId: number,
    @User() user: UserDecoratorDtoResponse,
    @Res() response: Response,
  ): Promise<void> {
    const attachment = await this.chatService.getAttachmentForUser(
      attachmentId,
      user.id,
    );
    // Redirect to the file URL directly instead of proxying through server
    response.redirect(attachment.url);
  }

  @ApiOperation({ summary: 'Gui tin nhan' })
  @Post('send')
  public async sendMessage(
    @Body() body: SendMessageDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.sendMessage(user, body);
  }

  @ApiOperation({ summary: 'Danh dau cuoc tro chuyen da doc' })
  @Post('read')
  public async markConversationAsRead(
    @Body() body: MarkConversationReadDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.markConversationAsRead(user.id, body);
  }

  @ApiOperation({ summary: 'Cap nhat biet danh cuoc tro chuyen' })
  @Post('nickname')
  public async setConversationNickname(
    @Body() body: SetConversationNicknameDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.setConversationNickname(user.id, body);
  }

  @ApiOperation({ summary: 'Ghim hoac bo ghim cuoc tro chuyen' })
  @Post('pin')
  public async pinConversation(
    @Body() body: PinConversationDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.pinConversation(user.id, body);
  }

  @ApiOperation({ summary: 'Cap nhat tat thong bao cuoc tro chuyen' })
  @Post('mute')
  public async muteConversation(
    @Body() body: MuteConversationDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.muteConversation(user.id, body);
  }
}
