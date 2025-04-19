/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { MedicalRecord } from './interfaces/medicalRecord.interface';
import { Model } from 'mongoose';
import { CreateMedicalRecordDto } from './dto/create-medical.dto';
import APIFeatures from 'src/utils/apiFeaturs';
import { medicalProviders } from './provider/medicalRecord.provider';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @Inject('MEDICAL_RECORDS_MODEL')
    private readonly medicalRecordModel: Model<MedicalRecord>,
  ) {}
  //this action only for admin
  async createMedicalRecord(
    medicalRecord: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const newMedicalRecord = this.medicalRecordModel.create(medicalRecord);
    return newMedicalRecord;
  }
  async getAllMedicalRecords(query: any): Promise<MedicalRecord[]> {
    const features = new APIFeatures(this.medicalRecordModel.find(), query);
    const medicalRecords = await features
      .filter()
      .sort()
      .limitFields()
      .paginate().query;
    return medicalRecords;
  }
}
