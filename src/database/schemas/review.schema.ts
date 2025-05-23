import { min } from 'class-validator';
import * as mongoose from 'mongoose';

export const reviewsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewsSchema.pre(/^find/, function (this: any) {
  this.populate([
    {
      path: 'patientId',
      select: 'username picture ',
    },
  ]);
});
