import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'patient'], required: true }, // دور المستخدم
  phone: { type: String },
  picture: { type: String },
  specialization: { type: String }, // خاص بالأطباء فقط
  createdAt: { type: Date, default: Date.now },
});
