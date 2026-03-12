import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import MapPage from '../../features/map/MapPage';

vi.mock('../../features/theftReports/api', () => ({
  getTheftReports: vi.fn(() => Promise.resolve([]))
}));

vi.mock('../../features/map/ui/MapControls', () => ({
  default: () => <div data-testid="map-controls" />
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
  Marker: ({ children }) => <>{children ?? null}</>,
  Popup: ({ children }) => <>{children ?? null}</>,
  useMap: () => null,
  useMapEvents: () => null
}));

describe('MapPage - MapControls näkyvyys', () => {
  it('näkyy kun isMenuOpen on false', () => {
    render(<MapPage isMenuOpen={false} />);

    expect(screen.getByTestId('map-controls')).toBeInTheDocument();
  });

  it('ei näy kun isMenuOpen on true', () => {
    render(<MapPage isMenuOpen={true} />);

    expect(screen.queryByTestId('map-controls')).not.toBeInTheDocument();
  });
});
