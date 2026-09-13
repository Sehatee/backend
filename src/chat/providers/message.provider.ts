import { Connection } from 'mongoose';
import { messageSchema } from 'src/database/schemas/message.schema';

export const messageProviders = [
  {
    provide: 'MESSAGE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Message', messageSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
