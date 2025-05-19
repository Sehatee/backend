import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
export class CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  @IsString()
  @IsNotEmpty()
  date: string;
  @IsString()
  @IsNotEmpty()
  notes: string;
  status: AppointmentStatus;
}
