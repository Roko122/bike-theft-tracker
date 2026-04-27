import { sessionFetch } from './authorizedFetch.js';

async function parseJsonOrThrow(response, fallbackMessage) {
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
      fallbackMessage ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function getUnreadNotifications({ signal } = {}) {
  const response = await sessionFetch('/notifications', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  });

  return parseJsonOrThrow(response, 'Fetching notifications failed');
}

export async function getUnreadNotificationCount({ signal } = {}) {
  const response = await sessionFetch('/notifications/count', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  });

  return parseJsonOrThrow(response, 'Fetching notification count failed');
}

export async function markNotificationAsRead(id, { signal } = {}) {
  if (!id) {
    throw new Error('id is required');
  }

  const response = await sessionFetch(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json'
    },
    signal
  });

  if (!response.ok) {
    await parseJsonOrThrow(response, 'Marking notification as read failed');
  }
}
