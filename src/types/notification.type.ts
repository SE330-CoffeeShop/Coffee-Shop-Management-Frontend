export interface NotificationDto {
  id: string;
  notificationType: string;
  notificationContent: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  senderId?: string;
}