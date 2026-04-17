import { buildApiUrl } from './apiConfig.js';
import {
  sessionFetch,
  sessionFetchWithoutRefresh
} from './authorizedFetch.js';

async function parseJsonResponse(response, { method, path }) {
  const text = await response.text().catch(() => '');
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      text ||
      `${method} ${path} failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function buildJsonRequestOptions(method, body, includeBody = true) {
  const requestOptions = {
    method,
    headers: {
      Accept: 'application/json'
    }
  };

  if (includeBody && body) {
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(body);
  }

  return requestOptions;
}

async function requestPublic(method, path, body) {
  const response = await fetch(buildApiUrl(path), buildJsonRequestOptions(method, body));
  return parseJsonResponse(response, { method, path });
}

async function requestSessionEndpoint(method, path) {
  const response = await sessionFetchWithoutRefresh(
    path,
    buildJsonRequestOptions(method, null, false)
  );

  return parseJsonResponse(response, { method, path });
}

async function requestCredentialed(method, path, body) {
  const response = await sessionFetchWithoutRefresh(
    path,
    buildJsonRequestOptions(method, body)
  );

  return parseJsonResponse(response, { method, path });
}

async function requestAuthenticated(method, path, body, options = {}) {
  const response = await sessionFetch(path, {
    ...buildJsonRequestOptions(method, body),
    ...options
  });
  return parseJsonResponse(response, { method, path });
}

export function registerUser(payload) {
  return requestPublic('POST', '/auth/register', payload);
}

export function loginUser(payload) {
  return requestCredentialed('POST', '/auth/login', payload);
}

export function getCurrentUser() {
  return requestAuthenticated('GET', '/auth/me', null, {
    suppressSessionExpired: true
  });
}

export function logoutUser() {
  return requestAuthenticated('POST', '/auth/logout', null);
}

export function refreshUser() {
  return requestSessionEndpoint('POST', '/auth/refresh');
}
