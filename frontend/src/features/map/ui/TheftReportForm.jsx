import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { Send } from 'lucide-react';
import { useTheftReportForm } from './theftReportForm/useTheftReportForm.js';
import InfoLabel from './theftReportForm/InfoLabel.jsx';
import LocationSection from './theftReportForm/LocationSection.jsx';
import BikeDetailsSection from './theftReportForm/BikeDetailsSection.jsx';
import { FORM_TOOLTIPS } from './theftReportForm/formOptions.js';

export default function TheftReportForm({
  defaultLocation,
  onCreated,
  onStartPickFromMap,
  onStopPickFromMap
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
    <Card className="shadow-sm" style={{ maxWidth: 900 }}>
      <Card.Body>
        <Card.Title>Varkausilmoitus</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <InfoLabel
                label="Kuvaus"
                tooltipId="tooltip-description"
                tooltipText={FORM_TOOLTIPS.description}
              />
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Simon pyörä varastettiin kaupan edestä lukittuna noin klo 14-14.30"
              value={formValues.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <InfoLabel
                label="Tapahtuma-aika"
                tooltipId="tooltip-theft-time"
                tooltipText={FORM_TOOLTIPS.theftTime}
              />
            </Form.Label>
            <Form.Control
              type="datetime-local"
              value={formValues.theftTime}
              onChange={(event) => updateField('theftTime', event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <InfoLabel
                label="Osoite"
                tooltipId="tooltip-address"
                tooltipText={FORM_TOOLTIPS.theftAddress}
              />
            </Form.Label>
            <Form.Control
              placeholder="Kauppakatu 29"
              value={formValues.theftAddress}
              onChange={(event) => updateField('theftAddress', event.target.value)}
            />
          </Form.Group>

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
            }}
          />

          <BikeDetailsSection values={formValues} onChange={updateField} />

          <hr />

          <Form.Group className="mb-3">
            <Form.Label>Kuvat</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={(event) =>
                updateField('images', Array.from(event.target.files ?? []))
              }
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : <Send size={18} />}
            Lähetä ilmoitus
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
