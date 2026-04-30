import MapPage from './features/map/MapPage.jsx';
import AppSidebar from './features/app/ui/AppSidebar.jsx';
import AuthDialog from './features/app/ui/AuthDialog.jsx';
import DocumentationPage from './features/app/docs/DocumentationPage.jsx';
import AppFlashMessage from './features/app/ui/AppFlashMessage.jsx';
import AppFooter from './features/app/ui/AppFooter.jsx';
import AppHeader from './features/app/ui/AppHeader.jsx';
import { useAppShellController } from './features/app/hooks/useAppShellController.js';

function AppContent() {
  const {
    authDialogMode,
    currentUser,
    flashMessage,
    handleLoginSuccess,
    handleLogout,
    handleRegisterSuccess,
    handleReportCreated,
    handleReportDeleted,
    handleReportUpdated,
    handleShowReportOnMap,
    handleSightingCreated,
    isMapDimmed,
    isMapLocked,
    language,
    refreshKey,
    setLanguage,
    setShowDocs,
    showDocs,
    t,
    viewState
  } = useAppShellController();

  return (
    <div className="app-shell">
      <AppFlashMessage message={flashMessage} />

      {showDocs ? (
        <div className="docs-full-screen">
          <DocumentationPage onClose={() => setShowDocs(false)} />
        </div>
      ) : (
        <>
          <AppHeader
            currentUser={currentUser}
            isMenuOpen={viewState.isMenuOpen}
            language={language}
            onLanguageChange={setLanguage}
            onLogout={handleLogout}
            onOpenLogin={viewState.openLogin}
            onOpenMyReports={viewState.openMyReports}
            onToggleMenu={
              viewState.isMenuOpen
                ? viewState.openBaseMenu
                : viewState.toggleMenu
            }
            t={t}
          >
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
          </AppHeader>

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
              mode={authDialogMode}
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

          <AppFooter onOpenDocs={() => setShowDocs(true)} t={t} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
