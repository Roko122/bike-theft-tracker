import { Crosshair, MapPin, Trash2 } from 'lucide-react';
import InfoLabel from './InfoLabel.jsx';
import { FORM_TOOLTIPS } from './formOptions.js';

export default function LocationSection({
  latitude,
  longitude,
  locationSource,
  locationError,
  onUseMyLocation,
  onStartPickFromMap,
  onClearLocation
}) {
  return (
    <div className="report-section">
      <div className="report-section__title">
        <InfoLabel
          label="Sijainti"
          tooltipId="tooltip-location"
          tooltipText={FORM_TOOLTIPS.location}
        />
      </div>

      {locationError && <div className="report-alert report-alert--warning">{locationError}</div>}

      <div className="report-location-actions">
        <button
          type="button"
          className="app-btn app-btn--secondary"
          onClick={onUseMyLocation}
        >
          <Crosshair size={16} />
          <span>Käytä omaa sijaintia</span>
        </button>

        <button
          type="button"
          className="app-btn app-btn--secondary"
          onClick={onStartPickFromMap}
        >
          <MapPin size={16} />
          <span>Valitse kartalta</span>
        </button>

        <button
          type="button"
          className="app-btn app-btn--ghost"
          onClick={onClearLocation}
        >
          <Trash2 size={16} />
          <span>Tyhjennä sijainti</span>
        </button>
      </div>

      <div className="report-location-meta">
        {latitude && longitude ? (
          <>
            <strong>{latitude}</strong>
            <strong>{longitude}</strong>
            <span>{locationSource === 'gps' ? 'Oma sijainti' : 'Valittu kartalta'}</span>
          </>
        ) : (
          <span>Valitse sijainti käyttämällä omaa sijaintia tai karttaa.</span>
        )}
      </div>
    </div>
  );
}
