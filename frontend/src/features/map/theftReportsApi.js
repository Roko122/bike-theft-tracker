const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const API_PREFIX = '/api/v1';

function url(path) {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

async function parseResponse(res, method, path) {
  const text = await res.text().catch(() => '');
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore non-json response body
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      text ||
      `${method} ${path} failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

async function request(method, path, body, { includeCredentials = false } = {}) {
  const res = await fetch(url(path), {
    method,
    ...(includeCredentials ? { credentials: 'include' } : {}),
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  return parseResponse(res, method, path);
}

async function requestFormData(
  method,
  path,
  formData,
  { includeCredentials = false } = {}
) {
  const res = await fetch(url(path), {
    method,
    ...(includeCredentials ? { credentials: 'include' } : {}),
    headers: {
      Accept: 'application/json'
    },
    body: formData
  });

  return parseResponse(res, method, path);
}

// Hae kaikki ilmoitukset
export function fetchTheftReports() {
  return request('GET', '/theft-reports');
}

// Karttaa varten (sama endpoint nyt)
export function fetchTheftReportMapItems() {
  return request('GET', '/theft-reports');
}

// Luo uusi ilmoitus
export function createTheftReport(payload) {
  const formData = new FormData();
  formData.append(
    'theftReport',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );

  return requestFormData('POST', '/theft-reports', formData, {
    includeCredentials: true
  });
}
