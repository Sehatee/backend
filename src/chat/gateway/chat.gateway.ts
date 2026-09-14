import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat.service';
import { UploadFilesService } from 'src/upload-files/upload-files.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly uploadFilesService: UploadFilesService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
  }

  // انضمام المستخدم لغرفة المحادثة الخاصة بالـ Conversation
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(data.conversationId);
    return { event: 'joinedRoom', conversationId: data.conversationId };
  }

  // حدث إرسال الرسالة من المريض إلى الطبيب (أو العكس)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    payload: {
      senderId: string;
      receiverId: string;
      doctorId: string;
      patientId: string;
      content: string;
      attachments?: { type: 'image' | 'document' | 'audio'; url: string }[];
    },
  ) {
    // upload files if exist
    let attachmentsUrls = [];
    // upload the files when is exist
    if (payload.attachments) {
      attachmentsUrls = await this.uploadFilesService.uploadMessageFiles(
        payload.attachments,
      );
    }
    payload.attachments = attachmentsUrls;

    // 1. حفظ الرسالة في قاعدة البيانات
    const savedMessage = await this.chatService.saveMessage(payload);

    const roomName = savedMessage.conversationId.toString();

    this.server.to(roomName).emit('newMessage', savedMessage);

    return {
      status: 'success',
      data: savedMessage,
    };
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody()
    data: {
      conversationId: string;
      userId: string;
      role: 'doctor' | 'patient';
    },
  ) {
    await this.chatService.markAsRead(
      data.conversationId,
      data.userId,
      data.role,
    );
    this.server
      .to(data.conversationId)
      .emit('messagesRead', { conversationId: data.conversationId });
    return { status: 'success' };
  }
}
