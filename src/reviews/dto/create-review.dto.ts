import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  patientId: string;
  @IsString()
  doctorId: string;
  @IsString()
  content: string;
  @IsNumber()
  rating: number;
}
