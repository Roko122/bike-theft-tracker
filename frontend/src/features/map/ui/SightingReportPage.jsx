import { useEffect, useState } from 'react';
import {
  Binoculars,
  Camera,
  Crosshair,
  MapPin,
  Send,
  Trash2
} from 'lucide-react';
import { createSightingForReport } from '../../api/theftReportApi.js';

function Message({ tone, children }) {
  return <div className={`sighting-alert sighting-alert--${tone}`}>{children}</div>;
}

export default function SightingReportPage({
  report,
  reportId,
  defaultLocation,
  onStartPickFromMap,
  onStopPickFromMap,
  onClearPickedLocation
}) {
  const effectiveReportId = report?.id ?? reportId;
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState(defaultLocation?.latitude ?? '');
  const [longitude, setLongitude] = useState(defaultLocation?.longitude ?? '');
  const [locationSource, setLocationSource] = useState(
    defaultLocation ? 'map' : ''
  );
  const [locationError, setLocationError] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  function setLocation(lat, lon, source) {
    setLatitude(String(lat));
    setLongitude(String(lon));
    setLocationSource(source);
  }

  function useMyLocation() {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Selaimesi ei tue sijainnin hakua.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          position.coords.latitude,
          position.coords.longitude,
          'gps'
        );
      },
      (positionError) => {
        setLocationError(
          positionError.message || 'Sijainnin haku epäonnistui. Tarkista luvat.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  }

  function clearLocation() {
    setLatitude('');
    setLongitude('');
    setLocationSource('');
    setLocationError('');
  }

  useEffect(() => {
    if (defaultLocation?.latitude && defaultLocation?.longitude) {
      setLocation(defaultLocation.latitude, defaultLocation.longitude, 'map');
      setLocationError('');
    }
  }, [defaultLocation]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!effectiveReportId) {
      setError(
        'Valitun ilmoituksen tunniste puuttuu. Avaa havainto ilmoituksen kautta.'
      );
      return;
    }

    if (!description.trim()) {
      setError('Kuvaus on pakollinen.');
      return;
    }

    const latNum = Number(latitude);
    const lonNum = Number(longitude);

    if (
      !latitude ||
      !longitude ||
      Number.isNaN(latNum) ||
      Number.isNaN(lonNum)
    ) {
      setError('Sijainti puuttuu. Valitse oma sijainti tai kartalta.');
      return;
    }

    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      setError('Sijainti ei ole kelvollinen.');
      return;
    }

    if (image && image.size > 5 * 1024 * 1024) {
      setError('Kuvan enimmäiskoko on 5 MB.');
      return;
    }

    const payload = {
      description: description.trim(),
      location: {
        latitude: latNum,
        longitude: lonNum
      }
    };

    try {
      setLoading(true);
      await createSightingForReport(effectiveReportId, payload, image);
      setSuccessMsg('Havaintoilmoitus tallennettu.');
      setDescription('');
      setImage(null);
    } catch (submitError) {
      setError(
        submitError?.message || 'Havaintoilmoituksen tallennus epäonnistui.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="sighting-card">
      <div className="sighting-card__hero">
        <div className="sighting-card__icon">
          <Binoculars size={20} />
        </div>
        <div className="sighting-card__hero-copy">
          <p className="sighting-card__eyebrow">Uusi havainto</p>
          <h2 className="sighting-card__title">Havaintoilmoitus</h2>
          <p className="sighting-card__subtitle">
            Kirjaa missä pyörä havaittiin ja lisää kuva, jos sellainen on.
          </p>
        </div>
      </div>

      {error && <Message tone="danger">{error}</Message>}
      {successMsg && <Message tone="success">{successMsg}</Message>}
      {locationError && <Message tone="warning">{locationError}</Message>}

      <form className="sighting-form" onSubmit={handleSubmit}>
        <label className="sighting-field">
          <span className="sighting-field__label">Mitä havaitsit?</span>
          <textarea
            className="sighting-textarea"
            rows={5}
            placeholder="Kuvaile mahdollisimman tarkasti mitä näit, milloin ja missä tilanteessa."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <div className="sighting-grid">
          <div className="sighting-section">
            <div className="sighting-section__header">
              <Camera size={16} />
              <span>Kuva</span>
            </div>
            <label className="sighting-file">
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              />
              <span className="sighting-file__title">
                {image ? image.name : 'Valitse kuva'}
              </span>
              <span className="sighting-file__hint">
                Enintään 1 kuva. PNG, JPG tai JPEG. Maksimikoko 5 MB.
              </span>
            </label>
          </div>

          <div className="sighting-section">
            <div className="sighting-section__header">
              <MapPin size={16} />
              <span>Sijainti</span>
            </div>

            <div className="sighting-location-actions">
              <button
                type="button"
                className="app-btn app-btn--secondary"
                onClick={useMyLocation}
              >
                <Crosshair size={16} />
                <span>Käytä omaa sijaintia</span>
              </button>

              <button
                type="button"
                className="app-btn app-btn--secondary"
                onClick={() => {
                  setLocationError('');
                  setLocationSource('map');
                  onStartPickFromMap?.();
                }}
              >
                <MapPin size={16} />
                <span>Valitse kartalta</span>
              </button>

              <button
                type="button"
                className="app-btn app-btn--ghost"
                onClick={() => {
                  clearLocation();
                  onStopPickFromMap?.();
                  onClearPickedLocation?.();
                }}
              >
                <Trash2 size={16} />
                <span>Tyhjennä sijainti</span>
              </button>
            </div>

            <div className="sighting-location-meta">
              {latitude && longitude ? (
                <>
                  <strong>{latitude}</strong>
                  <strong>{longitude}</strong>
                  <span>
                    {locationSource === 'gps'
                      ? 'Oma sijainti'
                      : 'Valittu kartalta'}
                  </span>
                </>
              ) : (
                <span>Valitse sijainti käyttämällä omaa sijaintia tai karttaa.</span>
              )}
            </div>
          </div>
        </div>

        <div className="sighting-actions">
          <button
            type="submit"
            className="app-btn app-btn--primary"
            disabled={loading}
          >
            <Send size={18} />
            <span>{loading ? 'Tallennetaan...' : 'Lähetä havaintoilmoitus'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
