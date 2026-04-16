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

describe('App - valikko avautuu', () => {
  test('näyttää valikon kun menu-nappia klikataan', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Avaa valikko' }));

    expect(screen.getByText('Uusi varkausilmoitus')).toBeInTheDocument();
  });
});
