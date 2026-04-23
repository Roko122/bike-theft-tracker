import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

export function MapRefBinder({ mapRef }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return null;
}

export function MapClickPicker({ enabled, onPick }) {
  useMapEvents({
    click(event) {
      if (!enabled) {
        return;
      }

      onPick?.({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      });
    }
  });

  return null;
}

export function VisibleTheftsLoader({ onLoad }) {
  const map = useMapEvents({
    moveend() {
      if (map) {
        onLoad?.(map);
      }
    }
  });

  useEffect(() => {
    if (map) {
      onLoad?.(map);
    }
  }, [map, onLoad]);

  return null;
}

export function AutoCenterToUser({
  fallbackCenter,
  fallbackZoom = 11,
  userZoom = 13,
  onResolvedLocation
}) {
  const map = useMap();
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (hasCenteredRef.current) {
      return;
    }

    hasCenteredRef.current = true;

    if (!map || typeof map.setView !== 'function') {
      return;
    }

    if (!('geolocation' in navigator)) {
      map.setView(fallbackCenter, fallbackZoom);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onResolvedLocation?.({ latitude, longitude });
        map.setView([latitude, longitude], userZoom);
      },
      () => {
        map.setView(fallbackCenter, fallbackZoom);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [fallbackCenter, fallbackZoom, map, onResolvedLocation, userZoom]);

  return null;
}

export function CenterToSelectedLocation({ location, zoom = 15 }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !location) {
      return;
    }

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return;
    }

    map.setView([latitude, longitude], Math.max(map.getZoom(), zoom));
  }, [location, map, zoom]);

  return null;
}

export function MapInteractionLock({ locked }) {
  const map = useMap();

  useEffect(() => {
    if (!map) {
      return undefined;
    }

    const handlers = [
      map.dragging,
      map.touchZoom,
      map.doubleClickZoom,
      map.scrollWheelZoom,
      map.boxZoom,
      map.keyboard,
      map.tap
    ].filter(Boolean);

    handlers.forEach((handler) => {
      if (locked) {
        handler.disable();
      } else {
        handler.enable();
      }
    });

    return () => {
      handlers.forEach((handler) => {
        handler.enable();
      });
    };
  }, [locked, map]);

  return null;
}
