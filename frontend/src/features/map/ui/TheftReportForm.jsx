// TheftReportForm.jsx
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { Send } from 'lucide-react';
import { createTheftReport } from '../theftReportsApi';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Info } from 'lucide-react';

/**
 * TheftReportForm
 * ---------------
 * Varkausilmoituslomake, jossa sijainti valitaan joko:
 *  - Omasta sijainnista (GPS, navigator.geolocation)
 *  - Kartalta (parent antaa defaultLocation-propin, esim. karttaklikin jälkeen)
 *
 * Props:
 * - defaultLocation?: { latitude: number, longitude: number }
 *   -> Kartalta valittu sijainti (tai muu oletus). Kun tämä muuttuu, lomake päivittyy.
 *
 * - onCreated?: (createdReport) => void
 *   -> Callback onnistuneen tallennuksen jälkeen.
 */
export default function TheftReportForm({
  defaultLocation,
  onCreated,
  onStartPickFromMap,
  onStopPickFromMap
}) {
  // BTT-92 kellonaika valmiiksi
  function getCurrentDateTimeLocal() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  // BTT-92 päättyy

  // -------------------------
  // 1) Lomakkeen kenttien tilat (state)
  // -------------------------

  // Varkausilmoituksen perustiedot
  const [description, setDescription] = useState('');
  const [theftTime, setTheftTime] = useState(getCurrentDateTimeLocal());
  const [theftAddress, setTheftAddress] = useState('');

  /**
   * Koordinaatit pidetään stringinä, koska ne sidotaan input-tyyppisiin kenttiin/teksteihin.
   * Payloadissa ne muutetaan Numberiksi.
   */
  const [latitude, setLatitude] = useState(defaultLocation?.latitude ?? '');
  const [longitude, setLongitude] = useState(defaultLocation?.longitude ?? '');

  // Mistä sijainti on tullut: "gps" | "map" | ""
  const [locationSource, setLocationSource] = useState(
    defaultLocation ? 'map' : ''
  );

  // Sijaintiin liittyvät virheet (esim. selain estää geolocationin)
  const [locationError, setLocationError] = useState('');

  // Pyörän tiedot
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [bikeDescription, setBikeDescription] = useState('');

  // UI-tilat
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // -------------------------
  // 2) Apufunktiot
  // -------------------------

  /**
   * Aseta koordinaatit aina yhden apufunktion kautta.
   * Tämä pitää lat/lon + source synkassa.
   */
  function setLocation(lat, lon, source) {
    setLatitude(String(lat));
    setLongitude(String(lon));
    setLocationSource(source);
  }

  /**
   * Muuntaa datetime-local -> ISO string (UTC).
   */
  function toIsoFromDatetimeLocal(dtLocal) {
    return dtLocal ? new Date(dtLocal).toISOString() : null;
  }

  /**
   * Hae käyttäjän nykyinen sijainti selaimen geolocation API:lla.
   */
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

  /**
   * Tyhjennä valittu sijainti (esim. jos käyttäjä haluaa valita uuden).
   */
  function clearLocation() {
    setLatitude('');
    setLongitude('');
    setLocationSource('');
    setLocationError('');
  }

  // -------------------------
  // 3) Kartalta tulevan defaultLocationin synkronointi
  // -------------------------
  /**
   * TÄRKEÄ:
   * Jos käyttäjä klikkaa karttaa parentissa ja parent päivittää defaultLocation-propin,
   * tämä useEffect päivittää lat/lon tänne lomakkeeseen.
   */
  useEffect(() => {
    if (defaultLocation?.latitude && defaultLocation?.longitude) {
      setLocation(defaultLocation.latitude, defaultLocation.longitude, 'map');
      setLocationError('');
    }
  }, [defaultLocation]);

  // -------------------------
  // 4) Lomakkeen lähetys
  // -------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Pakolliset peruskentät
    if (!description.trim()) {
      setError('Kuvaus on pakollinen.');
      return;
    }
    if (!theftTime) {
      setError('Varkauden aika on pakollinen.');
      return;
    }

    // Sijaintivalidointi (jos backend vaatii locationin)
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

    // Valinnainen: rajavalidointi (helpottaa virheitä)
    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      setError(
        'Sijainti ei ole kelvollinen (latitude/longitude rajojen ulkopuolella).'
      );
      return;
    }

    // Swagger/DTO:n mukainen payload
    const payload = {
      description: description.trim(),
      theftTime: toIsoFromDatetimeLocal(theftTime),
      theftAddress: theftAddress.trim() || null,
      location: {
        latitude: latNum,
        longitude: lonNum
      },
      bike: {
        brand,
        model,
        type,
        color,
        serialNumber,
        description: bikeDescription
      }
    };

    try {
      setLoading(true);
      await createTheftReport(payload);

      // Päivitä sivu, jotta uusi ilmoitus näkyy kartalla
      window.location.reload();

      // Halutessasi voit tyhjentää lomakkeen tässä (en tee automaattisesti, mutta helppo lisätä)
      // clearLocation();
      // setDescription(""); setTheftTime(""); ...
    } catch (err) {
      setError(err.message || 'Tallennus epäonnistui.');
    } finally {
      setLoading(false);
    }
  }

  //Btt92 tooltip
  function renderTooltip(id, text) {
    return (
      <Tooltip id={id} style={{ zIndex: 9999 }}>
        {text}
      </Tooltip>
    );
  }

  // -------------------------
  // 5) UI
  // -------------------------
  return (
    <Card className="shadow-sm" style={{ maxWidth: 900 }}>
      <Card.Body>
        <Card.Title>Varkausilmoitus</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Kuvaus */}
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center gap-1">
              Kuvaus
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="right"
                container={document.body}
                overlay={renderTooltip(
                  'tooltip-description',
                  'Kuvaile mahdollisimman tarkasti, mitä tapahtui ja miten varkaus havaittiin.'
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
              placeholder="Simon pyörä varastettiin kaupan edestä lukittuna noin klo 14-14.30"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center gap-1">
              Tapahtuma-aika
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="right"
                container={document.body}
                overlay={renderTooltip(
                  'tooltip-theft-time',
                  'Syötä aika jolloin varkaus tapahtui.'
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
              type="datetime-local"
              value={theftTime}
              onChange={(e) => setTheftTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center gap-1">
              Osoite
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="right"
                container={document.body}
                overlay={renderTooltip(
                  'tooltip-address',
                  'Anna lähin osoite jossa varkaus tapahtui.'
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
              placeholder="Kauppakatu 29"
              value={theftAddress}
              onChange={(e) => setTheftAddress(e.target.value)}
            />
          </Form.Group>

          <hr />

          {/* Sijainti */}
          <h6 className="d-flex align-items-center gap-1">
            Sijainti
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="right"
              container={document.body}
              overlay={renderTooltip(
                'tooltip-location',
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

            {/* 
              Tämä nappi ei “valitse kartalta” itsessään,
              vaan ohjaa käyttäjää valitsemaan kartasta.
              Parentin pitäisi laittaa kartta valintatilaan ja
              päivittää defaultLocation, kun karttaa klikataan.
            */}
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setLocationError('');
                setLocationSource('map');
                onStartPickFromMap?.(); // <-- TÄMÄ käynnistää kartan valintatilaan
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

          <hr />

          {/* Bike */}
          <h6 className="d-flex align-items-center gap-1">
            Pyörän tiedot
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="right"
              container={document.body}
              overlay={renderTooltip(
                'tooltip-bike-section',
                'Täytä pyörän tiedot mahdollisimman tarkasti.'
              )}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
                tabIndex={0}
              >
                <Info size={16} color="#6c757d" />
              </span>
            </OverlayTrigger>
          </h6>

          <Form.Group className="mb-3">
            <Form.Label>Merkki</Form.Label>
            <Form.Control
              placeholder="Helkama"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Malli</Form.Label>
            <Form.Control
              placeholder="Trail 7"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tyyppi</Form.Label>
            <Form.Control
              placeholder="Maastopyörä"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Väri</Form.Label>
            <Form.Control
              placeholder="Sininen"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sarjanumero</Form.Label>
            <Form.Control
              placeholder="123456789"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center gap-1">
              Lisäkuvaus pyörästä
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="right"
                container={document.body}
                overlay={renderTooltip(
                  'tooltip-bike-description',
                  'Kerro pyörän tuntomerkit, lisävarusteet, tarrat, korit, vauriot tai muut tunnistamista helpottavat tiedot.'
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
              placeholder="Ruosteinen mutta hyvässä kunnossa. Etukori,tarakka ja harmaat renkaat."
              as="textarea"
              rows={2}
              value={bikeDescription}
              onChange={(e) => setBikeDescription(e.target.value)}
            />
          </Form.Group>

          <hr />

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
