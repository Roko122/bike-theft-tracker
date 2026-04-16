export function MapSuccessOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        backgroundColor: '#198754',
        color: 'white',
        padding: '10px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        fontWeight: 600
      }}
    >
      Ilmoitus tallennettu!
    </div>
  );
}

export function MapPickHint() {
  return <div className="map-pick-hint">Klikkaa karttaa valitaksesi sijainti</div>;
}
