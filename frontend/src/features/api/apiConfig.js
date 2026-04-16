const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const API_PREFIX = '/api/v1';

export function buildApiUrl(path) {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

export function getApiBaseUrl() {
  return BASE_URL;
}
