import React from 'react';
import { AppNotification, NotificationStatus } from '../../types/notification';
import NotificationItem from './NotificationItem';
import { CircularProgress, Box, Typography, ListItem, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface NotificationListProps {
  notifications: AppNotification[];
  loading: boolean;
  selectedNotifications: Set<string>;
  onToggleSelect: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getStatusText: (status: string) => string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  selectedNotifications,
  onToggleSelect,
  onMarkAsRead,
  onDelete,
  getStatusText
}) => {
  const { t } = useTranslation('notificationList');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="textSecondary">
          {t('noNotifications')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {notifications.map(notification => (
        <ListItem
          key={notification.id}
          sx={{
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Checkbox
            checked={selectedNotifications.has(notification.id)}
            onChange={() => onToggleSelect(notification.id)}
          />
          <Box sx={{ flexGrow: 1 }}>
            <NotificationItem
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          </Box>
        </ListItem>
      ))}
    </Box>
  );
};

export default NotificationList;
