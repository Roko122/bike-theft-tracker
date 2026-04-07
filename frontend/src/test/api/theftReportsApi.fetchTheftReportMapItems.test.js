import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchTheftReportMapItemsByBounds } from '../../features/api/theftReportApi.js';

const fetchTheftReportMapItems = () =>
  fetchTheftReportMapItemsByBounds({
    minLon: 0,
    minLat: 0,
    maxLon: 1,
    maxLat: 1
  });

describe('theftReportsApi – fetchTheftReportMapItems', () => {
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

    await expect(fetchTheftReportMapItems()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/theft-reports'),
      expect.objectContaining({ method: 'GET' })
    );
  });
});
