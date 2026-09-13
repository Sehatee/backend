// chat.controller.ts

import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // استورد الـ Guard الخاص بك

@Controller('chats')
// @UseGuards(JwtAuthGuard) // تفعيل الحماية لجلب ID المستخدم بأمان
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // for current Auth users
  // if the logged in is Patient user
  // extract the role via req.user.role
  @Get('conversations')
  @UseGuards(AuthGuard)
  async getConversations(@Req() req: any) {
    const patientId = req.user.id;
    return this.chatService.getAllConversations(patientId);
  }

  @Post('conversations/:doctorId')
  @UseGuards(AuthGuard)
  async createConversation(
    @Req() req: any,
    @Param('doctorId') doctorId: string,
  ) {
    const patientId = req.user.id;
    return this.chatService.createConversation(doctorId, patientId);
  }

  // End Point: GET /chats/conversation/:doctorId
  @Get('conversation/:doctorId')
  @UseGuards(AuthGuard)
  async getConversation(
    @Param('doctorId') doctorId: string,
    @Req() req: any, // أو استخراج @GetUser() id
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const patientId = req.user.id;
    return this.chatService.getConversationWithMessages(
      doctorId,
      patientId,
      limit,
      page,
    );
  }

  // End Point: GET /chats/:conversationId/messages
  @Get(':conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.chatService.getMessages(conversationId, limit, page);
  }
}
