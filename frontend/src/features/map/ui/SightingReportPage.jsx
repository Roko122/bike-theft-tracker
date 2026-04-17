import { useEffect, useState } from 'react';
import {
  Binoculars,
  Camera,
  Crosshair,
  MapPin,
  Send,
  Trash2
} from 'lucide-react';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import { createSightingForReport } from '../../api/theftReportApi.js';
import LocationMarkerHint from './LocationMarkerHint.jsx';

function Message({ tone, children }) {
  return <div className={`sighting-alert sighting-alert--${tone}`}>{children}</div>;
}

export default function SightingReportPage({
  report,
  reportId,
  defaultLocation,
  onStartPickFromMap,
  onStopPickFromMap,
  onClearPickedLocation,
  onCreated
}) {
  const { t } = useI18n();
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
  const [loading, setLoading] = useState(false);

  function setLocation(lat, lon, source) {
    setLatitude(String(lat));
    setLongitude(String(lon));
    setLocationSource(source);
  }

  function useMyLocation() {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError(t('sighting.errors.geolocationUnsupported'));
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
          positionError.message || t('sighting.errors.geolocationFailed')
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

    if (!effectiveReportId) {
      setError(t('sighting.errors.missingReportId'));
      return;
    }

    if (!description.trim()) {
      setError(t('sighting.errors.descriptionRequired'));
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
      setError(t('sighting.errors.locationMissing'));
      return;
    }

    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      setError(t('sighting.errors.invalidLocation'));
      return;
    }

    if (image && image.size > 5 * 1024 * 1024) {
      setError(t('sighting.errors.imageTooLarge'));
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
      onCreated?.();
    } catch (submitError) {
      setError(submitError?.message || t('sighting.errors.saveFailed'));
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
          <p className="sighting-card__eyebrow">{t('sighting.eyebrow')}</p>
          <h2 className="sighting-card__title">{t('sighting.title')}</h2>
          <p className="sighting-card__subtitle">{t('sighting.subtitle')}</p>
        </div>
      </div>

      {error && <Message tone="danger">{error}</Message>}
      {locationError && <Message tone="warning">{locationError}</Message>}

      <div className="report-form__hint" role="note">
        <span>{t('sighting.requiredLegend')}</span>
      </div>

      <form className="sighting-form" onSubmit={handleSubmit}>
        <label className="sighting-field">
          <span className="sighting-field__label">
            {t('sighting.whatDidYouSee')}
            <span className="required-indicator" aria-hidden="true">
              {' '}
              *
            </span>
          </span>
          <textarea
            className="sighting-textarea"
            rows={5}
            placeholder={t('sighting.descriptionPlaceholder')}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <div className="sighting-grid">
          <div className="sighting-section">
            <div className="sighting-section__header">
              <MapPin size={16} />
              <span>
                {t('sighting.location')}
                <span className="required-indicator" aria-hidden="true">
                  {' '}
                  *
                </span>
              </span>
            </div>

            <div className="sighting-location-actions">
              <button
                type="button"
                className="app-btn app-btn--secondary"
                onClick={useMyLocation}
              >
                <Crosshair size={16} />
                <span>{t('sighting.useMyLocation')}</span>
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
                <span>{t('sighting.pickFromMap')}</span>
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
                <span>{t('sighting.clearLocation')}</span>
              </button>
            </div>

            <div className="sighting-location-meta">
              {latitude && longitude ? (
                <LocationMarkerHint
                  text={t('sighting.selectedLocationMapHint')}
                  markerAriaLabel={t('sighting.selectedLocationMarkerAria')}
                />
              ) : (
                <span>{t('sighting.selectLocationHint')}</span>
              )}
            </div>
          </div>

          <div className="sighting-section">
            <div className="sighting-section__header">
              <Camera size={16} />
              <span>{t('sighting.image')}</span>
            </div>
            <label className="sighting-file">
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              />
              <span className="sighting-file__title">
                {image ? image.name : t('sighting.chooseImage')}
              </span>
              <span className="sighting-file__hint">{t('sighting.imageHint')}</span>
            </label>
          </div>
        </div>

        <div className="sighting-actions">
          <button
            type="submit"
            className="app-btn app-btn--primary"
            disabled={loading}
          >
            <Send size={18} />
            <span>{loading ? t('sighting.submitting') : t('sighting.submit')}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
