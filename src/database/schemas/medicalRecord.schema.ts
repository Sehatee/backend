import * as mongoose from 'mongoose';

export const medicalRecordSchema = new mongoose.Schema({
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
  diagnosis: { type: String, required: true }, // التشخيص
  treatment: { type: String }, // العلاج
  attachments: [{ type: String }], // روابط الملفات المرفوعة
  createdAt: { type: Date, default: Date.now },
});
