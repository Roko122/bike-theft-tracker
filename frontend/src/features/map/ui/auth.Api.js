const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const API_PREFIX = '/api/v1';

function url(path) {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

async function request(method, path, body) {
  const res = await fetch(url(path), {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

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

export function registerUser(payload) {
  return request('POST', '/auth/register', payload);
}

export function loginUser(payload) {
  return request('POST', '/auth/login', payload);
}

export function getCurrentUser() {
  return request('GET', '/auth/me');
}

export function logoutUser() {
  return request('POST', '/auth/logout');
}
