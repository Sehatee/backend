import * as mongoose from 'mongoose';


export const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    unreadCount: {
      doctor: { type: Number, default: 0 },
      patient: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

conversationSchema.index({ doctor: 1, patient: 1 }, { unique: true });

