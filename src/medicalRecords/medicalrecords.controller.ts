/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medicalrecords.service';
import { MedicalRecord } from './interfaces/medicalRecord.interface';
import { CreateMedicalRecordDto } from './dto/create-medical.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/Role.guard';
import { Roles } from 'src/users/decorators/Roles.decorator';

@Controller('medicalRecords')
@UseGuards(AuthGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAllMedicalRecords(@Query() query: any): Promise<MedicalRecord[]> {
    return this.medicalRecordsService.getAllMedicalRecords(query);
  }
  @Post()
  @UseGuards(RolesGuard)
  @Roles('doctor')
  createMedicalRecord(
    @Body() body: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    return this.medicalRecordsService.createMedicalRecord(body);
  }
}
