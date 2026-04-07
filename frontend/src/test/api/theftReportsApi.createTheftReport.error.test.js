import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTheftReport } from '../../features/api/theftReportApi.js';

describe('theftReportsApi – createTheftReport virhetilanne', () => {
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

    await expect(createTheftReport({})).rejects.toThrow();
  });
});
