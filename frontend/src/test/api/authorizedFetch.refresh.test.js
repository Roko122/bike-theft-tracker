import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  SESSION_EXPIRED_ERROR_CODE,
  authorizedFetch
} from '../../features/api/authorizedFetch.js';

describe('authorizedFetch - refresh flow', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('tekee refreshin ja yrittää alkuperäisen pyynnön uudelleen kun access token on vanhentunut', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}')
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200
      });

    vi.stubGlobal('fetch', fetchMock);

    const response = await authorizedFetch(
      'http://localhost:8080/api/v1/theft-reports',
      { method: 'POST' }
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][0]).toContain('/api/v1/auth/refresh');
    expect(fetchMock.mock.calls[2][0]).toContain('/api/v1/theft-reports');
  });

  it('ilmoittaa session vanhenemisesta kun refresh epäonnistuu', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 401
      });

    const notifySpy = vi.spyOn(
      await import('../../features/app/auth/sessionExpiryBridge.js'),
      'notifySessionExpired'
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      authorizedFetch('http://localhost:8080/api/v1/theft-reports', {
        method: 'POST'
      })
    ).rejects.toMatchObject({
      code: SESSION_EXPIRED_ERROR_CODE
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain('/api/v1/auth/refresh');
    expect(notifySpy).toHaveBeenCalledTimes(1);
  });
});
