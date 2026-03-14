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

describe('App - varkausilmoitus-nappi avaa lomakkeen', () => {
  test('näyttää TheftReportFormin kun varkausilmoitus-nappia klikataan', () => {
    render(<App />);

    fireEvent.click(screen.getByText('☰'));
    fireEvent.click(screen.getByText('varkausilmoitus'));

    expect(screen.getByTestId('theft-report-form')).toBeInTheDocument();
  });
});
