import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { throttle } from 'lodash';

import {
  ApiNotificationResponse,
  mapApiNotification,
  AppNotification,
  PageResponse,
  ApiResponse,
} from '../types/notification';
import { AppStore } from '../types/store';


const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:9090/ws/notifications';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/v1/api';

class NotificationService {
  private client: Client | null = null;
  private subscriptions: StompSubscription[] = [];
  private notificationHandlers: ((notification: AppNotification) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initializeWebSocket();
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getAuthHeader() {
    const token = this.getToken();
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    };
  }

  public initializeWebSocket() {
    const token = this.getToken();

    if (!token || token.split('.').length !== 3) {
      console.error('WebSocket bağlantısı için geçerli bir token bulunamadı:', token);
      return;
    }

    const socket = new SockJS(`${API_BASE_URL}/ws/notifications`);
    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.reconnectAttempts = 0;
        this.subscribeToUserNotifications();
        this.subscribeToGlobalNotifications();
        this.subscribeToNotificationCount(); // Bildirim sayısı aboneliği
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers.message);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
        this.handleReconnect();
      },
      onDisconnect: () => {
        this.handleReconnect();
      },
    });

    this.client.activate();
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.initializeWebSocket();
      }, 5000);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private subscribeToUserNotifications() {
    if (!this.client) return;
    const subscription = this.client.subscribe('/user/queue/notifications', (message) => {
      const notification: AppNotification = mapApiNotification(JSON.parse(message.body));
      this.handleNotification(notification);
    });
    this.subscriptions.push(subscription);
  }

  private subscribeToGlobalNotifications() {
    if (!this.client) return;
    const subscription = this.client.subscribe('/topic/notifications', (message) => {
      const notification: AppNotification = mapApiNotification(JSON.parse(message.body));
      this.handleNotification(notification);
    });
    this.subscriptions.push(subscription);
  }

  // Bildirim sayısı aboneliği
  private subscribeToNotificationCount() {
    if (!this.client) return;
    
    const sub = this.client.subscribe('/user/queue/notification-count', (message) => {
      const data = JSON.parse(message.body);
      const { setUnreadCountFromSocket} = window.notificationStore.getState().notifications;
      setUnreadCountFromSocket(data.count);
      throttledUpdate(data.count);
    });
    
    this.subscriptions.push(sub);
  }

  // Bildirim geldiğinde hem sayıyı hem de içeriği güncelle
  private handleNotification(notification: AppNotification) {
    const { incrementUnread } = window.notificationStore.getState().notifications;
    incrementUnread();

    // UI'da bildirim gösterimi (Toast vb.)
    this.showToastNotification(notification.message);

    // Handler'lara bildir
    this.notificationHandlers.forEach((handler) => handler(notification));
  }

  // Bildirim geldiğinde ekranda toast göster
  private showToastNotification(message: string) {
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }

  public addNotificationHandler(handler: (notification: AppNotification) => void) {
    this.notificationHandlers.push(handler);
    return () => {
      this.notificationHandlers = this.notificationHandlers.filter((h) => h !== handler);
    };
  }

  public disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.client?.deactivate();
  }

  public async getUserNotifications(page = 0, size = 20): Promise<PageResponse<AppNotification>> {
    const response = await axios.get<ApiResponse<ApiNotificationResponse>>(
      `${API_BASE_URL}/notifications/user-notifications`,
      {
        ...this.getAuthHeader(),
        params: { page, size },
      }
    );
  
    const content = Array.isArray(response.data?.data?.content)
      ? response.data.data.content.map(mapApiNotification)
      : [];
  
    return {
      ...response.data.data, // 'data' içindeki veriyi alıyoruz
      content, // content dönüştürülmüş veri
    };
  }

  public async getAll(page = 0, size = 10): Promise<PageResponse<AppNotification>> {
    const response = await axios.get<PageResponse<ApiNotificationResponse>>(
      `${API_BASE_URL}/notifications/all-notifications`,
      {
        ...this.getAuthHeader(),
        params: { page, size },
      }
    );
    return {
      ...response.data,
      content: response.data.content.map(mapApiNotification),
    };
  }

  public async getUnreadNotifications(page: number, size: number): Promise<AppNotification[]> {
    const response = await axios.get<ApiNotificationResponse[]>(
      `${API_BASE_URL}/notifications/unread`,
      {
        ...this.getAuthHeader(),
        params: { page, size },
      }
    );
    return response.data.map(mapApiNotification);
  }
  public async getUnreadCount(): Promise<number> {
    try {
      const response = await axios.get<{ data: number }>(
        `${API_BASE_URL}/notifications/unread-count`,
        this.getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  public async markNotificationAsRead(notificationId: string) {
    await axios.post(
      `${API_BASE_URL}/notifications/mark-as-read/${notificationId}`,
      {},
      this.getAuthHeader()
    );
  }

  public async deleteNotification(notificationId: string) {
    await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, this.getAuthHeader());
  }

  public async sendNotificationToUser(userId: string, message: string) {
    await axios.post(
      `${API_BASE_URL}/notifications/sendToUser`,
      { userId, message },
      this.getAuthHeader()
    );
  }

  public async sendNotificationToAll(notificationData: { message: string }) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notifications/sendToAll`,
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      console.log('Bildirim başarıyla gönderildi:', response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios hatası:', error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Genel hata:', error.message);
      } else {
        console.error('Bilinmeyen hata:', error);
      }
    }
  }
}

// Bildirim sayısı güncellemelerini throttle ile sınırla
const throttledUpdate = throttle((count: number) => {
  const { setUnreadCount } = window.notificationStore.getState().notifications;
  setUnreadCount(count);
}, 1000); // Saniyede 1 güncelleme .ve tüm sınıfı

// Redux Toolkit createAsyncThunk ile kullanıcı bildirimlerini getir
export const fetchUserNotificationsAsync = createAsyncThunk< 
  PageResponse<AppNotification>, 
  { page: number; size: number },
  { rejectValue: string }
>('notifications/fetchUserNotifications', async ({ page, size }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token || token.split('.').length !== 3) {
      throw new Error('Geçerli bir token bulunamadı.');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/user-notifications?page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Bildirimler alınamadı.');
    }

    const data: PageResponse<ApiNotificationResponse> = await response.json();

    const mapped: PageResponse<AppNotification> = {
      ...data,
      content: data.content.map(mapApiNotification),
    };

    return mapped;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
    return rejectWithValue(message);
  }
});

// Uygulama başlangıcında store'u kaydedin
declare global {
  interface Window {
    notificationStore: AppStore;
  }
}
export const initializeNotificationService = (store: AppStore) => {
  window.notificationStore = store;
};

export const notificationService = new NotificationService();
export default notificationService;
