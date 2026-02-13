import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
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

export default function MapPage() {
  // react-leaflet v4: käytetään refiä (ei whenCreated)
  const mapRef = useRef(null);

  const [showThefts, setShowThefts] = useState(true);

/* tähän uutta koodia*/
  const [thefts, setThefts] = useState([]);


  const center = [62.6010, 29.7636]; // Helsinki
  const initialZoom = 11;

  const onToggleThefts = useCallback(() => {
    setShowThefts((v) => !v);
  }, []);

  const onCenterToUser = useCallback(() => {
    const map = mapRef.current;
    if (!map) {
      console.warn("Kartta ei ole vielä valmis.");
      return;
    }

    if (!("geolocation" in navigator)) {
      console.warn("Selaimessa ei ole geolocation-tukea.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14, { animate: true });
      },
      (err) => {
        console.warn("Sijainnin haku epäonnistui:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }, []);

  useEffect(() => {
  getTheftReports()
    .then((data) => {
      console.log("theft reports from backend:", data);
      setThefts(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error("GET theft reports failed:", err);
      setThefts([]);
    });
}, []);


  return (
    <div className="map-wrap">
      <MapContainer ref={mapRef} center={center} zoom={initialZoom} scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

{showThefts &&
  thefts.map((t) => (
    <Marker
      key={t.id}
      position={[t.location?.latitude ?? t.latitude, t.location?.longitude ?? t.longitude]}

    >
<Popup>
  <pre style={{ margin: 0, fontSize: 12 }}>
    {JSON.stringify(t, null, 2)}
  </pre>
</Popup>

            </Marker>
          ))}
      </MapContainer>

{/*      <MapControls onToggleThefts={onToggleThefts} onCenterToUser={onCenterToUser} /> */}
    </div>
  );
}
