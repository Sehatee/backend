import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { messageProviders } from './providers/message.provider';
import { conversationProviders } from './providers/conversation.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, UsersModule],
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
