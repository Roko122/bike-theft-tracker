import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import L from 'leaflet';
import MapControls from './ui/MapControls.jsx';
import {
  AutoCenterToUser,
  MapClickPicker,
  MapRefBinder,
  VisibleTheftsLoader
} from './components/MapEffects.jsx';
import TheftMarkersLayer from './components/TheftMarkersLayer.jsx';
import {
  MapPickHint,
  MapSuccessOverlay
} from './components/MapStatusOverlay.jsx';
import MapLegend from './components/MapLegend.jsx';
import { useVisibleThefts } from './hooks/useVisibleThefts.js';
import { useMapSuccessMessage } from './hooks/useMapSuccessMessage.js';
import { useUserLocationMarker } from './hooks/useUserLocationMarker.js';
import { FALLBACK_CENTER, INITIAL_ZOOM } from './constants.js';

import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker1x from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: markerShadow
});

export default function MapPage({
  refreshKey,
  isMenuOpen,
  onLocationSelected,
  isPickingLocation,
  onReportSelected,
  selectedLocation
}) {
  const mapRef = useRef(null);
  const showMapSuccess = useMapSuccessMessage();
  const { thefts, loadVisibleThefts } = useVisibleThefts({
    mapRef,
    refreshKey
  });
  const { userLocation, centerToUser, zoomIn, zoomOut } =
    useUserLocationMarker(mapRef);

  return (
    <div className="map-wrap" style={{ position: 'relative' }}>
      {showMapSuccess && <MapSuccessOverlay />}

      <MapContainer
        center={FALLBACK_CENTER}
        zoom={INITIAL_ZOOM}
        scrollWheelZoom
        zoomControl={false}
      >
        <MapRefBinder mapRef={mapRef} />
        <AutoCenterToUser fallbackCenter={FALLBACK_CENTER} />
        <VisibleTheftsLoader onLoad={loadVisibleThefts} />
        <MapClickPicker enabled={isPickingLocation} onPick={onLocationSelected} />

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

        {userLocation && (
          <CircleMarker
            center={[userLocation.latitude, userLocation.longitude]}
            radius={8}
            pathOptions={{
              color: '#0d6efd',
              fillColor: '#0d6efd',
              fillOpacity: 1
            }}
          />
        )}

        <TheftMarkersLayer
          reports={thefts}
          isPickingLocation={isPickingLocation}
          onReportSelected={onReportSelected}
        />
      </MapContainer>

      {isPickingLocation && <MapPickHint />}

      {!isMenuOpen && <MapLegend />}

      {!isMenuOpen && (
        <MapControls
          onCenterToUser={centerToUser}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
      )}
    </div>
  );
}
