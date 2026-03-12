import MapPage from './features/map/MapPage.jsx';
import { useState } from 'react';
import TheftReportForm from './features/map/ui/TheftReportForm.jsx';
import TheftReportDetailsSidebar from './features/map/ui/TheftReportDetailsSidebar';
import LoginPage from './features/map/ui/loginPage.jsx';
import RegisterPage from './features/map/ui/RegisterPage.jsx';

export default function App() {
  const [open, setOpen] = useState(false);
  // tämä lisätty Btt-28
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  //tämä valitse kartalla
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
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
              //log in
              setShowLogin(false);
              setShowRegister(false);
              // BTT26
              setIsPickingLocation(false);
              setSelectedReportId(null); //  BTT-26: poistetaan detail-valinta

            }}
          >
            <div onClick={(e) => e.stopPropagation()} className="d-grid gap-2">
              {/* ✅ 1) BTT-26: Detail-näkymä */}
              {selectedReportId && !showForm && !showLogin && !showRegister && (
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
              {showForm && !selectedReportId && !showLogin && !showRegister && (
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
                    onLocationSelected={setSelectedLocation}
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

              {showLogin && !showForm && !selectedReportId && !showRegister && (
                  <>
                    <button onClick={() => setShowLogin(false)}>← takaisin</button>
                    <LoginPage
                      onLoginSuccess={() => setShowLogin(false)}
                      onFirstTime={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                      }}
                    />
                  </>
              )}

              {showRegister && !showForm && !selectedReportId && !showLogin && (
                  <>
                    <button
                      onClick={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                      }}
                    >
                      ← takaisin
                    </button>
                    <RegisterPage onRegistered={() => setShowRegister(false)} />
                  </>
              )}

              {showRegister && !showForm && !selectedReportId && !showLogin && (
                  <>
                    <button
                      onClick={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                      }}
                    >
                      ← takaisin
                    </button>
                    <RegisterPage onRegistered={() => setShowRegister(false)} />
                    </>
              )}


              {/* 3) Perusvalikko */}
              {!showForm && !selectedReportId && !showLogin && !showRegister && (
                <>
                  <button>heloo world</button>

                  <button
                    onClick={() => {
                      setShowForm(true);
                      setShowLogin(false);
                      setShowRegister(false);
                      setSelectedReportId(null); // varmistus: ei detail-näkymää samaan aikaan
                    }}
                  >
                    varkausilmoitus
                  </button>
                  <button
                      onClick={() => {
                        setShowLogin(true);
                        setShowRegister(false);
                        setShowForm(false);
                        setSelectedReportId(null);
                      }}
                  >
                    Kirjaudu
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
          selectedLocation={selectedLocation}
          isPickingLocation={isPickingLocation}
          onLocationSelected={(loc) => {
            // BTT-28: käyttäjä valitsi pisteen kartalta lomakkeelle
            setSelectedLocation(loc);
            setIsPickingLocation(false);
          }}
          /**
           *BTT-26: MapPage ilmoittaa, että käyttäjä valitsi ilmoituksen (marker/lista/popup)
           * - Avataan menu automaattisesti ja näytetään detailit.
           * - Suljetaan lomake, jos se oli auki (ettei tule päällekkäisyyksiä).
           */
          onReportSelected={(reportId) => {
            setSelectedReportId(reportId);
            setOpen(true); // avaa sivupalkki automaattisesti
            setShowForm(false);
            setShowLogin(false);
            setShowRegister(false);
            setIsPickingLocation(false);
          }}
        />
      </main>
    </div>
  );
}
