import { logoutUser, refreshUser } from './authApi.js';

export async function authorizedFetch(requestUrl, options = {}) {
  const requestOptions = {
    credentials: 'include',
    ...options
  };

  let response = await fetch(requestUrl, requestOptions);
  if (response.status !== 401) return response;

  try {
    await refreshUser();
  } catch {
    await logoutUser().catch(() => {});
    window.dispatchEvent(new Event('auth:session-expired'));
    const error = new Error('SESSION_EXPIRED');
    error.code = 'SESSION_EXPIRED';
    throw error;
  }

  response = await fetch(requestUrl, requestOptions);

  if (response.status === 401) {
    await logoutUser().catch(() => {});
    window.dispatchEvent(new Event('auth:session-expired'));
    const error = new Error('SESSION_EXPIRED');
    error.code = 'SESSION_EXPIRED';
    throw error;
  }

  return response;
}
