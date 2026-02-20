import MapPage from "./features/map/MapPage.jsx";
import { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false);
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
  <div className="map-menu" onClick={() => setOpen(false)}>
    <button onClick={(e) => e.stopPropagation()}>
      heloo world
    </button>

    <button onClick={(e) => e.stopPropagation()}>
      jotain tärkeää
    </button>
  </div>
)}

      </header>
      <main className="main">
        <MapPage />
      </main>
    </div>
  );
}


