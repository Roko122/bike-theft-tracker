import { Camera, FilePlus2, Send } from 'lucide-react';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import { useTheftReportForm } from './theftReportForm/useTheftReportForm.js';
import InfoLabel from './theftReportForm/InfoLabel.jsx';
import DateTimeField from './theftReportForm/DateTimeField.jsx';
import LocationSection from './theftReportForm/LocationSection.jsx';
import BikeDetailsSection from './theftReportForm/BikeDetailsSection.jsx';
import { getFormTooltips } from './theftReportForm/formOptions.js';

export default function TheftReportForm({
  defaultLocation,
  onCreated,
  onStartPickFromMap,
  onStopPickFromMap,
  onClearPickedLocation
}) {
  const { language, t } = useI18n();
  const formTooltips = getFormTooltips(t);
  const {
    formValues,
    locationError,
    loading,
    error,
    updateField,
    useMyLocation,
    clearLocation,
    submit
  } = useTheftReportForm({
    defaultLocation,
    onCreated,
    language
  });

  return (
    <section className="report-card">
      <div className="report-card__hero">
        <div className="report-card__icon">
          <FilePlus2 size={20} />
        </div>
        <div className="report-card__hero-copy">
          <p className="report-card__eyebrow">{t('theftForm.eyebrow')}</p>
          <h2 className="report-card__title">{t('theftForm.title')}</h2>
          <p className="report-card__subtitle">{t('theftForm.subtitle')}</p>
        </div>
      </div>

      {error && <div className="report-alert report-alert--danger">{error}</div>}

      <form className="report-form" onSubmit={submit}>
        <div className="report-section">
          <label className="report-field">
            <span className="report-field__label">
              <InfoLabel
                label={t('theftForm.description')}
                tooltipId="tooltip-description"
                tooltipText={formTooltips.description}
              />
            </span>
            <textarea
              className="report-textarea"
              rows={5}
              placeholder={t('theftForm.descriptionPlaceholder')}
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
                label={t('theftForm.theftAddress')}
                tooltipId="tooltip-address"
                tooltipText={formTooltips.theftAddress}
              />
            </span>
            <input
              className="report-input"
              placeholder={t('theftForm.theftAddressPlaceholder')}
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
              <span>{t('theftForm.images')}</span>
            </span>
          </div>

          <label className="report-file">
            <div className="report-file__header">
              <Camera size={16} />
              <span>{t('theftForm.addImages')}</span>
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={(event) =>
                updateField('images', Array.from(event.target.files ?? []))
              }
            />
            <span className="report-file__hint">{t('theftForm.imagesHint')}</span>
          </label>
        </div>

        <div className="report-actions">
          <button
            type="submit"
            className="app-btn app-btn--primary"
            disabled={loading}
          >
            <Send size={18} />
            <span>{loading ? t('theftForm.submitting') : t('theftForm.submit')}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
