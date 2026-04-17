import { useI18n } from '../../../app/i18n/LanguageContext.jsx';
import InfoLabel from './InfoLabel.jsx';
import { getBikeFields, getFormTooltips } from './formOptions.js';

export default function BikeDetailsSection({ values, onChange }) {
  const { t } = useI18n();
  const bikeFields = getBikeFields(t);
  const formTooltips = getFormTooltips(t);

  return (
    <div className="report-section">
      <div className="report-section__title">
        <InfoLabel
          label={t('theftForm.bikeSection')}
          tooltipId="tooltip-bike-section"
          tooltipText={formTooltips.bike}
        />
      </div>

      <div className="report-grid">
        {bikeFields.map((field) => (
          <label key={field.name} className="report-field">
            <span className="report-field__label">{field.label}</span>
            <input
              className="report-input"
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(event) => onChange(field.name, event.target.value)}
            />
          </label>
        ))}
      </div>

      <label className="report-field">
        <span className="report-field__label">
          <InfoLabel
            label={t('theftForm.bikeDescription')}
            tooltipId="tooltip-bike-description"
            tooltipText={formTooltips.bikeDescription}
          />
        </span>
        <textarea
          className="report-textarea report-textarea--compact"
          rows={3}
          placeholder={t('theftForm.bikeDescriptionPlaceholder')}
          value={values.bikeDescription}
          onChange={(event) => onChange('bikeDescription', event.target.value)}
        />
      </label>
    </div>
  );
}
