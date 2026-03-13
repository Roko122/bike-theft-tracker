// frontend/src/features/theftReports/api.js

const DEFAULT_BASE_URL = 'http://localhost:8080';
const DEFAULT_API_PREFIX = '/api/v1/theft-reports';

/**
 * Rakentaa backendin base URLin.
 * Voit halutessasi määrittää Vite-muuttujan: VITE_API_BASE_URL
 * esim. .env.frontend: VITE_API_BASE_URL=http://localhost:8080
 */
function getBaseUrl() {
  return import.meta?.env?.VITE_API_BASE_URL || DEFAULT_BASE_URL;
}

function buildUrl(path = '') {
  return `${getBaseUrl()}${DEFAULT_API_PREFIX}${path}`;
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
  const res = await fetch(buildUrl(''), {
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
  const res = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  });
  return parseJsonOrThrow(res);
}

/**
 * Luo varkausilmoituksen.
 * POST http://localhost:8080/api/v1/theft-reports
 *
 * payload pitää olla backendin CreateTheftReportRequest-muodossa:
 * {
 *  description, theftTime, theftAddress,
 *  location: { longitude, latitude },
 *  bike: { brand, model, type, color, serialNumber, description, user: { username, email } }
 * }
 */
export async function createTheftReport(payload, { signal } = {}) {
  if (!payload) throw new Error('payload is required');

  const res = await fetch(buildUrl(''), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload),
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

  const res = await fetch(buildUrl(`?${params.toString()}`), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  });

  return parseJsonOrThrow(res);
}
