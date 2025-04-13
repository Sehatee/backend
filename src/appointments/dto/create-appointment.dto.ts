import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/interfaces/user.interface';

export class CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  @IsString()
  @IsNotEmpty()
  date: string;
  @IsString()
  @IsNotEmpty()
  notes: string;
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
