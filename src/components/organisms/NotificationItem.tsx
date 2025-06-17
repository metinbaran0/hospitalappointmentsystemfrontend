import React, { useState } from 'react';
import { AppNotification, NotificationType, NotificationStatus } from '../../types/notification';
import { timeAgo } from '../../utils/timeAgo';
import { FaEnvelope, FaSms, FaBell, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface NotificationProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.EMAIL:
      return <FaEnvelope style={{ color: '#007bff', marginRight: '8px' }} />;
    case NotificationType.SMS:
      return <FaSms style={{ color: '#28a745', marginRight: '8px' }} />;
    case NotificationType.PUSH:
    default:
      return <FaBell style={{ color: '#ffc107', marginRight: '8px' }} />;
  }
};

const NotificationItem: React.FC<NotificationProps> = ({ notification, onMarkAsRead, onDelete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation('notificationItem');

  const isUnread = notification.status === NotificationStatus.UNREAD;
  const createdAt = typeof notification.createdAt === 'string'
    ? notification.createdAt
    : notification.createdAt.toISOString();

  const handleDelete = async (id: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error(t('deleteError'), error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (!isExpanded && isUnread) {
      onMarkAsRead(notification.id);
    }
    setIsExpanded(!isExpanded);
  };

  const shouldTruncate = notification.message.length > 100;
  const displayMessage = isExpanded || !shouldTruncate
    ? notification.message
    : notification.message.slice(0, 100) + '...';

  return (
    <div
      className={`notification-item ${isUnread ? 'unread' : ''}`}
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        backgroundColor: isUnread ? '#eef6ff' : '#f9f9f9',
        padding: '14px',
        marginBottom: '14px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxShadow: isUnread ? '0 0 6px rgba(0, 123, 255, 0.2)' : 'none',
        animation: 'fadeIn 0.5s ease-in',
        transition: 'background-color 0.3s ease',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {isUnread && (
        <span
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '10px',
            height: '10px',
            backgroundColor: '#dc3545',
            borderRadius: '50%',
          }}
          title={t('unreadTitle')}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {getIcon(notification.type)}
        <div>
          <div style={{ fontWeight: 'bold' }}>{displayMessage}</div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>{timeAgo(createdAt)}</div>
          {shouldTruncate && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Bildirimi okundu yapmamak için
                setIsExpanded(!isExpanded);
              }}
              style={{
                marginTop: '4px',
                fontSize: '0.75rem',
                color: '#007bff',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              {isExpanded ? t('showLess') : t('showMore')}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div style={{ fontSize: '0.85rem', color: '#444', marginTop: '6px' }}>
          <small>{new Date(createdAt).toLocaleString()}</small>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(notification.id);
          }}
          style={{
            padding: '4px 10px',
            fontSize: '0.8rem',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <FaTrash style={{ marginRight: '4px' }} /> {t('delete')}
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
