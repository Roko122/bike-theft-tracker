import { Form } from 'react-bootstrap';
import InfoLabel from './InfoLabel.jsx';
import { BIKE_FIELDS, FORM_TOOLTIPS } from './formOptions.js';

export default function BikeDetailsSection({ values, onChange }) {
  return (
    <>
      <hr />

      <h6>
        <InfoLabel
          label="Pyörän tiedot"
          tooltipId="tooltip-bike-section"
          tooltipText={FORM_TOOLTIPS.bike}
        />
      </h6>

      {BIKE_FIELDS.map((field) => (
        <Form.Group key={field.name} className="mb-3">
          <Form.Label>{field.label}</Form.Label>
          <Form.Control
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
        </Form.Group>
      ))}

      <Form.Group className="mb-3">
        <Form.Label>
          <InfoLabel
            label="Lisäkuvaus pyörästä"
            tooltipId="tooltip-bike-description"
            tooltipText={FORM_TOOLTIPS.bikeDescription}
          />
        </Form.Label>
        <Form.Control
          placeholder="Ruosteinen mutta hyvässä kunnossa. Etukori, tarakka ja harmaat renkaat."
          as="textarea"
          rows={2}
          value={values.bikeDescription}
          onChange={(event) => onChange('bikeDescription', event.target.value)}
        />
      </Form.Group>
    </>
  );
}
