import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import TheftReportDetailsSidebar from '../../../features/map/ui/TheftReportDetailsSidebar';

vi.mock('../../../features/theftReports/api', () => ({
  getTheftReportById: vi.fn(() => new Promise(() => {}))
}));

describe('TheftReportDetailsSidebar - lataaminen', () => {
  it('näyttää Ladataan... tekstin kun kutsu on kesken', async () => {
    render(<TheftReportDetailsSidebar reportId="abc123" />);

    await waitFor(() => {
      expect(screen.getByText('Ladataan...')).toBeInTheDocument();
    });
  });
});
