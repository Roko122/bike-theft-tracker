import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from 'react-leaflet';
import { useCallback, useEffect, useRef, useState } from 'react';

import L from 'leaflet';
import MapControls from './ui/MapControls';
import { fetchTheftReportMapItemsByBounds } from '../theftReports/api';

// Leaflet marker icon fix (bundlereissa ikonipolut usein hajoaa)
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker1x from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: markerShadow
});

function formatDate(iso) {
  if (!iso) return '-';

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);

  // +2 tuntia millisekunteina
  const adjusted = new Date(d.getTime() + 2 * 60 * 60 * 1000);

  return adjusted.toLocaleString();
}

//BTT 95 uusi funktio
function getBoundsParams(map) {
  const bounds = map.getBounds();

  return {
    minLon: bounds.getWest(),
    minLat: bounds.getSouth(),
    maxLon: bounds.getEast(),
    maxLat: bounds.getNorth()
  };
}

const FIELD_LABELS_FI = {
  id: 'id',
  brand: 'Merkki',
  model: 'Malli',
  type: 'Tyyppi',
  color: 'Väri',
  status: 'Tila',
  theftTime: 'Tapahtuma aika',
  description: 'Lisäkuvaus'
};

function labelFi(key) {
  return FIELD_LABELS_FI[key] ?? key; // jos ei löydy käännöstä, näytetään alkuperäinen
}

// uusi funktio btt43
function renderValue(v) {
  if (v == null) return '-';
  return typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
}
//päättyy

function MapRefBinder({ mapRef }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
    console.log('mapRef asetettu:', map);
  }, [map, mapRef]);

  return null;
}

// tähän koodia BTT28(ehkä jo vähän btt 79)
/**
 * Kuuntelee kartan klikkauksia ja ilmoittaa parentille valitun sijainnin.
 * Tämä ei renderöi mitään (return null).
 */
function MapClickPicker({ enabled, onPick }) {
  useMapEvents({
    click(e) {
      if (!enabled) return;

      const loc = { latitude: e.latlng.lat, longitude: e.latlng.lng };
      onPick?.(loc);
    }
  });

  return null;
}

// BTT 28/79 koodi päättyy tähän

//BTT 95 funktio
function VisibleTheftsLoader({ onLoad }) {
  const map = useMapEvents({
    moveend() {
      onLoad?.(map);
    }
  });

  useEffect(() => {
    onLoad?.(map);
  }, [map, onLoad]);

  return null;
}

export default function MapPage({
  isMenuOpen,
  onLocationSelected,
  isPickingLocation,
  onReportSelected, //  BTT-26: ilmoitetaan parentille valittu ilmoitus
  selectedLocation
}) {
  // react-leaflet v4: käytetään refiä (ei whenCreated)
  // react-leaflet v4: käytetään refiä (ei whenCreated)
  const mapRef = useRef(null);

  // BTT-27: data + tila
  const [thefts, setThefts] = useState([]);
  const [showThefts, setShowThefts] = useState(true);
  const [loadingThefts, setLoadingThefts] = useState(true);
  const [theftsError, setTheftsError] = useState(null);

  const center = [62.601, 29.7636]; // Joensuu
  const initialZoom = 11;
<<<<<<< HEAD
  //BTT 95
  const loadVisibleThefts = useCallback(async (map) => {
    if (!map) return;

    try {
      setLoadingThefts(true);
      setTheftsError(null);

      const boundsParams = getBoundsParams(map);
      const data = await fetchTheftReportMapItemsByBounds(boundsParams);

      const valid = (data ?? []).filter(
        (r) => r?.location?.latitude != null && r?.location?.longitude != null
      );

      setThefts(valid);

      console.log('BTT-95 näkyvän alueen ilmoitukset:', valid);
    } catch (e) {
      setTheftsError(e?.message ?? 'Ilmoitusten haku epäonnistui');
    } finally {
      setLoadingThefts(false);
    }
=======

  // BTT-27: hae data backendistä kerran sivun latauksessa
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingThefts(true);
        setTheftsError(null);

        const data = await getTheftReports();
        //if (alive) setThefts(data);
        // uutta btt43

        const valid = (data ?? []).filter(
          (r) => r?.location?.latitude != null && r?.location?.longitude != null
        );

        if (alive) setThefts(valid);

        //päättyy43

        console.log('BTT-27 theft reports:', data);
      } catch (e) {
        if (alive) setTheftsError(e?.message ?? 'Ilmoitusten haku epäonnistui');
      } finally {
        if (alive) setLoadingThefts(false);
      }
    })();

    return () => {
      alive = false;
    };
