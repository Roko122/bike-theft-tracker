import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useMemo, useRef } from 'react';
import L from 'leaflet';
import MapControls from './ui/MapControls.jsx';
import {
  AutoCenterToUser,
  MapClickPicker,
  MapInteractionLock,
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

function createSelectedLocationIcon() {
  return L.divIcon({
    className: 'selected-location-marker',
    html: `
      <span class="selected-location-marker__dot"></span>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

function createUserLocationIcon() {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <span class="user-location-marker__pulse"></span>
      <span class="user-location-marker__dot"></span>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
}

export default function MapPage({
  refreshKey,
  isMenuOpen,
  isInteractionLocked = false,
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
  const { userLocation, setResolvedUserLocation, centerToUser, zoomIn, zoomOut } =
    useUserLocationMarker(mapRef);
  const selectedLocationIcon = useMemo(() => createSelectedLocationIcon(), []);
  const userLocationIcon = useMemo(() => createUserLocationIcon(), []);

  return (
    <div
      className={isInteractionLocked ? 'map-wrap map-wrap--locked' : 'map-wrap'}
      style={{ position: 'relative' }}
    >
      {showMapSuccess && <MapSuccessOverlay />}

      <MapContainer
        center={FALLBACK_CENTER}
        zoom={INITIAL_ZOOM}
        scrollWheelZoom
        zoomControl={false}
      >
        <MapRefBinder mapRef={mapRef} />
        <MapInteractionLock locked={isInteractionLocked} />
        <AutoCenterToUser
          fallbackCenter={FALLBACK_CENTER}
          onResolvedLocation={setResolvedUserLocation}
        />
        <VisibleTheftsLoader onLoad={loadVisibleThefts} />
        <MapClickPicker enabled={isPickingLocation} onPick={onLocationSelected} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedLocation && (
          <Marker
            position={[selectedLocation.latitude, selectedLocation.longitude]}
            icon={selectedLocationIcon}
            interactive={false}
            zIndexOffset={900}
          />
        )}

        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
            interactive={false}
            zIndexOffset={850}
          />
        )}

        <TheftMarkersLayer
          reports={thefts}
          isPickingLocation={isPickingLocation}
          onReportSelected={onReportSelected}
        />
      </MapContainer>

      {isInteractionLocked && <div className="map-lock-overlay" aria-hidden="true" />}

      {isPickingLocation && <MapPickHint />}

      {!isMenuOpen && !isInteractionLocked && <MapLegend />}

      {!isMenuOpen && !isInteractionLocked && (
        <MapControls
          onCenterToUser={centerToUser}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
      )}
    </div>
  );
}
