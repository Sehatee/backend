import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } }) // Explicitly define CORS origin for better security
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  private userSocketMap = new Map<string, string>(); // mongoDbId -> socket.id

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const mongoDbId = socket.handshake.query.mongoDbId as string;

      if (mongoDbId) {
        socket.join(mongoDbId); // Join room with MongoDB ID
        this.userSocketMap.set(mongoDbId, socket.id); // Optional
        console.log(`✅ Client connected with MongoDB ID: ${mongoDbId}`);
      } else {
        console.log(`⚠️ Client connected without MongoDB ID: ${socket.id}`);
      }

      socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        // Optionally remove from map
        for (const [key, value] of this.userSocketMap.entries()) {
          if (value === socket.id) {
            this.userSocketMap.delete(key);
            break;
          }
        }
      });
    });
  }

  @SubscribeMessage('notification')
  handleNotification(@MessageBody() data: any): void {
    console.log('Notification received:', data);
    this.server.emit('notification', data); // Broadcast the notification to all connected clients
  }

  @SubscribeMessage('sendNotificationToDoctor')
  handleSendNotificationToDoctor(
    @MessageBody() data: { doctorId: string; message: string },
  ): void {
    console.log('Send notification to doctor:', data);
    this.server.to(data.doctorId.toString()).emit('notification', data.message); // Send notification to specific doctor
  }

  @SubscribeMessage('GetNotificationByDoctor')
  handleGetNotificationByDoctor(
    @MessageBody() data: { doctorId: string; message: string },
  ): void {
    console.log('Get notification by doctor:', data);
    this.server.to(data.doctorId).emit('notification', data.message); // Send notification to specific doctor
  }
}
