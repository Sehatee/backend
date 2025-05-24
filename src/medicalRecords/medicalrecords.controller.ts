/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
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
import { UploadFilesService } from 'src/upload-files/upload-files.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('medicalRecords')
@UseGuards(AuthGuard)
export class MedicalRecordsController {
  constructor(
    private readonly medicalRecordsService: MedicalRecordsService,
    private readonly uploadFilesService: UploadFilesService,
  ) {}

  // only for patient
  @Get('/patient/:id')
  @UseGuards(RolesGuard)
  @Roles('patient')
  async getOneMedicalRecordByPatient(
    @Param()
    params: {
      id: string;
    },
  ): Promise<MedicalRecord> {
    return await this.medicalRecordsService.getMedicalOneRecordsByPatient(
      params.id,
    );
  }
  @Get('/patient')
  @UseGuards(RolesGuard)
  @Roles('patient')
  async getMedicalRecordsByPatient(@Request() req: any): Promise<{
    data: MedicalRecord[];
    total: number;
    // page: number;
    // limit: number; for after time
  }> {
    const patientId = req.user.id;

    return await this.medicalRecordsService
      .getMedicalRecordsByPatient(patientId)
      .then((data) => {
        return {
          total: data.length,
          data: data,
          // page: query.page ? parseInt(query.page) : 1,
          // limit: query.limit ? parseInt(query.limit) : 10, for after time
        };
      });
  }

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
  @UseInterceptors(FilesInterceptor('files'))
  async createMedicalRecord(
    // @Request() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000,
            message: 'File is too large must be less than 1MB',
          }), // 5MB
          new FileTypeValidator({
            fileType:
              /^image\/(jpeg|png|jpg|gif)$|^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/, //accepte only images and pdf/word files
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body()
    body: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    // Extract the doctorId from the request object

    body.attachments = await this.uploadFilesService.uploadFiles(files);
    return await this.medicalRecordsService.createMedicalRecord(body);
  }
  @Get('/doctor')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async getMedicalRecordsByDoctor(@Request() req: any): Promise<{
    data: MedicalRecord[];
    total: number;
    // page: number;
    // limit: number; for after time
  }> {
    const doctorId = req.user.id;
    return await this.medicalRecordsService
      .getMedicalRecordsByDoctor(doctorId)
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
  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async getOneMedicalRecordByDoctor(
    @Param()
    params: {
      id: string;
    },
  ): Promise<MedicalRecord> {
    return await this.medicalRecordsService.getMedicalOneRecordsByDoctor(
      params.id,
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
