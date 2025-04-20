/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MedicalRecordsService } from './medicalrecords.service';
import { MedicalRecord } from './interfaces/medicalRecord.interface';
import { CreateMedicalRecordDto } from './dto/create-medical.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/Role.guard';
import { Roles } from 'src/users/decorators/Roles.decorator';
import { UpdateMedicalRecordDto } from './dto/update-medical.dto';
import { AddDoctorIdInterceptor } from './interceptors/add-doctor-id.interceptor';

@Controller('medicalRecords')
@UseGuards(AuthGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllMedicalRecords(@Query() query: any): Promise<{
    data: MedicalRecord[];
    total: number;
    // page: number;
    // limit: number; for after time
  }> {
    return this.medicalRecordsService
      .getAllMedicalRecords(query)
      .then((data) => {
        return {
          total: data.length,
          data: data,
          // page: query.page ? parseInt(query.page) : 1,
          // limit: query.limit ? parseInt(query.limit) : 10, for after time
        };
      });
  }
  @Post()
  @UseGuards(RolesGuard)
  @Roles('doctor')
  @UseInterceptors(AddDoctorIdInterceptor)
  async createMedicalRecord(
    // @Request() req: any,
    @Body() body: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    // Extract the doctorId from the request object
    return await this.medicalRecordsService.createMedicalRecord(body);
  }
  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async getMedicalRecordsByDoctor(@Param() params: { id: string }): Promise<{
    data: MedicalRecord[];
    total: number;
    // page: number;
    // limit: number; for after time
  }> {
    return await this.medicalRecordsService
      .getMedicalRecordsByDoctor(params.id)
      .then((data) => {
        return {
          total: data.length,
          data: data,
          // page: query.page ? parseInt(query.page) : 1,
          // limit: query.limit ? parseInt(query.limit) : 10, for after time
        };
      });
  }

  @Patch('/:id')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async updateMedicalRecord(
    @Body() body: UpdateMedicalRecordDto,
    @Param()
    params: {
      id: string;
    },
    @Request() req: any,
  ): Promise<MedicalRecord> {
    const doctorId = req.user.id; // Extract the doctorId from the request object

    return await this.medicalRecordsService.updateMedicalRecord(
      body,
      params.id,
      doctorId,
    );
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async deleteMedicalRecord(
    @Param()
    params: {
      id: string;
    },
    @Request() req: any,
  ): Promise<void> {
    const doctorId = req.user.id; // Extract the doctorId from the request object
    return await this.medicalRecordsService.deleteMediclalRecord(
      params.id,
      doctorId,
    );
  }
}
