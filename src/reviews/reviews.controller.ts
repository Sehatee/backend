import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './interfaces/review.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/Role.guard';
import { Roles } from 'src/users/decorators/Roles.decorator';
import { AddPatientIdAndDoctorIdInterceptor } from './interceptors/add-patientId.interceptor';

@UseGuards(AuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewServices: ReviewsService) {}

  @UseGuards(RolesGuard)
  @UseInterceptors(AddPatientIdAndDoctorIdInterceptor)
  @Roles('patient')
  @Post('/doctor/reviews/:doctorId')
  async createReview(
    @Body() reviewData: CreateReviewDto,
    @Param('doctorId') doctorId: string,
  ): Promise<Review> {
    return await this.reviewServices.createReview(doctorId, reviewData);
  }
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  async getAllReviews(): Promise<Review[]> {
    return await this.reviewServices.getAllReviews();
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string): Promise<Review> {
    return await this.reviewServices.getReviewById(id);
  }
  @UseGuards(RolesGuard)
  @Roles('patient')
  @Patch(':id')
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Body() reviewData: Partial<Review>,
    @Request() req: any,
  ): Promise<Review> {
    const userId = req.user.id;
    return await this.reviewServices.updateReview(userId, reviewId, reviewData);
  }
  @UseGuards(RolesGuard)
  @Roles('patient')
  @Delete(':id')
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user.id;
    return await this.reviewServices.deleteReview(userId, reviewId);
  }
  @UseGuards(RolesGuard)
  @Roles('doctor')
  @Get('doctor/:doctorId')
  async getReviewsByDoctor(
    @Param('doctorId') doctorId: string,
  ): Promise<Review[]> {
    return await this.reviewServices.getReviewsByDoctor(doctorId);
  }
  @UseGuards(RolesGuard)
  @Roles('patient')
  @Get('patient/:patientId')
  async getReviewsByPatient(
    @Param('patientId') patientId: string,
  ): Promise<Review[]> {
    return await this.reviewServices.getReviewsByPatient(patientId);
  }
}
