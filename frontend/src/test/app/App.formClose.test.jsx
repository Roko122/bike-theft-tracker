import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App.jsx';

vi.mock('../../features/map/MapPage.jsx', () => ({
  default: () => <div data-testid="map-page" />
}));

vi.mock('../../features/map/ui/TheftReportForm.jsx', () => ({
  default: () => <div data-testid="theft-report-form" />
}));

vi.mock('../../features/map/ui/TheftReportDetailsSidebar.jsx', () => ({
  default: () => <div data-testid="theft-report-details-sidebar" />
}));

describe('App - takaisin-nappi sulkee lomakkeen', () => {
  test('palaa perusvalikkoon kun takaisin-nappia klikataan', () => {
    render(<App />);

    fireEvent.click(screen.getByText('☰'));
    fireEvent.click(screen.getByText('varkausilmoitus'));
    fireEvent.click(screen.getByText('← takaisin'));

    expect(screen.queryByTestId('theft-report-form')).not.toBeInTheDocument();
    expect(screen.getByText('varkausilmoitus')).toBeInTheDocument();
  });
});
