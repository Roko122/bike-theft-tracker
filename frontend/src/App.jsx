import MapPage from "./features/map/MapPage.jsx";
import { useState } from "react";
import TheftReportForm from "./features/map/ui/TheftReportForm.jsx";

export default function App() {
  const [open, setOpen] = useState(false);
  // tämä lisätty Btt-28
  const [showForm, setShowForm] = useState(false);
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

      {/* Jos lomake on auki → näytä lomake */}
      {showForm && (
        <>
          <button onClick={() => setShowForm(false)}>
            ← takaisin
          </button>

          <TheftReportForm
            onCreated={() => {
              setOpen(false);
              setShowForm(false);
            }}
          />
        </>
      )}

    </div>
  </div>
)}

      </header>
      <main className="main">
        <MapPage isMenuOpen={open} />
      </main>
    </div>
  );
}


