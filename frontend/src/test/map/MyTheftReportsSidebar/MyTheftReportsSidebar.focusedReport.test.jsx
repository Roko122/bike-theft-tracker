import { render, screen, waitFor } from '@testing-library/react';
import MyTheftReportsSidebar from '../../../features/map/ui/MyTheftReportsSidebar.jsx';
import {
  getMyTheftReports,
  getSightingsForReport
} from '../../../features/api/theftReportApi.js';

vi.mock('../../../features/api/theftReportApi.js', () => ({
  getMyTheftReports: vi.fn(() =>
    Promise.resolve([
      {
        id: 'report-1',
        brand: 'Tunturi',
        model: 'RX',
        theftAddress: 'Kauppakatu 1',
        theftTime: '2026-04-27T10:00:00Z',
        status: 'ACTIVE'
      }
    ])
  ),
  getSightingsForReport: vi.fn(() =>
    Promise.resolve([
      {
        id: 'sighting-1',
        description: 'Nähty torilla',
        location: { latitude: 60.1701, longitude: 24.9414 },
        createdAt: '2026-04-27T11:00:00Z'
      }
    ])
  ),
  resolveApiAssetUrl: vi.fn((value) => value)
}));

describe('MyTheftReportsSidebar - focused report', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('laajentaa focusedReportId:n automaattisesti ja hakee havainnot', async () => {
    render(<MyTheftReportsSidebar focusedReportId="report-1" />);

    await waitFor(() => {
      expect(getMyTheftReports).toHaveBeenCalled();
      expect(getSightingsForReport).toHaveBeenCalledWith('report-1');
    });

    expect(screen.getByText('Havainto 1')).toBeInTheDocument();
    expect(screen.getByText('Nähty torilla')).toBeInTheDocument();
  });
});
