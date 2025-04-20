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
    // finish
    AppointmentsModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    // finish
    AuthModule,
    // finish
    UsersModule,
    //finish
    AppointmentsModule,
    MedicalRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
