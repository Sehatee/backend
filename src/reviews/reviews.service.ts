/*
https://docs.nestjs.com/providers#services
*/

import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Review } from './interfaces/review.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('REVIEWS_MODEL')
    private readonly reviewModel: Model<Review>,
    @Inject('USERS_MODEL')
    private readonly userModel: Model<User>,
  ) {}
  //finish
  async createReview(
    doctorId: string,
    reviewData: CreateReviewDto,
  ): Promise<Review> {
    const doctor = await this.userModel.findById(doctorId).populate([
      {
        path: 'reviews',
        select: 'patientId content rating',
      },
      {
        path: 'appointments',
        select: 'doctorId patientId date',
      },
    ]);
    if (!doctor) {
      throw new HttpException('Doctor not found', 404);
    }
    const isReviewed = doctor.reviews.some((review) => {
      return review.patientId._id.toString() === reviewData.patientId;
    });

    if (isReviewed) {
      throw new HttpException('user has already reviewed this doctor', 403);
    }
    const review = await this.reviewModel.create(reviewData);
    doctor.reviews.push(review.id);
    await doctor.save({
      validateBeforeSave: false,
    });
    return review;
  }
  //finish
  async getAllReviews(): Promise<Review[]> {
    return await this.reviewModel.find();
  }
  //finish
  async getReviewById(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }
  //finish
  async updateReview(
    userId: string,
    reviewId: string,
    reviewData: Partial<Review>,
  ): Promise<Review> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isExist = user.reviews.find(
      (review) => review._id.toString() === reviewId,
    );
    if (!isExist) {
      throw new HttpException(
        ' user does not have permission to update this review',
        403,
      );
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      reviewData,
      { new: true },
    );

    if (!updatedReview) {
      throw new NotFoundException('Review not found');
    }
    user.reviews = user.reviews.filter((review) => {
      return review._id.toString() !== reviewId;
    });
    await user.save();
    return updatedReview;
  }

  async deleteReview(userId: string, reviewId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isExist = user.reviews.find(
      (review) => review._id.toString() === reviewId,
    );
    if (!isExist) {
      throw new HttpException(
        ' user does not have permission to update this review',
        403,
      );
    }
    const result = await this.reviewModel.findByIdAndDelete(reviewId).exec();
    if (!result) {
      throw new NotFoundException('Review not found');
    }
    user.reviews = user.reviews.filter((review) => {
      return review._id.toString() !== reviewId;
    });
    await user.save();
    return;
  }

  async getReviewsByDoctor(doctorId: string): Promise<Review[]> {
    return await this.reviewModel.find({ doctorId });
  }

  async getReviewsByPatient(patientId: string): Promise<Review[]> {
    return await this.reviewModel.find({ patientId }).exec();
  }
}
