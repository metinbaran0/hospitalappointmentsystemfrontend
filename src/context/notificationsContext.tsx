import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
  } from 'react';
  import { notificationService } from '../services/NotificationService';
  
  type NotificationsContextType = {
    unreadCount: number;
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>; // set fonksiyonu dahil
    incrementUnread: () => void;
    resetUnread: () => void;
    refreshUnreadCount: () => Promise<void>;
  };
  
  const NotificationsContext = createContext<NotificationsContextType>({
    unreadCount: 0,
    setUnreadCount: () => {}, // default boş fonksiyon
    incrementUnread: () => {},
    resetUnread: () => {},
    refreshUnreadCount: async () => {},
  });
  
  export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
  
    const incrementUnread = useCallback(() => {
      setUnreadCount(prev => prev + 1);
    }, []);
  
    const resetUnread = () => {
      setUnreadCount(0);
    };
  
    const refreshUnreadCount = useCallback(async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    }, []);
  
    useEffect(() => {
      refreshUnreadCount();
  
      const interval = setInterval(refreshUnreadCount, 30000); // 30 saniyede bir yenile
      return () => clearInterval(interval);
    }, [refreshUnreadCount]);
  
    return (
      <NotificationsContext.Provider
        value={{
          unreadCount,
          setUnreadCount,
          incrementUnread,
          resetUnread,
          refreshUnreadCount,
        }}
      >
        {children}
      </NotificationsContext.Provider>
    );
  };
  
  export const useNotifications = () => useContext(NotificationsContext);
  