import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTheftReports as fetchTheftReports } from '../../features/api/theftReportApi.js';

describe('theftReportsApi – fetchTheftReports', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('tekee GET-pyynnön oikeaan osoitteeseen', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
        text: () => Promise.resolve('[]')
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchTheftReports()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/theft-reports'),
      expect.objectContaining({ method: 'GET' })
    );
  });
});
