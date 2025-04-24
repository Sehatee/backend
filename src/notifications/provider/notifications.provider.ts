import { Connection } from 'mongoose';
import { notificationSchema } from 'src/database/schemas/notification.schema';

export const notificationsProviders = [
  {
    provide: 'NOTIFICATIONS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Notification', notificationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
