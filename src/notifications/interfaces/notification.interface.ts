export interface Notification {
  _id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
