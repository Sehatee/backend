import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { messageProviders } from './providers/message.provider';
import { conversationProviders } from './providers/conversation.provider';
import { DatabaseModule } from 'src/database/database.module';
import { UploadFilesModule } from 'src/upload-files/upload-files.module';

@Module({
  imports: [DatabaseModule, UsersModule, UploadFilesModule],
  controllers: [ChatController],
  providers: [
    ...conversationProviders,
    ...messageProviders,
    ChatService,
    ChatGateway,
  ],
  exports: [],
})
export class ChatModule {}
