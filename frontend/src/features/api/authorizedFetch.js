import { notifySessionExpired } from '../app/auth/sessionExpiryBridge.js';
import { buildApiUrl } from './apiConfig.js';

const SESSION_EXPIRED_ERROR_CODE = 'SESSION_EXPIRED';
const REFRESH_PATH = '/auth/refresh';

let refreshRequestPromise = null;

function createSessionExpiredError() {
  const error = new Error('SESSION_EXPIRED');
  error.code = SESSION_EXPIRED_ERROR_CODE;
  return error;
}

function withCredentials(options = {}) {
  return {
    ...options,
    credentials: 'include'
  };
}

async function doSessionFetch(path, options = {}) {
  return fetch(buildApiUrl(path), withCredentials(options));
}

async function ensureFreshSession() {
  if (!refreshRequestPromise) {
    refreshRequestPromise = doSessionFetch(REFRESH_PATH, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      }
    }).then((response) => {
      if (!response.ok) {
        throw createSessionExpiredError();
      }

      return response;
    });

    refreshRequestPromise.then(
      () => {
        refreshRequestPromise = null;
      },
      () => {
        refreshRequestPromise = null;
      }
    );
  }

  return refreshRequestPromise;
}

async function handleExpiredSession() {
  notifySessionExpired();
  throw createSessionExpiredError();
}

export async function authorizedFetch(requestUrl, options = {}) {
  const requestOptions = withCredentials(options);
  let response = await fetch(requestUrl, requestOptions);

  if (response.status !== 401) {
    return response;
  }

  try {
    await ensureFreshSession();
  } catch {
    return handleExpiredSession();
  }

  response = await fetch(requestUrl, requestOptions);

  if (response.status === 401) {
    return handleExpiredSession();
  }

  return response;
}

export async function sessionFetch(path, options = {}) {
  return authorizedFetch(buildApiUrl(path), options);
}

export async function sessionFetchWithoutRefresh(path, options = {}) {
  return doSessionFetch(path, options);
}

export { SESSION_EXPIRED_ERROR_CODE };
