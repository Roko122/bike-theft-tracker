import InfoLabel from './InfoLabel.jsx';
import { BIKE_FIELDS, FORM_TOOLTIPS } from './formOptions.js';

export default function BikeDetailsSection({ values, onChange }) {
  return (
    <div className="report-section">
      <div className="report-section__title">
        <InfoLabel
          label="Pyörän tiedot"
          tooltipId="tooltip-bike-section"
          tooltipText={FORM_TOOLTIPS.bike}
        />
      </div>

      <div className="report-grid">
        {BIKE_FIELDS.map((field) => (
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
            label="Lisäkuvaus pyörästä"
            tooltipId="tooltip-bike-description"
            tooltipText={FORM_TOOLTIPS.bikeDescription}
          />
        </span>
        <textarea
          className="report-textarea report-textarea--compact"
          rows={3}
          placeholder="Ruosteinen mutta hyvässä kunnossa. Etukori, tarakka ja harmaat renkaat."
          value={values.bikeDescription}
          onChange={(event) => onChange('bikeDescription', event.target.value)}
        />
      </label>
    </div>
  );
}
