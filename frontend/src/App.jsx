import MapPage from "./features/map/MapPage.jsx";

import MapPage from "./features/map/MapPage.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <button className="menu-btn">☰</button>
        <div className="title">
          <strong> Bike Tracker</strong>
        </div>
        <div className="speacer">

        </div>
      </header>
      <main className="main">
        <MapPage />
      </main>
    </div>
  );
}


