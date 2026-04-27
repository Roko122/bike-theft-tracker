import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  Bike,
  BookText,
  Github,
  LogIn,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import MapPage from './features/map/MapPage.jsx';
import AppSidebar from './features/app/ui/AppSidebar.jsx';
import AuthDialog from './features/app/ui/AuthDialog.jsx';
import DocumentationPage from './features/app/docs/DocumentationPage.jsx';
import { useAuthSession } from './features/app/hooks/useAuthSession.js';
import { AuthProvider } from './features/app/auth/AuthContext.jsx';
import { useAppViewState } from './features/app/hooks/useAppViewState.js';
import {
  getUnreadNotificationCount,
  getUnreadNotifications,
  markNotificationAsRead
} from './features/api/notificationApi.js';
import {
  LanguageProvider,
  useI18n
} from './features/app/i18n/LanguageContext.jsx';

function UserBadge({ user }) {
  const { t } = useI18n();
  const label = user?.username ?? 'User';
  const initials = label.slice(0, 2).toUpperCase();

  return (
    <div className="header-user-badge" title={label}>
      <div className="header-user-badge__avatar">{initials}</div>
      <div className="header-user-badge__content">
        <span className="header-user-badge__label">{t('app.loggedIn')}</span>
        <strong>{label}</strong>
      </div>
    </div>
  );
}

function AppFlashMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="app-flash" role="status" aria-live="polite">
      {message}
    </div>
  );
}

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

