import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  patientId: string;
  @IsString()
  doctorId: string;
  @IsString()
  content: string;
  @IsNumber()
  @Min(1, {
    message: 'Rating must be at greate 1',
  })
  @Max(5, {
    message: 'Rating must be at least 5',
  })
  rating: number;
}
