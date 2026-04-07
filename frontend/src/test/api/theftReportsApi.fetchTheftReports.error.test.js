import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTheftReports as fetchTheftReports } from '../../features/api/theftReportApi.js';

describe('theftReportsApi – fetchTheftReports virhetilanne', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('heittää virheen kun status on 5xx', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error')
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchTheftReports()).rejects.toThrow();
  });
});
