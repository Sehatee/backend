import * as mongoose from 'mongoose';

export const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: function () {
        // تكون المطلوبة فقط إذا لم تكن هناك أي مرفقات
        return !this.attachments || this.attachments.length === 0;
      },
      trim: true,
      default: '',
    },
    attachments: [
      {
        type: { type: String, enum: ['image', 'document', 'audio'] },
        url: { type: String },
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