function AppContent() {
  const { language, setLanguage, t } = useI18n();
  const viewState = useAppViewState();
  const [refreshKey, setRefreshKey] = useState(0);
  const [flashMessage, setFlashMessage] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationItems, setNotificationItems] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const notificationMenuRef = useRef(null);
  const { currentUser, sessionExpiredVersion, setCurrentUser, logout } =
    useAuthSession();

  useEffect(() => {
    if (sessionExpiredVersion > 0) {
      viewState.handleSessionExpired();
    }
  }, [sessionExpiredVersion, viewState.handleSessionExpired]);

  useEffect(() => {
    if (!flashMessage) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setFlashMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [flashMessage]);

  const showSuccessMessage = useCallback((message) => {
    setFlashMessage(message);
  }, []);

  const handleReportCreated = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
    viewState.resetAfterSubmit();
    showSuccessMessage(t('flash.theftSaved'));
  }, [showSuccessMessage, t, viewState.resetAfterSubmit]);

  const handleSightingCreated = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
    viewState.resetAfterSubmit();
    showSuccessMessage(t('flash.sightingSaved'));
  }, [showSuccessMessage, t, viewState.resetAfterSubmit]);

  const handleReportUpdated = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
    showSuccessMessage(t('flash.theftUpdated'));
  }, [showSuccessMessage, t]);

  const handleReportDeleted = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
    viewState.clearSelectedReport();
    showSuccessMessage(t('flash.theftDeleted'));
  }, [showSuccessMessage, t, viewState.clearSelectedReport]);

  const handleShowReportOnMap = useCallback(
    (location) => {
      if (!location) {
        return;
      }
      viewState.selectLocation(location);
    },
    [viewState.selectLocation]
  );

  const handleLoginSuccess = useCallback(
    (user) => {
      setCurrentUser(user);
      viewState.closeLogin();
      showSuccessMessage(t('flash.loginSuccess'));
    },
    [setCurrentUser, showSuccessMessage, t, viewState.closeLogin]
  );

  const handleRegisterSuccess = useCallback(
    (user) => {
      setCurrentUser(user);
      viewState.closeRegister();
      showSuccessMessage(t('flash.loginSuccess'));
    },
    [setCurrentUser, showSuccessMessage, t, viewState.closeRegister]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    setIsNotificationsOpen(false);
    setNotificationItems([]);
    setUnreadNotificationCount(0);
    viewState.openBaseMenu();
    showSuccessMessage(t('flash.logoutSuccess'));
  }, [logout, showSuccessMessage, t, viewState.openBaseMenu]);

  const loadNotificationCount = useCallback(async () => {
    if (!currentUser) {
      setUnreadNotificationCount(0);
      return;
    }

    try {
      const data = await getUnreadNotificationCount();
      const unreadCount = Number(data?.unreadCount);
      setUnreadNotificationCount(Number.isFinite(unreadCount) ? unreadCount : 0);
    } catch {
      setUnreadNotificationCount(0);
    }
  }, [currentUser]);

  const loadNotifications = useCallback(async () => {
    if (!currentUser) {
      setNotificationItems([]);
      setUnreadNotificationCount(0);
      return;
    }

    try {
      setNotificationsLoading(true);
      setNotificationsError('');
      const data = await getUnreadNotifications();
      const unreadItems = Array.isArray(data) ? data : [];
      setNotificationItems(unreadItems);
      setUnreadNotificationCount(unreadItems.length);
    } catch (error) {
      setNotificationsError(error?.message || t('app.notifications.loadFailed'));
    } finally {
      setNotificationsLoading(false);
    }
  }, [currentUser, t]);

  useEffect(() => {
    if (!currentUser) {
      setIsNotificationsOpen(false);
      setNotificationItems([]);
      setNotificationsError('');
      setUnreadNotificationCount(0);
      return undefined;
    }

    void loadNotificationCount();

    const interval = setInterval(() => {
      void loadNotificationCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser, loadNotificationCount]);

  useEffect(() => {
    if (!isNotificationsOpen) {
      return undefined;
    }

    function handleDocumentPointerDown(event) {
      if (!notificationMenuRef.current?.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentPointerDown);
    document.addEventListener('touchstart', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentPointerDown);
      document.removeEventListener('touchstart', handleDocumentPointerDown);
    };
  }, [isNotificationsOpen]);

  const toggleNotifications = useCallback(() => {
    setIsNotificationsOpen((isOpen) => {
      const shouldOpen = !isOpen;
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
      setUnreadNotificationCount((current) => Math.max(0, current - 1));
      setIsNotificationsOpen(false);
      viewState.openMyReports(notification.theftReport);
    },
    [viewState.openMyReports]
  );

  const isMapLocked =
    viewState.showLogin ||
    viewState.showRegister ||
    (viewState.isMenuOpen && !viewState.isPickingLocation);
  const isMapDimmed = viewState.isMenuOpen && !viewState.isPickingLocation;

  return (
    <div className="app-shell">
      <AppFlashMessage message={flashMessage} />

      {showDocs ? (
        <div className="docs-full-screen">
          <DocumentationPage onClose={() => setShowDocs(false)} />
        </div>
      ) : (
        <>
          <header className="header">
            <button
              className="menu-btn"
              onClick={
                viewState.isMenuOpen
                  ? viewState.openBaseMenu
                  : viewState.toggleMenu
              }
            >
              <span className="visually-hidden">
                {viewState.isMenuOpen ? t('app.closeMenu') : t('app.openMenu')}
              </span>
              {viewState.isMenuOpen ? <X /> : <Menu />}
            </button>

            <div className="title">
              <Bike size={20} />
              <strong>{t('common.appName')}</strong>
            </div>

            <div className="header-actions">
              <div
                className="language-switch"
                role="group"
                aria-label={t('common.language')}
              >
                <button
                  type="button"
                  className={
                    language === 'fi'
                      ? 'language-switch__button language-switch__button--active'
                      : 'language-switch__button'
                  }
                  onClick={() => setLanguage('fi')}
                >
                  FI
                </button>
                <button
                  type="button"
                  className={
                    language === 'en'
                      ? 'language-switch__button language-switch__button--active'
                      : 'language-switch__button'
                  }
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
              </div>

              {currentUser ? (
                <>
                  <div className="notification-menu" ref={notificationMenuRef}>
                    <button
                      type="button"
                      className="notification-bell"
                      aria-label={t('app.notifications.open')}
                      aria-expanded={isNotificationsOpen}
                      aria-haspopup="menu"
                      onClick={toggleNotifications}
                    >
                      <Bell size={18} />
                      {unreadNotificationCount > 0 && (
                        <span className="notification-bell__badge">
                          {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                        </span>
                      )}
                    </button>

                    {isNotificationsOpen && (
                      <div className="notification-dropdown" role="menu">
                        <div className="notification-dropdown__header">
                          {t('app.notifications.title')}
                        </div>

                        {notificationsLoading && (
                          <div className="notification-dropdown__state">
                            {t('common.loading')}
                          </div>
                        )}

                        {!notificationsLoading && notificationsError && (
                          <div className="notification-dropdown__state notification-dropdown__state--error">
                            {notificationsError}
                          </div>
                        )}

                        {!notificationsLoading &&
                          !notificationsError &&
                          notificationItems.length === 0 && (
                            <div className="notification-dropdown__state">
                              {t('app.notifications.empty')}
                            </div>
                          )}

                        {!notificationsLoading &&
                          !notificationsError &&
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

                  <UserBadge user={currentUser} />
                  <button
                    type="button"
                    className="app-btn app-btn--secondary"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span>{t('app.logout')}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="app-btn app-btn--secondary"
                  onClick={viewState.openLogin}
                >
                  <LogIn size={18} />
                  <span>{t('app.loginOrRegister')}</span>
                </button>
              )}
            </div>

            {viewState.isMenuOpen && (
              <AppSidebar
                currentUser={currentUser}
                selectedReportId={viewState.selectedReportId}
                focusedMyReportId={viewState.focusedMyReportId}
                selectedLocation={viewState.selectedLocation}
                showForm={viewState.showForm}
                showSighting={viewState.showSighting}
                showMyReports={viewState.showMyReports}
                onOpenMyReports={viewState.openMyReports}
                onCloseMyReports={viewState.openBaseMenu}
                onSelectMyReport={viewState.showReportDetails}
                onCloseMenu={viewState.openBaseMenu}
                onOpenForm={viewState.openForm}
                onCloseForm={viewState.closeForm}
                onCloseSighting={viewState.closeSighting}
                onOpenLogin={viewState.openLogin}
                onOpenSighting={viewState.openSighting}
                onStartPickFromMap={viewState.startMapPicking}
                onStopPickFromMap={viewState.stopMapPicking}
                onClearPickedLocation={viewState.clearSelectedLocation}
                onLocationSelected={viewState.selectLocation}
                onReportCreated={handleReportCreated}
                onSightingCreated={handleSightingCreated}
                onReportDetailsClose={viewState.clearSelectedReport}
                onShowReportOnMap={handleShowReportOnMap}
                onReportDeleted={handleReportDeleted}
                onReportUpdated={handleReportUpdated}
              />
            )}
          </header>

          <main className={isMapDimmed ? 'main main--dimmed' : 'main'}>
            <MapPage
              refreshKey={refreshKey}
              isMenuOpen={viewState.isMenuOpen}
              isInteractionLocked={isMapLocked}
              selectedLocation={viewState.selectedLocation}
              isPickingLocation={viewState.isPickingLocation}
              onLocationSelected={viewState.selectLocation}
              onReportSelected={viewState.showReportDetails}
            />
          </main>

          {(viewState.showLogin || viewState.showRegister) && (
            <AuthDialog
              mode={viewState.showRegister ? 'register' : 'login'}
              onClose={
                viewState.showRegister
                  ? viewState.closeRegister
                  : viewState.closeLogin
              }
              onLoginSuccess={handleLoginSuccess}
              onOpenRegister={viewState.openRegister}
              onBackToLogin={viewState.backToLogin}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}

          <footer className="app-footer">
            <div className="app-footer__content">
              <span className="app-footer__brand">&copy; RKRS</span>
              <div className="app-footer__links">
                <a
                  className="app-footer__link"
                  href="https://github.com/Roko122/bike-theft-tracker"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={16} />
                  {t('app.github')}
                </a>
                <button
                  className="app-footer__link"
                  onClick={() => setShowDocs(true)}
                  type="button"
                  aria-label="Open documentation"
                >
                  <BookText size={16} />
                  {t('app.docs')}
                </button>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
