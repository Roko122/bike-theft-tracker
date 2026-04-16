import { useCallback, useEffect, useState } from 'react';
import { Bike, LogIn, LogOut, Menu, X } from 'lucide-react';
import MapPage from './features/map/MapPage.jsx';
import AppSidebar from './features/app/ui/AppSidebar.jsx';
import AuthDialog from './features/app/ui/AuthDialog.jsx';
import { useAuthSession } from './features/app/hooks/useAuthSession.js';
import { AuthProvider } from './features/app/auth/AuthContext.jsx';
import { useAppViewState } from './features/app/hooks/useAppViewState.js';

function UserBadge({ user }) {
  const label = user?.username ?? 'Käyttäjä';
  const initials = label.slice(0, 2).toUpperCase();

  return (
    <div className="header-user-badge" title={label}>
      <div className="header-user-badge__avatar">{initials}</div>
      <div className="header-user-badge__content">
        <span className="header-user-badge__label">Kirjautunut</span>
        <strong>{label}</strong>
      </div>
    </div>
  );
}

function AppContent() {
  const viewState = useAppViewState();
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentUser, sessionExpiredVersion, setCurrentUser, logout } =
    useAuthSession();

  useEffect(() => {
    if (sessionExpiredVersion > 0) {
      viewState.handleSessionExpired();
    }
  }, [sessionExpiredVersion, viewState.handleSessionExpired]);

  const handleReportCreated = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
    viewState.resetAfterSubmit();
  }, [viewState.resetAfterSubmit]);

  const handleLoginSuccess = useCallback(
    (user) => {
      setCurrentUser(user);
      viewState.closeLogin();
    },
    [setCurrentUser, viewState.closeLogin]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    viewState.openBaseMenu();
  }, [logout, viewState.openBaseMenu]);

  return (
    <div className="app-shell">
      <header className="header">
        <button
          className="menu-btn"
          onClick={
            viewState.isMenuOpen ? viewState.openBaseMenu : viewState.toggleMenu
          }
        >
          <span className="visually-hidden">
            {viewState.isMenuOpen ? 'Sulje valikko' : 'Avaa valikko'}
          </span>
          {viewState.isMenuOpen ? <X /> : <Menu />}
        </button>

        <div className="title">
          <Bike size={20} />
          <strong>Bike Theft Tracker</strong>
        </div>

        <div className="header-actions">
          {currentUser ? (
            <>
              <UserBadge user={currentUser} />
              <button
                type="button"
                className="app-btn app-btn--secondary"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Kirjaudu ulos</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="app-btn app-btn--secondary"
              onClick={viewState.openLogin}
            >
              <LogIn size={18} />
              <span>Kirjaudu tai rekisteröidy</span>
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
            onCloseMenu={viewState.openBaseMenu}
            onOpenForm={viewState.openForm}
            onCloseForm={viewState.closeForm}
            onCloseSighting={viewState.closeSighting}
            onOpenLogin={viewState.openLogin}
            onOpenSighting={viewState.openSighting}
            onStartPickFromMap={viewState.startMapPicking}
            onStopPickFromMap={viewState.stopMapPicking}
            onReportCreated={handleReportCreated}
            onReportDetailsClose={viewState.clearSelectedReport}
          />
        )}
      </header>

      <main className={viewState.isMenuOpen ? 'main main--dimmed' : 'main'}>
        <MapPage
          refreshKey={refreshKey}
          isMenuOpen={viewState.isMenuOpen}
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
            viewState.showRegister ? viewState.closeRegister : viewState.closeLogin
          }
          onLoginSuccess={handleLoginSuccess}
          onOpenRegister={viewState.openRegister}
          onBackToLogin={viewState.backToLogin}
          onRegisterSuccess={viewState.closeRegister}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
