import { Review } from 'src/reviews/interfaces/review.interface';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'patient'; // دور المستخدم
  phone: string;
  picture: string;
  specialization: string; // خاص بالأطباء فقط
  createdAt: Date;
  location: Location;
  active: boolean;
  appointments: any[];
  availableHours: availableHours[];
  reviews: Review[];
}

type Location = {
  type: string;
  coordinates: number[];
  addrss: string;
};
type availableHours = {
  day: string;
};
