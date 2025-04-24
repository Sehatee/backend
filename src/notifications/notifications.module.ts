import { NotificationsController } from './notifications.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { DatabaseModule } from 'src/database/database.module';
import { notificationsProviders } from './provider/notifications.provider';
import { NotificationGateway } from './gateway/notification.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [
    ...notificationsProviders,
    NotificationsService,
    NotificationGateway,
  ],
  exports: [NotificationsService, NotificationGateway],
})
export class NotificationsModule {}
