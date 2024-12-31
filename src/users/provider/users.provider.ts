import { Connection } from 'mongoose';
import { userSchema } from 'src/database/schemas/user.schema';

export const usersProviders = [
  {
    provide: 'USERS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', userSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
