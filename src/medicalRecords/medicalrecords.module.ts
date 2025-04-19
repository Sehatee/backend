/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MedicalRecordsController } from './medicalrecords.controller';
import { medicalProviders } from './provider/medicalRecord.provider';
import { MedicalRecordsService } from './medicalrecords.service';

@Module({
    imports: [DatabaseModule],
    controllers: [MedicalRecordsController],
    providers: [...medicalProviders , MedicalRecordsService],
})
export class MedicalRecordsModule {}
