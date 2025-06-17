import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../../services/NotificationService';
import { AppNotification, NotificationStatus } from '../../types/notification';
import { FaBell, FaCheckDouble } from 'react-icons/fa';

import { CSSTransition } from 'react-transition-group';
import { useNotifications } from '../../context/notificationsContext';
import './Navbar.css';
import './NotificationDropdown.css';
import { toast } from 'react-toastify';
import NotificationItem from './NotificationItem';

const PAGE_SIZE = 10;

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const nodeRef = useRef(null);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  const { unreadCount, incrementUnread, resetUnread } = useNotifications();
  const { t } = useTranslation('notificationDropdown');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getUserNotifications(currentPage - 1, PAGE_SIZE);

      if (!response?.content) {
        throw new Error("API yanıtı geçersiz");
      }

      setNotifications(response.content);
      const count = response.content.filter(n => n.status === NotificationStatus.UNREAD).length;
      if (count !== unreadCount) {
        resetUnread();
        for (let i = 0; i < count; i++) {
          incrementUnread();
        }
      }

      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(t('error'), error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cleanup = notificationService.addNotificationHandler((newNotification) => {
      console.log("Yeni bildirim alındı:", newNotification);
      setNotifications(prev => [newNotification, ...prev]);
      incrementUnread();
    });
    return () => cleanup();
  }, [incrementUnread]);

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, t]); // Added t to dependencies

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: NotificationStatus.READ } : n));
      resetUnread();
      const newCount = notifications.filter(n => n.id !== id && n.status === NotificationStatus.UNREAD).length;
      for (let i = 0; i < newCount; i++) {
        incrementUnread();
      }
    } catch (error) {
      console.error(t('markReadError'), error);
    }
  };

  const handleDelete = async (id: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await notificationService.deleteNotification(id);
      const deleted = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));

      if (deleted?.status === NotificationStatus.UNREAD) {
        resetUnread();
        const newCount = notifications.filter(n => n.id !== id && n.status === NotificationStatus.UNREAD).length;
        for (let i = 0; i < newCount; i++) {
          incrementUnread();
        }
      }
    } catch (error) {
      console.error(t('deleteError'), error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        setCurrentPage(1);
        fetchNotifications();
      }
      return next;
    });
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) {
      toast.info(t('noNotifications'), {
        position: "top-right",
        style: {
          marginTop: "60px",
        }, autoClose: 3000
      });
    }
    try {
      let page = 0;
      let allUnreadIds: string[] = [];
      let hasMore = true;

      while (hasMore) {
        const res = await notificationService.getUserNotifications(page, PAGE_SIZE);
        const unreadIds = res.content
          .filter((n) => n.status === NotificationStatus.UNREAD)
          .map((n) => n.id);
        allUnreadIds = [...allUnreadIds, ...unreadIds];

        page++;
        hasMore = page < res.totalPages;
      }

      await Promise.all(allUnreadIds.map((id) => notificationService.markNotificationAsRead(id)));

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: NotificationStatus.READ }))
      );

      resetUnread();
    } catch (error) {
      console.error(t('markAllReadError'), error);
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) {
      toast.info(t('noNotificationsToDelete'), {
        position: "top-right",
        style: {
          marginTop: "60px",
        }, autoClose: 3000
      });
    }
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      let page = 0;
      let allIds: string[] = [];
      let hasMore = true;

      while (hasMore) {
        const res = await notificationService.getUserNotifications(page, PAGE_SIZE);
        allIds = [...allIds, ...res.content.map((n) => n.id)];
        page++;
        hasMore = page < res.totalPages;
      }

      await Promise.all(allIds.map((id) => notificationService.deleteNotification(id)));

      setNotifications([]);
      resetUnread();
    } catch (error) {
      console.error(t('deleteAllError'), error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewAll = () => {
    if (notifications.length === 0) {
      toast.info(t('noNotificationsNavigate'), {
        position: "top-right",
        style: {
          marginTop: "60px",
        }, autoClose: 3000
      });
    } else {
      setIsOpen(false);
      navigate('/notifications');
    }
  };

  const renderErrorMessage = () => (
    <div className="error-message">
      <p>{t('fetchError')}</p>
    </div>
  );

  return (
    <div className="notification-dropdown-container">
      <button className="notification-button" onClick={handleToggleDropdown}>
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      <CSSTransition
        nodeRef={nodeRef}
        in={isOpen}
        timeout={300}
        classNames="dropdown"
        unmountOnExit
      >
        <div ref={nodeRef} className="notification-dropdown">
          <div className="notification-header">
            <h3>{t('title')}</h3>

            <div className="dropdown-menu-container" ref={menuRef}>
              <button className="menu-toggle-button" onClick={() => setShowMenu(prev => !prev)}>
                &#9776;
              </button>

              {showMenu && (
                <div className="dropdown-menu">
                  <button onClick={handleMarkAllAsRead}>
                    <FaCheckDouble /> {t('markAllRead')}
                  </button>
                  <button onClick={handleViewAll}>
                    👁 {t('viewAll')}
                  </button>
                  <button onClick={handleDeleteAll}>
                    🗑 {t('deleteAll')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="notification-list">
            {hasError ? (
              renderErrorMessage()
            ) : loading ? (
              <div className="loading">{t('loading')}</div>
            ) : notifications.length === 0 ? (
              <div className="empty">{t('noNotifications')}</div>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="notification-pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                </svg>
              </button>
              <span> {currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};

export default NotificationDropdown;
