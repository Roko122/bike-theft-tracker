import { useEffect } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../App.jsx';

vi.mock('../../features/map/MapPage.jsx', () => ({
  default: ({ onReportSelected }) => {
    useEffect(() => {
      onReportSelected?.('abc123');
    }, []);

    return <div data-testid="map-page" />;
  }
}));

vi.mock('../../features/map/ui/TheftReportForm.jsx', () => ({
  default: () => <div data-testid="theft-report-form" />
}));

vi.mock('../../features/map/ui/TheftReportDetailsSidebar.jsx', () => ({
  default: () => <div data-testid="theft-report-details-sidebar" />
}));

describe('App - detail-nakymassa takaisin-nappi palaa perusvalikkoon', () => {
  test('palaa perusvalikkoon kun takaisin-nappia klikataan detail-nakymassa', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('theft-report-details-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('← takaisin'));

    expect(screen.queryByTestId('theft-report-details-sidebar')).not.toBeInTheDocument();
    expect(screen.getByText('varkausilmoitus')).toBeInTheDocument();
  });
});
