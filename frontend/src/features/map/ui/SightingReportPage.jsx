import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { Info } from 'lucide-react';
import { createSightingForReport } from '../../api/theftReportApi.js';

export default function SightingReportPage({
  report,
  reportId,
  defaultLocation,
  onStartPickFromMap,
  onStopPickFromMap
}) {
  const effectiveReportId = report?.id ?? reportId;
  const [description, setDescription] = useState('');
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
      setLocationError('Selaimesi ei tue sijainnin hakua (geolocation).');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude, 'gps');
      },
      (err) => {
        setLocationError(
          err.message || 'Sijainnin haku epäonnistui. Tarkista selaimen luvat.'
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

  function renderTooltip(id, text) {
    return (
      <Tooltip id={id} style={{ zIndex: 9999 }}>
        {text}
      </Tooltip>
    );
  }

  useEffect(() => {
    if (defaultLocation?.latitude && defaultLocation?.longitude) {
      setLocation(defaultLocation.latitude, defaultLocation.longitude, 'map');
      setLocationError('');
    }
  }, [defaultLocation]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!effectiveReportId) {
      setError('Valitun ilmoituksen tunniste puuttuu. Avaa havainto ilmoituksen kautta.');
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
      setError(
        'Sijainti ei ole kelvollinen (latitude/longitude rajojen ulkopuolella).'
      );
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
      await createSightingForReport(effectiveReportId, payload);
      setSuccessMsg('Havaintoilmoitus tallennettu.');
    } catch (err) {
      setError(err?.message || 'Havaintoilmoituksen tallennus epäonnistui.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-sm" style={{ maxWidth: 900 }}>
      <Card.Body>
        <Card.Title>Havaintoilmoitus</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center gap-1">
              Kuvaus
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="right"
                container={document.body}
                overlay={renderTooltip(
                  'tooltip-sighting-description',
                  'Kuvaile mahdollisimman tarkasti, mitä havaitsit.'
                )}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  tabIndex={0}
                >
                  <Info size={16} color="#6c757d" />
                </span>
              </OverlayTrigger>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Kuvaile havainto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {effectiveReportId && (
            <div className="small text-muted mb-3">
              Liittyy varkausilmoitukseen: <strong>{effectiveReportId}</strong>
            </div>
          )}

          <h6 className="d-flex align-items-center gap-1">
            Sijainti
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="right"
              container={document.body}
              overlay={renderTooltip(
                'tooltip-sighting-location',
                'Valitse sijainti käyttämällä omaa sijaintiasi tai valitsemalla paikka kartalta.'
              )}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                tabIndex={0}
              >
                <Info size={16} color="#6c757d" />
              </span>
            </OverlayTrigger>
          </h6>

          {locationError && <Alert variant="warning">{locationError}</Alert>}

          <div className="d-flex gap-2 flex-wrap mb-2">
            <Button
              type="button"
              variant="outline-primary"
              onClick={useMyLocation}
            >
              Käytä omaa sijaintia
            </Button>

            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setLocationError('');
                setLocationSource('map');
                onStartPickFromMap?.();
              }}
            >
              Valitse kartalta
            </Button>

            <Button
              type="button"
              variant="outline-danger"
              onClick={() => {
                clearLocation();
                onStopPickFromMap?.();
              }}
            >
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

          <Button type="submit" disabled={loading}>
            {loading ? 'Tallennetaan...' : 'Lähetä havaintoilmoitus'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
