/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { MedicalRecord } from './interfaces/medicalRecord.interface';
import { Model } from 'mongoose';
import { CreateMedicalRecordDto } from './dto/create-medical.dto';
import APIFeatures from 'src/utils/apiFeaturs';
import { UpdateMedicalRecordDto } from './dto/update-medical.dto';
import { create } from 'domain';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @Inject('MEDICAL_RECORDS_MODEL')
    private readonly medicalRecordModel: Model<MedicalRecord>,
  ) {}
  //this action only for admin
  async getAllMedicalRecords(query: any): Promise<MedicalRecord[]> {
    const features = new APIFeatures(this.medicalRecordModel.find(), query);
    const medicalRecords = await features
      .filter()
      .sort()
      .limitFields()
      .paginate().query;
    return medicalRecords;
  }
  async createMedicalRecord(
    medicalRecord: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const newMedicalRecord = this.medicalRecordModel.create(medicalRecord);
    return newMedicalRecord;
  }
  async getMedicalRecordsByDoctor(id: string): Promise<MedicalRecord[]> {
    const doctorMedicalRecords = await this.medicalRecordModel
      .find({
        doctorId: id,
      })
      .populate([
        {
          path: 'patientId',
          select: 'username email phone picture',
        },
      ])
      .sort({
        createdAt: -1, // -1 for newest first
      });

    return doctorMedicalRecords;
  }
  async getMedicalRecordsByPatient(id: string): Promise<MedicalRecord[]> {
    const patientMedicalRecords = await this.medicalRecordModel
      .find({
        patientId: id,
      })
      .populate([
        {
          path: 'doctorId',
          select: 'username email specialization ,picture',
        },
      ])
      .sort({
        createdAt: -1, // -1 for newest first
      });
    return patientMedicalRecords;
  }
  async getMedicalOneRecordsByDoctor(id: string): Promise<MedicalRecord> {
    const doctorMedicalRecords = await this.medicalRecordModel
      .findById(id)
      .populate([
        {
          path: 'patientId',
          select: 'username email specialization picture',
        },
      ]);

    if (!doctorMedicalRecords) {
      throw new HttpException('not found this medical Record', 404);
    }

    return doctorMedicalRecords;
  }
  async getMedicalOneRecordsByPatient(id: string): Promise<MedicalRecord> {
    const patientMedicalRecords = await this.medicalRecordModel
      .findById(id)
      .populate([
        {
          path: 'doctorId',
          select: 'username email specialization picture',
        },
      ]);

    if (!patientMedicalRecords) {
      throw new HttpException('not found this medical Record', 404);
    }

    return patientMedicalRecords;
  }
  async updateMedicalRecord(
    body: UpdateMedicalRecordDto,
    medicalRecordId: string,
    doctorId: string,
  ): Promise<MedicalRecord> {
    const medicalRecord =
      await this.medicalRecordModel.findById(medicalRecordId);
    if (!medicalRecord) {
      throw new HttpException('not found this medical Record', 404);
    }
    if (!(medicalRecord.doctorId.toString() === doctorId)) {
      throw new HttpException('this medical Record not for you', 401);
    }
    const updatedMdicalRecord = await this.medicalRecordModel.findByIdAndUpdate(
      medicalRecordId,
      body,
      { new: true },
    );

    return updatedMdicalRecord;
  }
  async deleteMediclalRecord(
    medicalRecordId: string,
    doctorId: string,
  ): Promise<void> {
    const medicalRecord =
      await this.medicalRecordModel.findById(medicalRecordId);
    if (!medicalRecord) {
      throw new HttpException('not found this medical Record', 404);
    }
    if (!(medicalRecord.doctorId.toString() === doctorId)) {
      throw new HttpException('this medical Record not for you', 401);
    }
    await this.medicalRecordModel.findByIdAndDelete(medicalRecordId);
    return;
  }
}
