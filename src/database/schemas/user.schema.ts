import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'patient'], required: true }, // دور المستخدم
  phone: { type: String },
  picture: { type: String },
  specialization: { type: String }, // خاص بالأطباء فقط
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  // ✅ إضافة جدول المواعيد المتاحة للأطباء
  availableHours: {
    type: [
      {
        day: {
          type: String,
          enum: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
        },
      },
    ],
    default: [],
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    addrss: String,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function () {
  this.confirmPassword = undefined;
});
