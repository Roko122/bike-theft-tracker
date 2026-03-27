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
    throw new Error(message);
  }
  return data;
}

function request(method, path, body) {
  return requestCred(method, path, body, false);
}

export function registerUser(payload) {
  return request('POST', '/auth/register', payload);
}

export function loginUser(payload) {
  return request('POST', '/auth/login', payload);
}

export function getCurrentUser() {
  return requestCred('GET', '/auth/me', null, true);
}

export function logoutUser() {
  return requestCred('POST', '/auth/logout', null, true);
}

export function refreshUser() {
  return requestCred('POST', '/auth/refresh', null, true);
}
