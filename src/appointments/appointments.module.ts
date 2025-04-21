import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { appointmentsProviders } from './provider/appointments.provider';
import { UsersModule } from 'src/users/users.module';
import { usersProviders } from 'src/users/provider/users.provider';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AppointmentsController],

  providers: [...appointmentsProviders, AppointmentsService],
})
export class AppointmentsModule {}
