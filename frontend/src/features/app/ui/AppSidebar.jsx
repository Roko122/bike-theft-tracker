import { ArrowLeft, FilePlus2, MapPinned } from 'lucide-react';
import TheftReportForm from '../../map/ui/TheftReportForm.jsx';
import SightingReportPage from '../../map/ui/SightingReportPage.jsx';
import TheftReportDetailsSidebar from '../../map/ui/TheftReportDetailsSidebar.jsx';

function BackButton({ onClick }) {
  return (
    <button type="button" className="app-btn app-btn--ghost" onClick={onClick}>
      <ArrowLeft size={18} />
      <span>Takaisin</span>
    </button>
  );
}

function BaseMenu({ currentUser, onOpenForm, onOpenLogin }) {
  return (
    <div className="sidebar-home">
      <div className="sidebar-panel sidebar-panel--hero">
        <div className="sidebar-hero__icon">
          <MapPinned size={20} />
        </div>
        <div className="sidebar-hero__content">
          <p className="sidebar-eyebrow">Kartta ja ilmoitukset</p>
          <h2>Pyörävarkaudet yhdellä näkymällä</h2>
          <p>
            Avaa ilmoitus kartalta tai lisää uusi havainto nopeasti nykyiseen
            sijaintiin.
          </p>
        </div>
      </div>

      <div className="sidebar-panel">
        <button
          type="button"
          className="app-btn app-btn--primary app-btn--wide"
          onClick={onOpenForm}
        >
          <FilePlus2 size={18} />
          <span>Uusi varkausilmoitus</span>
        </button>

        {!currentUser && (
          <p className="sidebar-note">
            Ilmoituksen lähettäminen vaatii kirjautumisen.
            <button
              type="button"
              className="app-inline-link"
              onClick={onOpenLogin}
            >
              Kirjaudu sisään
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
  onReportCreated,
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
