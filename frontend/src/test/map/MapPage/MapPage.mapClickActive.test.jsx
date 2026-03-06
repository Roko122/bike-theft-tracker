import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';

import MapPage from '../../features/map/MapPage';

let capturedHandler = {};

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
  useMapEvents: (handlers) => {
    capturedHandler = handlers;
    return {};
  }
}));

beforeEach(() => {
  capturedHandler = {};
});

describe('MapPage - karttaklikki aktiivinen', () => {
  it('kutsuu onLocationSelected oikeilla koordinaateilla kun isPickingLocation on true', async () => {
    const onLocationSelectedMock = vi.fn();

    render(
      <MapPage
        isPickingLocation={true}
        onLocationSelected={onLocationSelectedMock}
      />
    );

    await waitFor(() => {
      expect(capturedHandler.click).toBeDefined();
    });

    capturedHandler.click({ latlng: { lat: 62.601, lng: 29.7636 } });

    expect(onLocationSelectedMock).toHaveBeenCalledTimes(1);
    expect(onLocationSelectedMock).toHaveBeenCalledWith({
      latitude: 62.601,
      longitude: 29.7636
    });
  });
});
