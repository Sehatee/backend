import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateMedicalRecordDto {
  @IsMongoId()
  @IsNotEmpty()
  patientId: string;

  @IsMongoId()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  attachments?: string[];
}
