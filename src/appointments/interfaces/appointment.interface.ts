import { User } from 'src/users/interfaces/user.interface';

export  interface Appointment {
  patient: User;
  doctor: User;
  date: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
