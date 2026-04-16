const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const API_PREFIX = '/api/v1';

function url(path) {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

async function requestCred(method, path, body, includeCredentials) {
  const fetchOptions = {
    method,
    headers: {
      Accept: 'application/json'
    }
  };

  if (includeCredentials) {
    fetchOptions.credentials = 'include';
  } else {
    fetchOptions.credentials = 'omit';
  }

  if (body) {
    fetchOptions.headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(url(path), fetchOptions);

  const text = await res.text().catch(() => '');
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore non-json body
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      text ||
      `${method} ${path} failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function requestPublic(method, path, body) {
  return requestCred(method, path, body, false);
}

function requestAuth(method, path, body) {
  return requestCred(method, path, body, true);
}

export function registerUser(payload) {
  return requestPublic('POST', '/auth/register', payload);
}

export function loginUser(payload) {
  return requestAuth('POST', '/auth/login', payload);
}

export function getCurrentUser() {
  return requestAuth('GET', '/auth/me', null);
}

export function logoutUser() {
  return requestAuth('POST', '/auth/logout', null);
}

export function refreshUser() {
  return requestAuth('POST', '/auth/refresh', null);
}
