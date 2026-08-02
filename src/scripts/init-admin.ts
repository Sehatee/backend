// src/scripts/seed-database.ts
import { NestFactory } from '@nestjs/core';

import { Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AppModule } from '../app.module';

async function bootstrap() {
  const logger = new Logger('SeedDatabaseScript');
  try {
    // Create a standalone NestJS application context
    const appContext = await NestFactory.createApplicationContext(AppModule);

    //script to initialize admin user
    const userService = appContext.get(UsersService);
    await userService.createAdminUser({
      username: 'admin',
      email: 'admin@gm.com',
      password: '123456',
      role: 'admin',
    });
    logger.log('Database seeding complete.');

    // Close the application context when done
    await appContext.close();
  } catch (error) {
    logger.error('Database seeding failed', error.stack);
    process.exit(1);
  }
}

bootstrap();
