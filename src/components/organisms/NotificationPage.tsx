import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../../services/NotificationService';
import NotificationList from '../organisms/NotificationList';
import { Button, Container, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { AppNotification, NotificationStatus } from '../../types/notification';
import { FaCheckDouble } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PAGE_SIZE = 10;

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('notificationPage');
  const menuRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getUserNotifications(page, PAGE_SIZE);
      setNotifications(prev => page === 0 ? response.content : [...prev, ...response.content]);
      setTotalPages(response.totalPages);
      setSelectedNotifications(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error(t('error'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, t]); // Added t to dependencies

  useEffect(() => {
    const cleanup = notificationService.addNotificationHandler((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });
    return () => cleanup();
  }, []);

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) {
      toast.info(t('noNotifications'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
      return;
    }

    try {
      setIsProcessing(true);
      const unreadIds = notifications
        .filter(n => n.status === NotificationStatus.UNREAD)
        .map(n => n.id);

      if (unreadIds.length === 0) {
        toast.info(t('allRead'), {
          position: "top-right",
          style: { marginTop: "60px" },
          autoClose: 3000
        });
        return;
      }

      await Promise.all(unreadIds.map(id =>
        notificationService.markNotificationAsRead(id)
      ));

      setNotifications(prev =>
        prev.map(n => ({ ...n, status: NotificationStatus.READ }))
      );

      toast.success(t('allMarkedRead'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
    } catch (error) {
      console.error(t('error'), error);
      toast.error(t('error'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) {
      toast.info(t('noNotificationsToDelete'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
      return;
    }

    if (isProcessing) return;

    const confirmed = window.confirm(t('confirmDeleteAll'));
    if (!confirmed) return;

    setIsProcessing(true);

    try {
      const ids = notifications.map(n => n.id);
      await Promise.all(ids.map(id =>
        notificationService.deleteNotification(id)
      ));

      setNotifications([]);
      setSelectedNotifications(new Set());
      setSelectAll(false);

      toast.success(t('allDeleted'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
    } catch (error) {
      console.error(t('error'), error);
      toast.error(t('error'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.size === 0) {
      toast.info(t('noSelection'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
      return;
    }

    try {
      setIsProcessing(true);
      await Promise.all(
        Array.from(selectedNotifications).map(id =>
          notificationService.deleteNotification(id)
        )
      );

      setNotifications(prev =>
        prev.filter(n => !selectedNotifications.has(n.id))
      );
      setSelectedNotifications(new Set());
      setSelectAll(false);

      toast.success(t('selectedDeleted'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
    } catch (error) {
      console.error(t('error'), error);
      toast.error(t('error'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.size === 0) {
      toast.info(t('noSelection'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
      return;
    }

    try {
      setIsProcessing(true);
      await Promise.all(
        Array.from(selectedNotifications).map(id =>
          notificationService.markNotificationAsRead(id)
        )
      );

      setNotifications(prev =>
        prev.map(n =>
          selectedNotifications.has(n.id)
            ? { ...n, status: NotificationStatus.READ }
            : n
        )
      );
      setSelectedNotifications(new Set());
      setSelectAll(false);

      toast.success(t('selectedMarkedRead'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
    } catch (error) {
      console.error(t('error'), error);
      toast.error(t('error'), {
        position: "top-right",
        style: { marginTop: "60px" },
        autoClose: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications(new Set());
    } else {
      const allIds = new Set(notifications.map(n => n.id));
      setSelectedNotifications(allIds);
    }
    setSelectAll(!selectAll);
  };

  const hasUnreadNotifications = notifications.some(n => n.status === NotificationStatus.UNREAD);
  const hasSelectedNotifications = selectedNotifications.size > 0;
  const someSelected = selectedNotifications.size > 0 && selectedNotifications.size < notifications.length;

  return (
    <Container maxWidth="md">
      {/* Back Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
     <Button 
    variant="contained" 
    onClick={() => navigate(-1)} 
    sx={{ backgroundColor: '#42a5f5', color: '#fff', '&:hover': { backgroundColor: '#1e88e5' } }}
  >
    {t('Back')}
  </Button>
   </Box>

      {/* Notification Header with Bulk Actions */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ textAlign: 'center', flexGrow: 1 }}>{t('Notifications')}</Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectAll}
                indeterminate={someSelected}
                onChange={toggleSelectAll}
              />
            }
            label={t('SelectAll')}
            sx={{ mr: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleMarkSelectedAsRead}
            disabled={!hasSelectedNotifications || isProcessing}
            startIcon={<FaCheckDouble />}
            size="small"
          >
            {t('markAsRead')}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            disabled={!hasSelectedNotifications || isProcessing}
            size="small"
          >
            {t('deleteSelected')}
          </Button>

          <Button
            variant="contained"
            onClick={handleMarkAllAsRead}
            disabled={!hasUnreadNotifications || isProcessing}
            startIcon={<FaCheckDouble />}
            size="small"
          >
            {t('markAllAsRead')}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAll}
            disabled={notifications.length === 0 || isProcessing}
            size="small"
          >
            {t('deleteAll')}
          </Button>
        </Box>
      </Box>

      <NotificationList
        notifications={notifications}
        loading={loading}
        selectedNotifications={selectedNotifications}
        onToggleSelect={toggleNotificationSelection}
        onMarkAsRead={async (id) => {
          await notificationService.markNotificationAsRead(id);
          setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, status: NotificationStatus.READ } : n)
          );
        }}
        onDelete={async (id) => {
          await notificationService.deleteNotification(id);
          setNotifications(prev => prev.filter(n => n.id !== id));
        }}
        getStatusText={(status) => t(`notification.${status.toLowerCase()}`)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          disabled={page === 0 || isProcessing}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          sx={{
            mr: 2,
            border: 'none',
            outline: 'none',
            background: 'none',
            color: 'inherit',
            '&:hover': {
              color: '#2c9ce7',
              background: 'none',
            },
            minWidth: 'auto',
            padding: '6px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-left-fill"
            viewBox="0 0 16 16"
          >
            <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
          </svg>
        </Button>

        <span>{t('Pages', { currentPage: page + 1, totalPages })}</span>

        <Button
          disabled={page >= totalPages - 1 || isProcessing}
          onClick={() => setPage((p) => p + 1)}
          sx={{
            ml: 2,
            border: 'none',
            outline: 'none',
            background: 'none',
            color: 'inherit',
            '&:hover': {
              color: '#2c9ce7',
              background: 'none',
            },
            minWidth: 'auto',
            padding: '6px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
          </svg>
        </Button>
      </Box>
    </Container>
  );
};

export default NotificationPage;
