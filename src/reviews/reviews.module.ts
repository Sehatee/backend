import { DatabaseModule } from 'src/database/database.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { reviewsProviders } from './provider/reviews.provider';
import { usersProviders } from 'src/users/provider/users.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ReviewsController],
  providers: [...reviewsProviders, ...usersProviders, ReviewsService],
})
export class ReviewsModule {}
