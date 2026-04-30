import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import {
  getUnreadNotificationCount,
  getUnreadNotifications,
  markNotificationAsRead
} from '../../api/notificationApi.js';
import { useI18n } from '../i18n/LanguageContext.jsx';

function formatNotificationTime(time, language) {
  if (!time) {
    return '';
  }

  const date = new Date(time);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString(language === 'fi' ? 'fi-FI' : 'en-US', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

export default function NotificationMenu({ currentUser, onOpenReport }) {
  const { language, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationItems, setNotificationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);

  const loadNotificationCount = useCallback(async () => {
    if (!currentUser) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await getUnreadNotificationCount();
      const nextUnreadCount = Number(data?.unreadCount);
      setUnreadCount(Number.isFinite(nextUnreadCount) ? nextUnreadCount : 0);
    } catch {
      setUnreadCount(0);
    }
  }, [currentUser]);

  const loadNotifications = useCallback(async () => {
    if (!currentUser) {
      setNotificationItems([]);
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await getUnreadNotifications();
      const unreadItems = Array.isArray(data) ? data : [];
      setNotificationItems(unreadItems);
      setUnreadCount(unreadItems.length);
    } catch (error) {
      setErrorMessage(error?.message || t('app.notifications.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, t]);

  useEffect(() => {
    if (!currentUser) {
      setIsOpen(false);
      setNotificationItems([]);
      setErrorMessage('');
      setUnreadCount(0);
      return undefined;
    }

    void loadNotificationCount();
    return undefined;
  }, [currentUser, loadNotificationCount]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleDocumentPointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentPointerDown);
    document.addEventListener('touchstart', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentPointerDown);
      document.removeEventListener('touchstart', handleDocumentPointerDown);
    };
  }, [isOpen]);

  const toggleNotifications = useCallback(() => {
    setIsOpen((previouslyOpen) => {
      const shouldOpen = !previouslyOpen;
      if (shouldOpen) {
        void loadNotifications();
      }
      return shouldOpen;
    });
  }, [loadNotifications]);

  const handleNotificationClick = useCallback(
    (notification) => {
      if (!notification?.theftReport) {
        return;
      }

      if (notification.id) {
        void markNotificationAsRead(notification.id).catch(() => {});
      }

      setNotificationItems((previous) =>
        previous.filter((item) => item.id !== notification.id)
      );
      setUnreadCount((current) => Math.max(0, current - 1));
      setIsOpen(false);
      onOpenReport(notification.theftReport);
    },
    [onOpenReport]
  );

  return (
    <div className="notification-menu" ref={menuRef}>
      <button
        type="button"
        className="notification-bell"
        aria-label={t('app.notifications.open')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggleNotifications}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown" role="menu">
          <div className="notification-dropdown__header">{t('app.notifications.title')}</div>

          {isLoading && (
            <div className="notification-dropdown__state">{t('common.loading')}</div>
          )}

          {!isLoading && errorMessage && (
            <div className="notification-dropdown__state notification-dropdown__state--error">
              {errorMessage}
            </div>
          )}

          {!isLoading && !errorMessage && notificationItems.length === 0 && (
            <div className="notification-dropdown__state">{t('app.notifications.empty')}</div>
          )}

          {!isLoading &&
            !errorMessage &&
            notificationItems.length > 0 &&
            notificationItems.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className="notification-item"
                onClick={() => handleNotificationClick(notification)}
              >
                <span className="notification-item__title">
                  {t(`app.notifications.types.${notification.type}`)}
                </span>
                <span className="notification-item__time">
                  {formatNotificationTime(notification.time, language)}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