>>>>>>> ad66f83 ( map page sekosi viime commitin jälkeen tehty siihen melko rajua oikaisua tähän taskiin liittyviin funktioihin, koita kestää, lisätty tarvittavia ominaisuuksia app ja theftreport tiedostoihin että saadaan hallittua pistettä myös lisää omaan sijaintiin napeilla ja tyhjennä sijainti napeilla)
  }, []);

  // BTT-77: keskitä käyttäjän sijaintiin
  const onCenterToUser = useCallback(() => {
    const map = mapRef.current;
    console.log('CENTER CLICKED');

    if (!map) {
      console.warn('Kartta ei ole vielä valmis.');
      return;
    }

    if (!('geolocation' in navigator)) {
      console.warn('Selaimessa ei ole geolocation-tukea.');
      return;
    }

    console.log('Pyydetään sijaintia.');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log('SAIN SIJAINNIN:', latitude, longitude);

        map.flyTo([latitude, longitude], 15, { animate: true, duration: 1.2 });
      },
      (err) => {
        console.warn('Sijainnin haku epäonnistui:', err.code, err.message);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
    );
  }, []);

  return (
    <div className="map-wrap">
      <MapContainer center={center} zoom={initialZoom} scrollWheelZoom>
        <MapRefBinder mapRef={mapRef} />
        <VisibleTheftsLoader onLoad={loadVisibleThefts} />

        {/* UUSI: karttaklikki -> onLocationSelected */}
        <MapClickPicker
          enabled={isPickingLocation}
          onPick={(loc) => {
            onLocationSelected?.(loc);
          }}
        />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedLocation && (
          <CircleMarker
            center={[selectedLocation.latitude, selectedLocation.longitude]}
            radius={8}
            pathOptions={{
              color: 'red',
              fillColor: 'red',
              fillOpacity: 1
            }}
          />
        )}

        {showThefts &&
          !isPickingLocation &&
          thefts.map((t) => (
            <Marker
              key={t.id}
              position={[t.location.latitude, t.location.longitude]} // [lat, lng]
            >
              <Popup>
                <div style={{ minWidth: 260, maxWidth: 320 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>
                    {t.brand ?? ''} {t.model ?? ''}
                  </div>

                  {/* Näyttää kaikki avain-arvo parit */}
                  <div style={{ display: 'grid', gap: 4 }}>
                    {/* tähän alle kirjaa jos haluaa rajoittaa näkyvyttä popupissa */}
                    {Object.entries(t)
                      .filter(([key]) => key !== 'location') // piilotetaan koordinaatit
                      .map(([key, value]) => (
                        <div
                          key={key}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '90px 1fr',
                            gap: 8
                          }}
                        >
                          <div style={{ opacity: 0.7, fontSize: 12 }}>
                            {labelFi(key)}
                          </div>

                          {/* location näytetään nätisti, muut perusmuodossa */}
                          <div style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>
                            {key === 'theftTime'
                              ? formatDate(value)
                              : renderValue(value)}
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* Alapainike */}
                  <div style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => {
                        onReportSelected?.(t.id);
                      }}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        fontWeight: 600,
                        cursor: 'default'
                      }}
                    >
                      Näytä tiedot
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {isPickingLocation && (
        <div className="map-pick-hint">
          Klikkaa karttaa valitaksesi sijainti
        </div>
      )}

      {!isMenuOpen && <MapControls onCenterToUser={onCenterToUser} />}
    </div>
  );
}
