import { User } from 'src/users/interfaces/user.interface';

export interface Review {
  _id: string;
  content: string;
  patientId: User;
  doctorId: string;
  rating: number | 1 | 2 | 3 | 4 | 5;
}
