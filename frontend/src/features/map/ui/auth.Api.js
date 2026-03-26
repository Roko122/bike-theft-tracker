const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const API_PREFIX = '/api/v1';
const NO_BODY = Symbol('NO_BODY');

function url(path) {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

async function request(
  method,
  path,
  body = NO_BODY,
  options = {}
) {
  const includeCredentials = options.includeCredentials === true;
  const fetchOptions = {
    method,
    headers: {
      Accept: 'application/json'
    }
  };

  if (includeCredentials) {
    fetchOptions.credentials = 'include';
  }

  const shouldSendJsonBody = body !== NO_BODY;

  if (shouldSendJsonBody) {
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

export function registerUser(payload) {
  return request('POST', '/auth/register', payload);
}

export function loginUser(payload) {
  return request('POST', '/auth/login', payload, {
    includeCredentials: true
  });
}

export function getCurrentUser() {
  return request('GET', '/auth/me', NO_BODY, { includeCredentials: true });
}

export function logoutUser() {
  return request('POST', '/auth/logout', NO_BODY, {
    includeCredentials: true
  });
}

export function refreshUser() {
  return request('POST', '/auth/refresh', NO_BODY, {
    includeCredentials: true
  });
}
