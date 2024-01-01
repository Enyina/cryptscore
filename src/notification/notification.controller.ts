import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('user/:userId')
  getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':notificationId/mark-as-read')
  markNotificationAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
