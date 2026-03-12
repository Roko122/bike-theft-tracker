import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import TheftReportDetailsSidebar from '../../../features/map/ui/TheftReportDetailsSidebar';

vi.mock('../../../features/theftReports/api', () => ({
  getTheftReportById: vi.fn(() =>
    Promise.reject(new Error('Ilmoituksen haku epäonnistui.'))
  )
}));

describe('TheftReportDetailsSidebar - virhetilanne', () => {
  it('näyttää virheilmoituksen kun getTheftReportById heittää virheen', async () => {
    render(<TheftReportDetailsSidebar reportId="abc123" />);

    await waitFor(() => {
      expect(screen.getByText('Ilmoituksen haku epäonnistui')).toBeInTheDocument();
    });
  });
});
