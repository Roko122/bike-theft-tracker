import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getUnreadNotificationCount,
  getUnreadNotifications,
  markNotificationAsRead
} from '../../features/api/notificationApi.js';

describe('notificationApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hakee lukemattomat ilmoitukset', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () =>
          Promise.resolve(
            JSON.stringify([
              {
                id: 'uuid-1',
                type: 'NEW_SIGHTING',
                theftReport: 'report-1',
                time: '2026-04-27T09:15:00'
              }
            ])
          )
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(getUnreadNotifications()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'NEW_SIGHTING',
          theftReport: 'report-1'
        })
      ])
    );

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notifications'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('hakee ilmoitusten lukumäärän', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ unreadCount: 3 }))
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(getUnreadNotificationCount()).resolves.toEqual({
      unreadCount: 3
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notifications/count'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('merkitsee ilmoituksen luetuksi', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('')
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(markNotificationAsRead('uuid-2')).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notifications/uuid-2/read'),
      expect.objectContaining({ method: 'PATCH' })
    );
  });
});
