import MapPage from './features/map/MapPage.jsx';
import { useState } from 'react';
import TheftReportForm from './features/map/ui/TheftReportForm.jsx';
import TheftReportDetailsSidebar from './features/map/ui/TheftReportDetailsSidebar';

export default function App() {
  const [open, setOpen] = useState(false);
  // tämä lisätty Btt-28
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  //tämä valitse kartalla
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  return (
    <div className="app-shell">
      <header className="header">
        <button className="menu-btn" onClick={() => setOpen((v) => !v)}>
          {open ? '✕' : '☰'}
        </button>

        <div className="title">
          <strong> Bike Tracker</strong>
        </div>
        <div className="speacer"></div>

        {open && (
          <div
            className="map-menu"
            onClick={() => {
              setOpen(false);
              setShowForm(false);
              // BTT26
              setIsPickingLocation(false);
              setSelectedReportId(null); // ✅ BTT-26: poistetaan detail-valinta
            }}
          >
            <div onClick={(e) => e.stopPropagation()} className="d-grid gap-2">
              {/* ✅ 1) BTT-26: Detail-näkymä */}
              {selectedReportId && !showForm && (
                <>
                  <button
                    onClick={() => {
                      // paluu perusvalikkoon (menu pysyy auki)
                      setSelectedReportId(null);
                    }}
                  >
                    ← takaisin
                  </button>
                  <TheftReportDetailsSidebar
                    reportId={selectedReportId}
                    onClose={() => {
                      // Palataan perusvalikkoon (menu pysyy auki)
                      setSelectedReportId(null);
                    }}
                  />
                </>
              )}

              {/* 2) BTT-28: Lomake */}
              {showForm && !selectedReportId && (
                <>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setIsPickingLocation(false);
                    }}
                  >
                    ← takaisin
                  </button>

                  <TheftReportForm
                    defaultLocation={selectedLocation}
                    onStartPickFromMap={() => setIsPickingLocation(true)}
                    onStopPickFromMap={() => setIsPickingLocation(false)}
                    onCreated={() => {
                      // kun ilmoitus luotu, suljetaan menu ja lopetetaan kartalta valinta
                      setOpen(false);
                      setShowForm(false);
                      setIsPickingLocation(false);
                    }}
                  />
                </>
              )}

              {/* 3) Perusvalikko */}
              {!showForm && !selectedReportId && (
                <>
                  <button>heloo world</button>

                  <button
                    onClick={() => {
                      setShowForm(true);
                      setSelectedReportId(null); // varmistus: ei detail-näkymää samaan aikaan
                    }}
                  >
                    varkausilmoitus
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

        <main className={open ? 'main main--dimmed' : 'main'}>
        <MapPage
          isMenuOpen={open}
          isPickingLocation={isPickingLocation}
          onLocationSelected={(loc) => {
            // BTT-28: käyttäjä valitsi pisteen kartalta lomakkeelle
            setSelectedLocation(loc);
            setIsPickingLocation(false);
          }}
          /**
           * ✅ BTT-26: MapPage ilmoittaa, että käyttäjä valitsi ilmoituksen (marker/lista/popup)
           * - Avataan menu automaattisesti ja näytetään detailit.
           * - Suljetaan lomake, jos se oli auki (ettei tule päällekkäisyyksiä).
           */
          onReportSelected={(reportId) => {
            setSelectedReportId(reportId);
            setOpen(true); // avaa sivupalkki automaattisesti
            setShowForm(false);
            setIsPickingLocation(false);
          }}
        />
      </main>
    </div>
  );
}
