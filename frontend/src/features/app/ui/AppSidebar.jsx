import { ArrowLeft, FilePlus2, MapPinned } from 'lucide-react';
import TheftReportForm from '../../map/ui/TheftReportForm.jsx';
import SightingReportPage from '../../map/ui/SightingReportPage.jsx';
import TheftReportDetailsSidebar from '../../map/ui/TheftReportDetailsSidebar.jsx';
import { useI18n } from '../i18n/LanguageContext.jsx';

function BackButton({ onClick }) {
  const { t } = useI18n();

  return (
    <button type="button" className="app-btn app-btn--ghost" onClick={onClick}>
      <ArrowLeft size={18} />
      <span>{t('sidebar.back')}</span>
    </button>
  );
}

function BaseMenu({ currentUser, onOpenForm, onOpenLogin }) {
  const { t } = useI18n();

  return (
    <div className="sidebar-home">
      <div className="sidebar-panel sidebar-panel--hero">
        <div className="sidebar-hero__icon">
          <MapPinned size={20} />
        </div>
        <div className="sidebar-hero__content">
          <p className="sidebar-eyebrow">{t('sidebar.eyebrow')}</p>
          <h2>{t('sidebar.title')}</h2>
          <p>{t('sidebar.subtitle')}</p>
        </div>
      </div>

      <div className="sidebar-panel">
        <button
          type="button"
          className="app-btn app-btn--primary app-btn--wide"
          onClick={onOpenForm}
        >
          <FilePlus2 size={18} />
          <span>{t('sidebar.newTheftReport')}</span>
        </button>

        {!currentUser && (
          <p className="sidebar-note">
            {t('sidebar.loginRequired')}
            <button
              type="button"
              className="app-inline-link"
              onClick={onOpenLogin}
            >
              {t('sidebar.login')}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default function AppSidebar({
  currentUser,
  selectedReportId,
  selectedLocation,
  showForm,
  showSighting,
  onCloseMenu,
  onOpenForm,
  onCloseForm,
  onCloseSighting,
  onOpenLogin,
  onOpenSighting,
  onStartPickFromMap,
  onStopPickFromMap,
  onClearPickedLocation,
  onLocationSelected,
  onReportCreated,
  onSightingCreated,
  onReportDetailsClose
}) {
  return (
    <div className="map-menu" onClick={onCloseMenu}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="d-flex flex-column gap-3"
        style={{ minHeight: '100%' }}
      >
        {showSighting && selectedReportId && (
          <>
            <BackButton onClick={onCloseSighting} />
            <SightingReportPage
              reportId={selectedReportId}
              defaultLocation={selectedLocation}
              onStartPickFromMap={onStartPickFromMap}
              onStopPickFromMap={onStopPickFromMap}
              onClearPickedLocation={onClearPickedLocation}
              onCreated={onSightingCreated}
            />
          </>
        )}

        {selectedReportId && !showForm && !showSighting && (
          <TheftReportDetailsSidebar
            reportId={selectedReportId}
            onClose={onReportDetailsClose}
            canCreateSighting={Boolean(currentUser)}
            onCreateSighting={() => onOpenSighting?.(selectedReportId)}
          />
        )}

        {showForm && !selectedReportId && !showSighting && (
          <>
            <BackButton onClick={onCloseForm} />
            <TheftReportForm
              defaultLocation={selectedLocation}
              onStartPickFromMap={onStartPickFromMap}
              onStopPickFromMap={onStopPickFromMap}
              onClearPickedLocation={onClearPickedLocation}
              onLocationSelected={onLocationSelected}
              onCreated={onReportCreated}
            />
          </>
        )}

        {!showForm && !selectedReportId && !showSighting && (
          <BaseMenu
            currentUser={currentUser}
            onOpenForm={onOpenForm}
            onOpenLogin={onOpenLogin}
          />
        )}
      </div>
    </div>
  );
}
