import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser } from '../../features/api/authApi.js';

describe('authApi - getCurrentUser refresh', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hakee käyttäjän refreshin jälkeen kun /auth/me palauttaa ensin 401', async () => {
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
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ username: 'rolf' }))
      });

    vi.stubGlobal('fetch', fetchMock);

    await expect(getCurrentUser()).resolves.toEqual({ username: 'rolf' });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][0]).toContain('/api/v1/auth/me');
    expect(fetchMock.mock.calls[1][0]).toContain('/api/v1/auth/refresh');
    expect(fetchMock.mock.calls[2][0]).toContain('/api/v1/auth/me');
  });
});
