import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import MapPage from '../../../features/map/MapPage.jsx';

vi.mock('../../../features/api/theftReportApi.js', () => ({
  fetchTheftReportMapItemsByBounds: vi.fn(() =>
    Promise.resolve([
      {
        id: 'abc123',
        brand: 'Trek',
        model: 'FX3',
        status: 'ACTIVE',
        location: { latitude: 62.601, longitude: 29.7636 }
      }
    ])
  )
}));

vi.mock('../../../features/map/hooks/useVisibleThefts.js', () => ({
  useVisibleThefts: () => ({
    thefts: [
      {
        id: 'abc123',
        brand: 'Trek',
        model: 'FX3',
        status: 'ACTIVE',
        location: { latitude: 62.601, longitude: 29.7636 }
      }
    ],
    loadVisibleThefts: vi.fn()
  })
}));

vi.mock('../../../features/map/ui/MapControls.jsx', () => ({
  default: () => null
}));

vi.mock('leaflet', () => ({
  __esModule: true,
  default: {
    divIcon: vi.fn(() => ({})),
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn()
      }
    }
  }
}));

vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({
  default: ''
}));
vi.mock('leaflet/dist/images/marker-icon.png', () => ({
  default: ''
}));
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({
  default: ''
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }) => <>{children ?? null}</>,
  Popup: ({ children }) => <>{children ?? null}</>,
  useMap: () => ({ flyTo: vi.fn() }),
  useMapEvents: () => ({})
}));

describe('MapPage - Näytä tiedot -painike', () => {
  it('kutsuu onReportSelected oikealla id:llä kun painiketta klikataan', async () => {
    const onReportSelectedMock = vi.fn();

    render(
      <MapPage isMenuOpen={false} onReportSelected={onReportSelectedMock} />
    );

    await waitFor(() => {
      expect(screen.getByText('Avaa ilmoitus')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Avaa ilmoitus'));

    expect(onReportSelectedMock).toHaveBeenCalledTimes(1);
    expect(onReportSelectedMock).toHaveBeenCalledWith('abc123');
  });
});
