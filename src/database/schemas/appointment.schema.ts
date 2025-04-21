import * as mongoose from 'mongoose';
import path from 'path';

export const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: { type: Date, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

appointmentSchema.pre(/^find/, function (this: any) {
  this.populate([
    {
      path: 'patientId',
      select: 'username email -appointments',
    },
  ]);
});
