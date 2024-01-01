import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ user: userId });
  }

  async markNotificationAsRead(notificationId: string) {
    const notification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}
