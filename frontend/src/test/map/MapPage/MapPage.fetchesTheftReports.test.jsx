import { render, waitFor } from '@testing-library/react';
import MapPage from '../../features/map/MapPage';
import { getTheftReports } from '../../features/theftReports/api';
import { vi } from 'vitest';

vi.mock('../../features/theftReports/api', () => ({
  getTheftReports: vi.fn()
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
  default: 'marker-icon-2x.png'
}));
vi.mock('leaflet/dist/images/marker-icon.png', () => ({
  default: 'marker-icon.png'
}));
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({
  default: 'marker-shadow.png'
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({ flyTo: vi.fn() }),
  useMapEvents: () => ({})
}));

describe('MapPage', () => {
  it('calls getTheftReports when MapPage mounts', async () => {
    // Arrange
    getTheftReports.mockResolvedValue([]);

    // Act
    render(<MapPage isMenuOpen={false} />);

    // Assert
    await waitFor(() => {
      expect(getTheftReports).toHaveBeenCalledTimes(1);
    });
  });
});
