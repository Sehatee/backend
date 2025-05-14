/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DoctorsController],
  providers: [],
})
export class DoctorsModule {}
