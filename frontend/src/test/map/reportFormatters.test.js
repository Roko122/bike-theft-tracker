import { describe, expect, it } from 'vitest';

import { formatReportDate } from '../../features/map/utils/reportFormatters.js';

describe('formatReportDate', () => {
  it('renders a local datetime string without adding a manual hour offset', () => {
    const isoValue = '2026-04-30T15:00:00';

    expect(formatReportDate(isoValue, 'fi')).toBe(
      new Date(isoValue).toLocaleString('fi-FI')
    );
  });
});
