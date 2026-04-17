import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser } from '../../features/api/authApi.js';

describe('authApi - getCurrentUser without active session', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('ei laukaise session vanhenemisen ilmoitusta ensilatauksessa ilman sessiota', async () => {
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

    await expect(getCurrentUser()).rejects.toMatchObject({
      message: 'SESSION_EXPIRED'
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(notifySpy).not.toHaveBeenCalled();
  });
});
