import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTheftReport } from '../../features/api/theftReportApi.js';

describe('theftReportsApi – createTheftReport', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('tekee POST-pyynnön oikeaan osoitteeseen oikealla payloadilla', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '1' }),
        text: () => Promise.resolve(JSON.stringify({ id: '1' }))
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      createTheftReport({
        description: 'Testi',
        location: { latitude: 62.601, longitude: 29.7636 }
      })
    ).resolves.toEqual({ id: '1' });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toContain('/api/v1/theft-reports');
    expect(options).toEqual(
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      })
    );

    const payloadBlob = options.body.get('theftReport');
    expect(payloadBlob).toBeInstanceOf(Blob);
    await expect(payloadBlob.text()).resolves.toBe(
      JSON.stringify({
        description: 'Testi',
        location: { latitude: 62.601, longitude: 29.7636 }
      })
    );
  });
});
