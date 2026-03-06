import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import TheftReportDetailsSidebar from '../../../features/map/ui/TheftReportDetailsSidebar';

vi.mock('../../../features/theftReports/api', () => ({
  getTheftReportById: vi.fn(() =>
    Promise.resolve({
      id: 'abc123',
      brand: 'Trek',
      model: 'FX3',
      description: 'Testikuvaus',
      status: 'STOLEN',
      theftTime: '2024-01-01T12:00:00Z',
      bike: {
        brand: 'Trek',
        model: 'FX3',
        type: 'Maantie',
        color: 'Musta',
        serialNumber: '12345',
        description: 'Lisäkuvaus',
        user: {
          username: 'testikäyttäjä',
          email: 'testi@testi.fi'
        }
      }
    })
  )
}));

describe('TheftReportDetailsSidebar - tietojen näyttö', () => {
  it('näyttää ilmoituksen tiedot oikein kun data on haettu', async () => {
    render(<TheftReportDetailsSidebar reportId="abc123" />);

    await waitFor(() => {
      expect(screen.getByText('Testikuvaus')).toBeInTheDocument();
    });

    expect(screen.getByText('Trek')).toBeInTheDocument();
    expect(screen.getByText('FX3')).toBeInTheDocument();
    expect(screen.getByText('Testikuvaus')).toBeInTheDocument();
  });
});
