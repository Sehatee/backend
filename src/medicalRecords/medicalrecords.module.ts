/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MedicalRecordsController } from './medicalrecords.controller';
import { medicalProviders } from './provider/medicalRecord.provider';
import { MedicalRecordsService } from './medicalrecords.service';
import { UploadFilesModule } from 'src/upload-files/upload-files.module';
import { UploadFilesService } from 'src/upload-files/upload-files.service';

@Module({
  imports: [DatabaseModule, UploadFilesModule],
  controllers: [MedicalRecordsController],
  providers: [...medicalProviders, MedicalRecordsService, UploadFilesService],
})
export class MedicalRecordsModule {}
