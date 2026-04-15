import { authorizedFetch } from './authorizedFetch.js';

// frontend/src/features/theftReports/theftReportApi.js

const DEFAULT_BASE_URL = 'http://localhost:8080';
const DEFAULT_API_PREFIX = '/api/v1/theft-reports';

/**
 * Rakentaa backendin base URLin.
 * Voit halutessasi määrittää Vite-muuttujan: VITE_API_BASE_URL
 * esim. .env.frontend: VITE_API_BASE_URL=http://localhost:8080
 */
export function getApiBaseUrl() {
  return import.meta?.env?.VITE_API_BASE_URL || DEFAULT_BASE_URL;
}

function buildUrl(path = '') {
  return `${getApiBaseUrl()}${DEFAULT_API_PREFIX}${path}`;
}

export function resolveApiAssetUrl(pathOrUrl) {
  if (typeof pathOrUrl !== 'string' || pathOrUrl.trim() === '') return '';

  try {
    return new URL(pathOrUrl, `${getApiBaseUrl().replace(/\/+$/, '')}/`).toString();
  } catch {
    return pathOrUrl;
  }
}

async function parseJsonOrThrow(res) {
  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Jos backend palauttaa ei-JSON (esim. HTML error), pidetään text talteen
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      text ||
      `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * Hakee kaikki varkausilmoitukset (kartta-items).
 * GET http://localhost:8080/api/v1/theft-reports
 */
export async function getTheftReports({ signal } = {}) {
  const res = await authorizedFetch(buildUrl(''), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  });
  return parseJsonOrThrow(res);
}

/**
 * Hakee yhden varkausilmoituksen id:llä.
 * GET http://localhost:8080/api/v1/theft-reports/{id}
 */
export async function getTheftReportById(id, { signal } = {}) {
  if (!id) throw new Error('id is required');
  const res = await authorizedFetch(buildUrl(`/${encodeURIComponent(id)}`), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  });
  return parseJsonOrThrow(res);
}

//BTT 95 uusi funktio
/**
 * Hakee kartalla näkyvän alueen varkausilmoitukset bounding boxin perusteella.
 *
 * GET /api/v1/theft-reports?minLon=&minLat=&maxLon=&maxLat=
 *
 * @param {object} bounds
 * @param {number} bounds.minLon
 * @param {number} bounds.minLat
 * @param {number} bounds.maxLon
 * @param {number} bounds.maxLat
 * @param {object} options
 * @param {AbortSignal} options.signal
 * @returns {Promise<any>}
 */
export async function fetchTheftReportMapItemsByBounds(
  { minLon, minLat, maxLon, maxLat },
  { signal } = {}
) {
  const params = new URLSearchParams({
    minLon: String(minLon),
    minLat: String(minLat),
    maxLon: String(maxLon),
    maxLat: String(maxLat)
  });

  const res = await authorizedFetch(buildUrl(`?${params.toString()}`), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  });

  return parseJsonOrThrow(res);
}

async function requestFormData(method, formData) {
  const fetchOptions = {
    method,
    headers: {
      Accept: 'application/json'
    },
    body: formData
  };

  const res = await authorizedFetch(buildUrl(), fetchOptions);

  return parseJsonOrThrow(res);
}

// Luo uusi ilmoitus
export function createTheftReport(payload, images = []) {
  const formData = new FormData();
  formData.append(
    'theftReport',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );
  images.forEach((file) => {
    formData.append('images', file);
  });

  return requestFormData('POST', formData);
}
