import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MapPage from '../../../features/map/MapPage.jsx';

vi.mock('../../../features/map/hooks/useVisibleThefts.js', () => ({
  useVisibleThefts: () => ({
    thefts: [],
    loadVisibleThefts: vi.fn()
  })
}));

vi.mock('leaflet', () => ({
  __esModule: true,
  default: {
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn()
      }
    },
    divIcon: vi.fn(() => ({}))
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
  Marker: ({ icon }) => (
    <div data-testid={icon ? 'marker' : 'marker-without-icon'}></div>
  ),
  Popup: ({ children }) => <>{children ?? null}</>,
  useMap: () => ({
    setView: vi.fn()
  }),
  useMapEvents: () => ({})
}));

describe('MapPage - user location marker', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(globalThis.navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn((success) =>
          success({
            coords: { latitude: 60.17, longitude: 24.94 }
          })
        )
      }
    });
  });

  it('näyttää käyttäjän sijaintimarkkerin automaattisesti kun sijainti saadaan', async () => {
    render(<MapPage isMenuOpen={false} />);

    await waitFor(() => {
      expect(screen.getAllByTestId('marker')).toHaveLength(1);
    });
  });
});
