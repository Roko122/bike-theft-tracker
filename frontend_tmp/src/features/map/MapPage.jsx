import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useCallback, useRef, useState } from "react";
import L from "leaflet";
import { mockThefts } from "./mockThefts";
import MapControls from "./ui/MapControls";

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

  const [showThefts, setShowThefts] = useState(false);

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

  return (
    <div className="map-wrap">
      <MapContainer ref={mapRef} center={center} zoom={initialZoom} scrollWheelZoom>
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

      <MapControls onToggleThefts={onToggleThefts} onCenterToUser={onCenterToUser} />
    </div>
  );
}
