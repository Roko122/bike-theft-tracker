import { Crosshair, MapPin, Trash2 } from 'lucide-react';
import { useI18n } from '../../../app/i18n/LanguageContext.jsx';
import InfoLabel from './InfoLabel.jsx';
import { getFormTooltips } from './formOptions.js';

export default function LocationSection({
  latitude,
  longitude,
  locationSource,
  locationError,
  onUseMyLocation,
  onStartPickFromMap,
  onClearLocation
}) {
  const { t } = useI18n();
  const formTooltips = getFormTooltips(t);

  return (
    <div className="report-section">
      <div className="report-section__title">
        <InfoLabel
          label={t('theftForm.location')}
          tooltipId="tooltip-location"
          tooltipText={formTooltips.location}
          required
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
          <span>{t('theftForm.useMyLocation')}</span>
        </button>

        <button
          type="button"
          className="app-btn app-btn--secondary"
          onClick={onStartPickFromMap}
        >
          <MapPin size={16} />
          <span>{t('theftForm.pickFromMap')}</span>
        </button>

        <button
          type="button"
          className="app-btn app-btn--ghost"
          onClick={onClearLocation}
        >
          <Trash2 size={16} />
          <span>{t('theftForm.clearLocation')}</span>
        </button>
      </div>

      <div className="report-location-meta">
        {latitude && longitude ? (
          <>
            <strong>{latitude}</strong>
            <strong>{longitude}</strong>
            <span>
              {locationSource === 'gps'
                ? t('theftForm.myLocation')
                : t('theftForm.selectedOnMap')}
            </span>
          </>
        ) : (
          <span>{t('theftForm.selectLocationHint')}</span>
        )}
      </div>
    </div>
  );
}
