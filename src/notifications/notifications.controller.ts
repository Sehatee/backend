/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/users/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/guards/Role.guard';
import { Notification } from './interfaces/notification.interface';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private notificationsServices: NotificationsService) {}
  @Get('')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async GetNotificationByDoctor(@Request() req: any): Promise<{
    total: number;
    data: Notification[];
  }> {
    return {
      total: (
        await this.notificationsServices.GetNotificationByDoctor(req.user.id)
      ).length,
      data: await this.notificationsServices.GetNotificationByDoctor(
        req.user.id,
      ),
    };
  }
  @Delete()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async DeleteAllNotifications(@Request() req: any): Promise<any> {
    const userId = req.user.id;
    return await this.notificationsServices.DeleteAllNotifications(userId);
  }
}
