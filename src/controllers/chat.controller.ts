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
import { ContactToUserDto } from '../dtos/chat/chat.dto';
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
    @Body() body: ContactToUserDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.contactToUser({
      fromUserId: user.id,
      toUserId: body.toUserId,
    });
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
  ): Promise<any> {
    return this.chatService.getMessages(conversationId, +page, +limit);
  }

  @ApiOperation({ summary: 'Gửi tin nhắn' })
  @Post('send')
  public async sendMessage(
    @Body('conversationId', ParseIntPipe) conversationId: number,
    @Body('content') content: string,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<any> {
    return this.chatService.sendMessage(conversationId, user.id, content);
  }
}
