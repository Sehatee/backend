import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UploadFilesModule } from 'src/upload-files/upload-files.module';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
  imports: [
    UsersModule,
    UploadFilesModule,
    EmailsModule,
    JwtModule.register({
      global: true,
      secret: 'EO0Z3ZVpfsBcafBRTF1YnLeuacQxTcKb',
      signOptions: { expiresIn: '5h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
