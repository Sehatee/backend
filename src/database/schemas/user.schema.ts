import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'patient'],
      required: true,
    }, // دور المستخدم
    phone: { type: String },
    picture: { type: String },
    specialization: { type: String }, // خاص بالأطباء فقط
    description: {
      type: String,
      default: '', // خاص بالأطباء فقط
    },
    appointments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    ],
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
    avgRatings: {
      type: Number,
      default: 4.5,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function () {
  this.confirmPassword = undefined;
});
// userSchema.pre(/^find/, function (this: any) {
//   this.populate([
//     {
//       path: 'appointments',
//       select: 'doctorId patientId date',
//     },
//     {
//       path: 'reviews',
//       select: 'patientId content rating',
//     },
//   ]);
// });
