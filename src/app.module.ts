import { DoctorsModule } from './doctors/doctors.module';
import { DoctorsController } from './doctors/doctors.controller';
import { ReviewsModule } from './reviews/reviews.module';
import { ReviewsController } from './reviews/reviews.controller';
import { EmailsModule } from './emails/emails.module';
import { UploadFilesModule } from './upload-files/upload-files.module';
import { UploadFilesService } from './upload-files/upload-files.service';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsService } from './notifications/notifications.service';
import { MedicalRecordsModule } from './medicalRecords/medicalrecords.module';
import { MedicalRecordsService } from './medicalRecords/medicalrecords.service';
import { MedicalRecordsController } from './medicalRecords/medicalrecords.controller';
import { AppointmentsModule } from './appointments/appointments.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UploadFilesModule,
    EmailsModule,
    // finish
    DoctorsModule,
    // finish
    ReviewsModule,
    // finish
    AuthModule,
    // finish
    UsersModule,
    //finish
    AppointmentsModule,
    // finish
    MedicalRecordsModule,
    // finish
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
