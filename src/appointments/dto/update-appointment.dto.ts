import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  date: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes: string;
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
