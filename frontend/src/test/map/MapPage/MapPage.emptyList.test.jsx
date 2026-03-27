import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import MapPage from '../../../features/map/MapPage';
import { getTheftReports } from '../../../features/api/theftReportApi.js';

vi.mock('../../../features/theftReports/api', () => ({
  getTheftReports: vi.fn(() => Promise.resolve([]))
}));

vi.mock('../../../features/map/ui/MapControls', () => ({
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
  Marker: () => <div data-testid="marker" />,
  Popup: ({ children }) => <>{children ?? null}</>,
  useMap: () => null,
  useMapEvents: () => ({})
}));

describe('MapPage - tyhjä lista', () => {
  it('ei renderöi yhtään markkeria kun lista on tyhjä', async () => {
    render(<MapPage isMenuOpen={false} />);

    await waitFor(() => {
      expect(getTheftReports).toHaveBeenCalled();
    });

    expect(screen.queryAllByTestId('marker')).toHaveLength(0);
  });
});
