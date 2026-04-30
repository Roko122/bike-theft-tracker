import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../App.jsx';
import {
  getUnreadNotificationCount,
  getUnreadNotifications,
  markNotificationAsRead
} from '../../features/api/notificationApi.js';

vi.mock('../../features/map/MapPage.jsx', () => ({
  default: () => <div data-testid="map-page" />
}));

vi.mock('../../features/map/ui/TheftReportForm.jsx', () => ({
  default: () => <div data-testid="theft-report-form" />
}));

vi.mock('../../features/map/ui/SightingReportPage.jsx', () => ({
  default: () => <div data-testid="sighting-report-page" />
}));

vi.mock('../../features/map/ui/TheftReportDetailsSidebar.jsx', () => ({
  default: () => <div data-testid="theft-report-details-sidebar" />
}));

vi.mock('../../features/map/ui/MyTheftReportsSidebar.jsx', () => ({
  default: ({ focusedReportId }) => (
    <div data-testid="my-reports-sidebar">focused:{focusedReportId ?? '-'}</div>
  )
}));

vi.mock('../../features/api/authApi.js', () => ({
  getCurrentUser: vi.fn(() => Promise.resolve({ username: 'owner' })),
  loginUser: vi.fn(() => Promise.resolve({ username: 'owner' })),
  logoutUser: vi.fn(() => Promise.resolve(null)),
  registerUser: vi.fn(() => Promise.resolve({ username: 'owner' }))
}));

vi.mock('../../features/api/notificationApi.js', () => ({
  getUnreadNotifications: vi.fn(() =>
    Promise.resolve([
      {
        id: 'notification-1',
        type: 'NEW_SIGHTING',
        theftReport: 'report-42',
        time: '2026-04-27T10:30:00'
      }
    ])
  ),
  getUnreadNotificationCount: vi.fn(() => Promise.resolve({ unreadCount: 1 })),
  markNotificationAsRead: vi.fn(() => Promise.resolve())
}));

describe('App - ilmoituskello', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('avaa ilmoituslistan kellosta', async () => {
    render(<App />);

    const bellButton = await screen.findByRole('button', {
      name: /avaa ilmoitukset/i
    });

    fireEvent.click(bellButton);

    await waitFor(() => {
      expect(getUnreadNotifications).toHaveBeenCalled();
      expect(getUnreadNotificationCount).toHaveBeenCalled();
      expect(screen.getByText('Uusi havainto ilmoitukseesi')).toBeInTheDocument();
    });
  });

  test('ilmoituksen klikkaus avaa oikean raportin omiin ilmoituksiin', async () => {
    render(<App />);

    const bellButton = await screen.findByRole('button', {
      name: /avaa ilmoitukset/i
    });

    fireEvent.click(bellButton);
    fireEvent.click(await screen.findByText('Uusi havainto ilmoitukseesi'));

    await waitFor(() => {
      expect(markNotificationAsRead).toHaveBeenCalledWith('notification-1');
      expect(screen.getByTestId('my-reports-sidebar')).toHaveTextContent('focused:report-42');
    });
  });

  test('ei hae ilmoitusmaaraa taustalla ajastetusti', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /avaa ilmoitukset/i })).toBeInTheDocument();
      expect(getUnreadNotificationCount).toHaveBeenCalledTimes(1);
    });

    expect(setIntervalSpy.mock.calls.some(([, delay]) => delay === 30000)).toBe(false);
  });
});
