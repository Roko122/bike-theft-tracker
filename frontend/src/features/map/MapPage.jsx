import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import { mockThefts } from "./mockThefts.js";
import MapControls from "./ui/MapControls";
<<<<<<< HEAD
import { getTheftReports } from "../theftReports/api";


=======
import { fetchTheftReports } from "./theftReportsApi";
>>>>>>> ce2b485 ( BTT-27 uusi tiedosto backissä ja muokattu MapPagea)

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
// näytetäänkö markkerit
  const [showThefts, setShowThefts] = useState(true);

<<<<<<< HEAD
  const [showThefts, setShowThefts] = useState(true);

/* tähän uutta koodia*/
  const [thefts, setThefts] = useState([]);

=======
    // BTT-27: data + tila tämä uutta koodia
  const [thefts, setThefts] = useState([]);
  const [loadingThefts, setLoadingThefts] = useState(false);
  const [theftsError, setTheftsError] = useState(null);
>>>>>>> ce2b485 ( BTT-27 uusi tiedosto backissä ja muokattu MapPagea)

  const center = [62.6010, 29.7636]; // Joensuu
  const initialZoom = 11;

    // BTT-27: hae data backendistä kerran sivun latauksessa
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingThefts(true);
        setTheftsError(null);

        const data = await fetchTheftReports();
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

<<<<<<< HEAD
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
=======
        {/* BTT-27: käytetään backendin dataa, ei mockkia */}
        {showThefts &&
          thefts.map((t) => {
            const lat = Number(t?.location?.latitude);
            const lng = Number(t?.location?.longitude);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

            /*
            const lat = t?.location?.latitude;
            const lng = t?.location?.longitude;

            // Jos datassa on rikkinäinen sijainti, skipataan marker
            if (typeof lat !== "number" || typeof lng !== "number") return null;
            */

            return (
              <Marker key={t.id} position={[lat, lng]}>
                <Popup>
  <div style={{ minWidth: 180 }}>
    <div>
      <strong>
       TESTI {t?.brand ?? "Tuntematon"} {t?.model ?? ""}
      </strong>
    </div>

    <div>Tyyppi: {t?.type ?? "-"}</div>
    <div>Väri: {t?.color ?? "-"}</div>
    <div>Aika: {formatDate(t?.theftTime)}</div>

    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
      id: {t?.id}
    </div>
  </div>
</Popup>

              </Marker>
            );
          })}
      </MapContainer>

      {/* Kevyt status-teksti (helpottaa BTT-27 todentamista) */}
      <div style={{ position: "absolute", left: 12, bottom: 12, zIndex: 1000 }}>
        {loadingThefts && <div className="chip">Ladataan ilmoituksia…</div>}
        {theftsError && <div className="chip chip-error">Virhe: {theftsError}</div>}
        {!loadingThefts && !theftsError && (
          <div className="chip">Ilmoituksia: {thefts.length}</div>
        )}
      </div>

      <MapControls onToggleThefts={onToggleThefts} onCenterToUser={onCenterToUser} />
>>>>>>> ce2b485 ( BTT-27 uusi tiedosto backissä ja muokattu MapPagea)
    </div>
  );
}
