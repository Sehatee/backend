import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { usersProviders } from './provider/users.provider';
import { UploadFilesModule } from 'src/upload-files/upload-files.module';

@Module({
  imports: [DatabaseModule, UploadFilesModule],
  controllers: [UsersController],
  providers: [...usersProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
