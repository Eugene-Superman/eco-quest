export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface CreateNotification {
  type: NotificationType;
  text: string;
}

export interface NotificationEntity extends CreateNotification {
  id: string;
}

export interface NotificationsState {
  notificationList: NotificationEntity[];
}
