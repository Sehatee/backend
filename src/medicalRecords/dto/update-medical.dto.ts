import { IsString, IsOptional,  IsNotEmpty } from 'class-validator';

export class UpdateMedicalRecordDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  treatment?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;
}
