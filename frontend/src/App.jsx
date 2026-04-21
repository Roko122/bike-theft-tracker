import { useCallback, useEffect, useState } from 'react';
import { Bike, BookText, Github, LogIn, LogOut, Menu, X } from 'lucide-react';
import MapPage from './features/map/MapPage.jsx';
import AppSidebar from './features/app/ui/AppSidebar.jsx';
import AuthDialog from './features/app/ui/AuthDialog.jsx';
import { useAuthSession } from './features/app/hooks/useAuthSession.js';
import { AuthProvider } from './features/app/auth/AuthContext.jsx';
import { useAppViewState } from './features/app/hooks/useAppViewState.js';
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

function AppContent() {
  const { language, setLanguage, t } = useI18n();
  const viewState = useAppViewState();
  const [refreshKey, setRefreshKey] = useState(0);
  const [flashMessage, setFlashMessage] = useState('');
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
    viewState.openBaseMenu();
    showSuccessMessage(t('flash.logoutSuccess'));
  }, [logout, showSuccessMessage, t, viewState.openBaseMenu]);

  const isMapLocked =
    viewState.showLogin ||
    viewState.showRegister ||
    (viewState.isMenuOpen && !viewState.isPickingLocation);
  const isMapDimmed = viewState.isMenuOpen && !viewState.isPickingLocation;

  return (
    <div className="app-shell">
      <AppFlashMessage message={flashMessage} />

      <header className="header">
        <button
          className="menu-btn"
          onClick={
            viewState.isMenuOpen ? viewState.openBaseMenu : viewState.toggleMenu
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
            <a
              className="app-footer__link"
              href="http://localhost:5173/docs"
              target="_blank"
              rel="noreferrer"
            >
              <BookText size={16} />
              {t('app.docs')}
            </a>
          </div>
        </div>
      </footer>
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
