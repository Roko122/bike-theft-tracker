import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useCallback, useEffect, useRef, useState } from "react";

import L from "leaflet";
import { mockThefts } from "./mockThefts.js";
import MapControls from "./ui/MapControls";
import { getTheftReports } from "../theftReports/api";

// Leaflet marker icon fix (bundlereissa ikonipolut usein hajoaa)
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: markerShadow,
});

function formatDate(iso) {
  return iso;
}

function MapRefBinder({ mapRef }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
    console.log("mapRef asetettu:", map);
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
      console.log("Kartalta valittu sijainti:", loc);
      onPick?.(loc);
    },
  });

  return null;
}
// BTT 28/79 koodi päättyy tähän


export default function MapPage({isMenuOpen, onLocationSelected, isPickingLocation}) {
  // react-leaflet v4: käytetään refiä (ei whenCreated)
    // react-leaflet v4: käytetään refiä (ei whenCreated)
  const mapRef = useRef(null);

  // BTT-27: data + tila
  const [thefts, setThefts] = useState([]);
  const [showThefts, setShowThefts] = useState(true);
  const [loadingThefts, setLoadingThefts] = useState(true);
  const [theftsError, setTheftsError] = useState(null);


  const center = [62.6010, 29.7636]; // Joensuu
  const initialZoom = 11;

  // BTT-27: hae data backendistä kerran sivun latauksessa
  useEffect(() => {
  let alive = true;

  (async () => {
    try {
      setLoadingThefts(true);
      setTheftsError(null);

      const data = await getTheftReports();
      if (alive) setThefts(data);

      console.log("BTT-27 theft reports:", data);
    } catch (e) {
      if (alive) setTheftsError(e?.message ?? "Ilmoitusten haku epäonnistui");
    } finally {
      if (alive) setLoadingThefts(false);
    }
  })();

  return () => {
    alive = false;
  };
}, []);
  

  // BTT-77: keskitä käyttäjän sijaintiin
  const onCenterToUser = useCallback(() => {
    const map = mapRef.current;
    console.log("CENTER CLICKED");

    if (!map) {
      console.warn("Kartta ei ole vielä valmis.");
      return;
    }

    if (!("geolocation" in navigator)) {
      console.warn("Selaimessa ei ole geolocation-tukea.");
      return;
    }

    console.log("Pyydetään sijaintia.");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("SAIN SIJAINNIN:", latitude, longitude);

        map.flyTo([latitude, longitude], 15, { animate: true, duration: 1.2 });
      },
      (err) => {
        console.warn("Sijainnin haku epäonnistui:", err.code, err.message);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
    );
  }, []);
   
  return (
    <div className="map-wrap">
      <MapContainer
      center={center}
      zoom={initialZoom}
      scrollWheelZoom
      >
         <MapRefBinder mapRef={mapRef} />

          {/* UUSI: karttaklikki -> onLocationSelected */}
  <MapClickPicker enabled={isPickingLocation} onPick={onLocationSelected} />

      
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        




        {showThefts &&
          mockThefts.map((t) => (
            <Marker key={t.id} position={[t.lat, t.lng]}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div>
                    <strong>{t.title}</strong>
                  </div>
                  <div>Päivä: {formatDate(t.date)}</div>
                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                    id: {t.id}
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

      {!isMenuOpen && <MapControls onCenterToUser={onCenterToUser} /> }
    </div>
  );
} 
