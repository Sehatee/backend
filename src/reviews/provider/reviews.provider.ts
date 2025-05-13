import { Connection } from 'mongoose';
import { reviewsSchema } from 'src/database/schemas/review.schema';

export const reviewsProviders = [
  {
    provide: 'REVIEWS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Review', reviewsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
