import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import MapPage from '../../features/map/MapPage';

vi.mock('../../features/theftReports/api', () => ({
  getTheftReports: vi.fn(() => Promise.resolve([]))
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
  TileLayer: ({ children }) => <>{children ?? null}</>,
  Marker: ({ children }) => <>{children ?? null}</>,
  Popup: ({ children }) => <>{children ?? null}</>,
  useMap: () => ({ flyTo: vi.fn() }),
  useMapEvents: () => ({})
}));

describe('MapPage - sijainnin valintaohje', () => {
  it('näkyy kun isPickingLocation on true', () => {
    render(<MapPage isPickingLocation={true} isMenuOpen={false} />);

    expect(
      screen.getByText('Klikkaa karttaa valitaksesi sijainti')
    ).toBeInTheDocument();
  });

  it('ei näy kun isPickingLocation on false', () => {
    render(<MapPage isPickingLocation={false} isMenuOpen={false} />);

    expect(
      screen.queryByText('Klikkaa karttaa valitaksesi sijainti')
    ).not.toBeInTheDocument();
  });
});
