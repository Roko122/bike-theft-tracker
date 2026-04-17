import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTheftReportMapItemsByBounds } from '../../api/theftReportApi.js';
import { getBoundsParams } from '../utils/mapBounds.js';
import { hasValidCoordinates } from '../utils/reportFormatters.js';

const FETCH_DEBOUNCE_MS = 450;
const MIN_CENTER_CHANGE_RATIO = 0.18;
const MIN_SPAN_CHANGE_RATIO = 0.12;

function getBoundsMetrics(bounds) {
  const lonSpan = Math.abs(bounds.maxLon - bounds.minLon);
  const latSpan = Math.abs(bounds.maxLat - bounds.minLat);

  return {
    lonSpan,
    latSpan,
    lonCenter: (bounds.minLon + bounds.maxLon) / 2,
    latCenter: (bounds.minLat + bounds.maxLat) / 2
  };
}

function hasMeaningfulBoundsChange(previousBounds, nextBounds) {
  if (!previousBounds) {
    return true;
  }

  const previous = getBoundsMetrics(previousBounds);
  const next = getBoundsMetrics(nextBounds);
  const lonReference = Math.max(previous.lonSpan, next.lonSpan, 0.0001);
  const latReference = Math.max(previous.latSpan, next.latSpan, 0.0001);
  const lonCenterChange = Math.abs(next.lonCenter - previous.lonCenter) / lonReference;
  const latCenterChange = Math.abs(next.latCenter - previous.latCenter) / latReference;
  const lonSpanChange = Math.abs(next.lonSpan - previous.lonSpan) / lonReference;
  const latSpanChange = Math.abs(next.latSpan - previous.latSpan) / latReference;

  return (
    lonCenterChange >= MIN_CENTER_CHANGE_RATIO ||
    latCenterChange >= MIN_CENTER_CHANGE_RATIO ||
    lonSpanChange >= MIN_SPAN_CHANGE_RATIO ||
    latSpanChange >= MIN_SPAN_CHANGE_RATIO
  );
}

export function useVisibleThefts({ mapRef, refreshKey }) {
  const [thefts, setThefts] = useState([]);
  const debounceRef = useRef(null);
  const abortControllerRef = useRef(null);
  const latestFetchedBoundsRef = useRef(null);

  const loadVisibleThefts = useCallback((map, { force = false } = {}) => {
    if (!map || typeof map.getBounds !== 'function') {
      return;
    }

    const boundsParams = getBoundsParams(map);

    if (
      !force &&
      !hasMeaningfulBoundsChange(latestFetchedBoundsRef.current, boundsParams)
    ) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const data = await fetchTheftReportMapItemsByBounds(boundsParams, {
          signal: controller.signal
        });

        latestFetchedBoundsRef.current = boundsParams;
        setThefts((data ?? []).filter(hasValidCoordinates));
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }

        console.error('Ilmoitusten haku epäonnistui:', error);
      }
    }, force ? 0 : FETCH_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      loadVisibleThefts(map, { force: true });
    }
  }, [loadVisibleThefts, mapRef, refreshKey]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    thefts,
    loadVisibleThefts
  };
}
