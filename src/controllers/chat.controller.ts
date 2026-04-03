import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'Tạo hoặc lấy cuộc trò chuyện với người dùng khác' })
  @Post('contact')
  public async contactToUser(
    @Body() body: ContactToUserPayloadDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.contactToUser(user, body);
  }

  @ApiOperation({ summary: 'Lấy danh sách cuộc trò chuyện của user' })
  @Get('conversations')
  public async getConversations(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.getConversations(user.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách tin nhắn trong cuộc trò chuyện' })
  @Get('messages')
  public async getMessages(
    @Query('conversationId', ParseIntPipe) conversationId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.getMessages(conversationId, user.id, +page, +limit);
  }

  @ApiOperation({ summary: 'Gửi tin nhắn' })
  @Post('send')
  public async sendMessage(
    @Body() body: SendMessageDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.sendMessage(user, body);
  }

  @ApiOperation({ summary: 'Đánh dấu cuộc trò chuyện đã đọc' })
  @Post('read')
  public async markConversationAsRead(
    @Body() body: MarkConversationReadDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.markConversationAsRead(user.id, body);
  }

  @ApiOperation({ summary: 'Cập nhật biệt danh cuộc trò chuyện' })
  @Post('nickname')
  public async setConversationNickname(
    @Body() body: SetConversationNicknameDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.setConversationNickname(user.id, body);
  }

  @ApiOperation({ summary: 'Ghim hoặc bỏ ghim cuộc trò chuyện' })
  @Post('pin')
  public async pinConversation(
    @Body() body: PinConversationDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.pinConversation(user.id, body);
  }

  @ApiOperation({ summary: 'Cập nhật tắt thông báo cuộc trò chuyện' })
  @Post('mute')
  public async muteConversation(
    @Body() body: MuteConversationDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.muteConversation(user.id, body);
  }
}
