import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import MapPage from '../../features/map/MapPage';

vi.mock('../../features/theftReports/api', () => ({
  getTheftReports: vi.fn(() =>
    Promise.resolve([
      {
        id: 'valid-1',
        brand: 'Trek',
        model: 'FX3',
        location: { latitude: 62.601, longitude: 29.7636 }
      },
      {
        id: 'null-coordinates',
        brand: 'Cannondale',
        model: 'Quick',
        location: { latitude: null, longitude: null }
      },
      {
        id: 'missing-location',
        brand: 'Specialized',
        model: 'Sirrus'
      }
    ])
  )
}));

vi.mock('../../features/map/ui/MapControls', () => ({
  default: () => null
}));

vi.mock('leaflet', () => ({
  __esModule: true,
  default: {
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
  Marker: () => <div data-testid="marker" />,
  Popup: ({ children }) => <>{children ?? null}</>,
  useMap: () => ({ flyTo: vi.fn() }),
  useMapEvents: () => ({})
}));

describe('MapPage - markerien renderöinti', () => {
  it('renderöi markkerit vain validilla sijainnilla varustetuille ilmoituksille', async () => {
    render(<MapPage isMenuOpen={false} />);

    await waitFor(() => {
      expect(screen.getAllByTestId('marker')).toHaveLength(1);
    });
  });

  it('ei renderöi markkeria ilmoitukselle jolta puuttuu koordinaatit', async () => {
    render(<MapPage isMenuOpen={false} />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('marker')).toHaveLength(1);
    });

    expect(screen.queryAllByTestId('marker')).toHaveLength(1);
    expect(screen.queryAllByTestId('marker')).not.toHaveLength(3);
  });
});
