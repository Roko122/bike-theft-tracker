import MapPage from "./features/map/MapPage.jsx";
import { useState } from "react";
import TheftReportForm from "./features/map/ui/TheftReportForm.jsx";

export default function App() {
  const [open, setOpen] = useState(false);
  // tämä lisätty Btt-28
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  //tämä valitse kartalla
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  return (
    <div className="app-shell">
      <header className="header">
        <button
          className="menu-btn"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>


        <div className="title">
          <strong> Bike Tracker</strong>
        </div>
        <div className="speacer">

        </div>

{open && (
  <div className="map-menu" onClick={() => { 
    setOpen(false); 
    setShowForm(false); 
  }}>
    <div onClick={(e) => e.stopPropagation()} className="d-grid gap-2">

      {/* Jos lomake EI ole auki → näytä napit */}
      {!showForm && (
        <>
          <button>heloo world</button>

          <button onClick={() => setShowForm(true)}>
            varkausilmoitus
          </button>
        </>
      )}

{showForm && (
  <>
    <button onClick={() => setShowForm(false)}>
      ← takaisin
    </button>

    <TheftReportForm
      defaultLocation={selectedLocation}
      onStartPickFromMap={() => setIsPickingLocation(true)}
      onStopPickFromMap={() => setIsPickingLocation(false)}
      onCreated={() => {
        setOpen(false);
        setShowForm(false);
        setIsPickingLocation(false);
      }}
    />
  </>
)}

    </div>
  </div>
)}

      </header>
      <main className="main">
        <MapPage 
        isMenuOpen={open}
        isPickingLocation={isPickingLocation}
        onLocationSelected={(loc) => {
        setSelectedLocation(loc);
        setIsPickingLocation(false); // kun valittu, lopeta valinta
          }}
        />
      </main>
    </div>
  );
}


