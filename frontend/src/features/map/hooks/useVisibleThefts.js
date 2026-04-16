import { useCallback, useEffect, useState } from 'react';
import { fetchTheftReportMapItemsByBounds } from '../../api/theftReportApi.js';
import { getBoundsParams } from '../utils/mapBounds.js';
import { hasValidCoordinates } from '../utils/reportFormatters.js';

export function useVisibleThefts({ mapRef, refreshKey }) {
  const [thefts, setThefts] = useState([]);

  const loadVisibleThefts = useCallback(async (map) => {
    if (!map || typeof map.getBounds !== 'function') {
      return;
    }

    try {
      const boundsParams = getBoundsParams(map);
      const data = await fetchTheftReportMapItemsByBounds(boundsParams);
      setThefts((data ?? []).filter(hasValidCoordinates));
    } catch (error) {
      console.error('Ilmoitusten haku epäonnistui:', error);
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      loadVisibleThefts(map);
    }
  }, [loadVisibleThefts, mapRef, refreshKey]);

  return {
    thefts,
    loadVisibleThefts
  };
}
