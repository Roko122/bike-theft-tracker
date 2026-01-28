import { useState } from "react";

export default function MapControls({ onCenterToUser, onToggleThefts }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="map-controls">
      <button onClick={() => setOpen((v) => !v)}>
        {open ? "Sulje" : "Valikko"}
      </button>

      {open && (
        <div className="map-menu">
          <button onClick={onToggleThefts}>Näytä / piilota varkaudet</button>
          <button onClick={onCenterToUser}>Keskitä sijaintiin</button>
        </div>
      )}
    </div>
  );
}
