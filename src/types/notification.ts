// types/notification.ts
export enum NotificationType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PUSH = 'PUSH'
  }
  
  export enum NotificationStatus {
    UNREAD = 'UNREAD',
    READ = 'READ'
  }
  
  export interface ApiNotificationResponse {
    id: string;
    userId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type?: NotificationType;
    contactInfo?: string;
  }
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    code: number;
    data: PageResponse<T>;
  }
  export type AppNotification = {
    id: string;
    userId: string;
    message: string;
    type: NotificationType;
    contactInfo: string;
    status: NotificationStatus;
    createdAt: string | Date;
  };
  // Sayfalı veri yapısı
  export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    last: boolean;
    first: boolean;
    empty: boolean;
  }
  
  export const mapApiNotification = (
    apiData: ApiNotificationResponse
  ): AppNotification => ({
    id: String(apiData.id), 
    userId: apiData.userId,
    message: apiData.message,
    type: apiData.type || NotificationType.PUSH,
    contactInfo: apiData.contactInfo || '',
    status: apiData.isRead ? NotificationStatus.READ : NotificationStatus.UNREAD,
    createdAt: apiData.createdAt
  });