import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { appointmentsProviders } from './provider/appointments.provider';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationGateway } from 'src/notifications/gateway/notification.gateway';

@Module({
  imports: [DatabaseModule, UsersModule, NotificationsModule],
  controllers: [AppointmentsController],

  providers: [...appointmentsProviders, AppointmentsService],
})
export class AppointmentsModule {}
