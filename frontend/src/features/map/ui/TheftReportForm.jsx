import { Camera, FilePlus2, Send } from 'lucide-react';
import { useTheftReportForm } from './theftReportForm/useTheftReportForm.js';
import InfoLabel from './theftReportForm/InfoLabel.jsx';
import DateTimeField from './theftReportForm/DateTimeField.jsx';
import LocationSection from './theftReportForm/LocationSection.jsx';
import BikeDetailsSection from './theftReportForm/BikeDetailsSection.jsx';
import { FORM_TOOLTIPS } from './theftReportForm/formOptions.js';

export default function TheftReportForm({
  defaultLocation,
  onCreated,
  onStartPickFromMap,
  onStopPickFromMap,
  onClearPickedLocation
}) {
  const {
    formValues,
    locationError,
    loading,
    error,
    updateField,
    useMyLocation,
    clearLocation,
    submit
  } = useTheftReportForm({ defaultLocation, onCreated });

  return (
    <section className="report-card">
      <div className="report-card__hero">
        <div className="report-card__icon">
          <FilePlus2 size={20} />
        </div>
        <div className="report-card__hero-copy">
          <p className="report-card__eyebrow">Uusi ilmoitus</p>
          <h2 className="report-card__title">Varkausilmoitus</h2>
          <p className="report-card__subtitle">
            Lisää pyörän tiedot, tapahtuma-aika ja sijainti mahdollisimman tarkasti.
          </p>
        </div>
      </div>

      {error && <div className="report-alert report-alert--danger">{error}</div>}

      <form className="report-form" onSubmit={submit}>
        <div className="report-section">
          <label className="report-field">
            <span className="report-field__label">
              <InfoLabel
                label="Kuvaus"
                tooltipId="tooltip-description"
                tooltipText={FORM_TOOLTIPS.description}
              />
            </span>
            <textarea
              className="report-textarea"
              rows={5}
              placeholder="Pyörä varastettiin kaupan edestä lukittuna noin klo 14.00-14.30."
              value={formValues.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </label>

          <DateTimeField
            value={formValues.theftTime}
            onChange={(value) => updateField('theftTime', value)}
          />

          <label className="report-field">
            <span className="report-field__label">
              <InfoLabel
                label="Osoite"
                tooltipId="tooltip-address"
                tooltipText={FORM_TOOLTIPS.theftAddress}
              />
            </span>
            <input
              className="report-input"
              placeholder="Kauppakatu 29"
              value={formValues.theftAddress}
              onChange={(event) => updateField('theftAddress', event.target.value)}
            />
          </label>
        </div>

        <LocationSection
          latitude={formValues.latitude}
          longitude={formValues.longitude}
          locationSource={formValues.locationSource}
          locationError={locationError}
          onUseMyLocation={useMyLocation}
          onStartPickFromMap={() => {
            updateField('locationSource', 'map');
            onStartPickFromMap?.();
          }}
          onClearLocation={() => {
            clearLocation();
            onStopPickFromMap?.();
            onClearPickedLocation?.();
          }}
        />

        <BikeDetailsSection values={formValues} onChange={updateField} />

        <div className="report-section">
          <div className="report-section__title">
            <span className="info-label">
              <span>Kuvat</span>
            </span>
          </div>

          <label className="report-file">
            <div className="report-file__header">
              <Camera size={16} />
              <span>Lisää kuvia pyörästä</span>
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={(event) =>
                updateField('images', Array.from(event.target.files ?? []))
              }
            />
            <span className="report-file__hint">
              PNG, JPG tai JPEG. Voit lisätä enintään 5 kuvaa.
            </span>
          </label>
        </div>

        <div className="report-actions">
          <button
            type="submit"
            className="app-btn app-btn--primary"
            disabled={loading}
          >
            <Send size={18} />
            <span>{loading ? 'Lähetetään...' : 'Lähetä ilmoitus'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
