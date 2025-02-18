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
}

type Location = {
  type: string;
  coordinates: number[];
  addrss: string,
};
