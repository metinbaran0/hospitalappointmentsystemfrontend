// types/store.ts
export interface NotificationStoreActions {
    setUnreadCountFromSocket: (count: number) => void;
    incrementUnread: () => void;
    setUnreadCount: (count: number) => void;
  }
  
  export type AppStore = {
    getState: () => { notifications: NotificationStoreActions };
  };