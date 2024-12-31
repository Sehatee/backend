export interface User {
  _id: number;
  username: string;
  email: string;
  password: string;
  role: ['admin', 'doctor', 'patient']; // دور المستخدم
  phone: string;
  picture: string;
  specialization: string; // خاص بالأطباء فقط
  createdAt: Date;
}
