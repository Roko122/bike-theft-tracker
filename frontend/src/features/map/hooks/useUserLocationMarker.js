import { useCallback, useState } from 'react';

export function useUserLocationMarker(mapRef) {
  const [userLocation, setUserLocation] = useState(null);

  const zoomIn = useCallback(() => {
    const map = mapRef.current;
    if (!map || typeof map.zoomIn !== 'function') {
      return;
    }

    map.zoomIn();
  }, [mapRef]);

  const zoomOut = useCallback(() => {
    const map = mapRef.current;
    if (!map || typeof map.zoomOut !== 'function') {
      return;
    }

    map.zoomOut();
  }, [mapRef]);

  const centerToUser = useCallback(() => {
    const map = mapRef.current;
    if (!map || !('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        map.flyTo([latitude, longitude], 15, {
          animate: true,
          duration: 1.2
        });
      },
      (error) => {
        console.warn('Sijainnin haku epäonnistui:', error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [mapRef]);

  return {
    userLocation,
    centerToUser,
    zoomIn,
    zoomOut
  };
}
