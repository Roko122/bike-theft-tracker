import MapPage from "./features/map/MapPage.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <strong>Polkupyörä tracker</strong> — Kartta
      </header>
      <main className="main">
        <MapPage />
      </main>
    </div>
  );
}
