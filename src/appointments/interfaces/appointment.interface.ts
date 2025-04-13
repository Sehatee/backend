import { User } from 'src/users/interfaces/user.interface';

export interface Appointment {
  patient: User;
  doctorId: string;
  date: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
