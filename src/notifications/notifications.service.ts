/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Notification } from './interfaces/notification.interface';
import { CreateNotificationDto } from './dto/create-notificaion.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('NOTIFICATIONS_MODEL')
    private notificationModel: Model<Notification>,
  ) {}
  async GetNotificationByDoctor(doctorId: string): Promise<Notification[]> {
    const notifications = await this.notificationModel.find({
      userId: doctorId,
    });
    return notifications;
  }
  async CreateNotification(data: CreateNotificationDto): Promise<Notification> {
    const notification = await this.notificationModel.create(data);
    return notification;
  }
  async GetNotifications(userId: string): Promise<Notification[]> {
    const notifications = await this.notificationModel.find({ userId });
    return notifications;
  }
  async DeleteAllNotifications(userId: string): Promise<any> {
    await this.notificationModel.deleteMany({ userId });
  }
}
