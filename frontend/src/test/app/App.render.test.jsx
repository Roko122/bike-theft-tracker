import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
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

describe('App - sovellus renderoityy', () => {
  test('renderoi Bike Theft Tracker tekstin', () => {
    render(<App />);

    expect(screen.getByText('Bike Theft Tracker')).toBeInTheDocument();
  });
});
