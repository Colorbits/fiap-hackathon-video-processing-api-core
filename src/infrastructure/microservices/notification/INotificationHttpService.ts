export interface NotificationDto {
  id?: string;
  videoUuid: string;
  videoName: string;
  userId: string;
  userName: string;
  email: string;
  error: string;
  status?: 'PENDING' | 'SENT' | 'FAILED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationHttpService {
  createNotification(
    notificationDto: NotificationDto,
  ): Promise<NotificationDto>;
  getAllNotifications(): Promise<NotificationDto[]>;
  getNotificationsByUserId(userId: string): Promise<NotificationDto[]>;
  getNotificationsByVideoUuid(videoUuid: string): Promise<NotificationDto[]>;
  updateNotificationStatus(
    id: string,
    status: 'PENDING' | 'SENT' | 'FAILED',
  ): Promise<NotificationDto>;
}
