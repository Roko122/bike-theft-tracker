import { Alert, Button } from 'react-bootstrap';
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
    <>
      <hr />

      <h6>
        <InfoLabel
          label="Sijainti"
          tooltipId="tooltip-location"
          tooltipText={FORM_TOOLTIPS.location}
        />
      </h6>

      {locationError && <Alert variant="warning">{locationError}</Alert>}

      <div className="d-flex gap-2 flex-wrap mb-2">
        <Button type="button" variant="outline-primary" onClick={onUseMyLocation}>
          Käytä omaa sijaintia
        </Button>

        <Button
          type="button"
          variant="outline-secondary"
          onClick={onStartPickFromMap}
        >
          Valitse kartalta
        </Button>

        <Button type="button" variant="outline-danger" onClick={onClearLocation}>
          Tyhjennä sijainti
        </Button>
      </div>

      <div className="small text-muted mb-3">
        {latitude && longitude ? (
          <>
            Valittu sijainti: <strong>{latitude}</strong>,{' '}
            <strong>{longitude}</strong> (
            {locationSource === 'gps' ? 'oma sijainti' : 'kartta'})
          </>
        ) : (
          'Valitse sijainti: käytä omaa sijaintia tai klikkaa karttaa.'
        )}
      </div>
    </>
  );
}
