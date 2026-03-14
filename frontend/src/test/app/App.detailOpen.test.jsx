import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App.jsx';

vi.mock('../../features/map/MapPage.jsx', () => ({
  default: ({ onReportSelected }) => {
    useEffect(() => {
      onReportSelected?.('abc123');
    }, [onReportSelected]);

    return <div data-testid="map-page" />;
  }
}));

vi.mock('../../features/map/ui/TheftReportForm.jsx', () => ({
  default: () => <div data-testid="theft-report-form" />
}));

vi.mock('../../features/map/ui/TheftReportDetailsSidebar.jsx', () => ({
  default: () => <div data-testid="theft-report-details-sidebar" />
}));

describe('App - markkerin klikkaus avaa detail-nakyman', () => {
  test('avaa detail-nakyman ja valikon kun onReportSelected kutsutaan', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('theft-report-details-sidebar')).toBeInTheDocument();
    });
  });
});
