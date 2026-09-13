import { Connection } from 'mongoose';
import { conversationSchema } from 'src/database/schemas/conversation.schema';

export const conversationProviders = [
  {
    provide: 'CONVERSATION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Conversation', conversationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
