import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MapPage from '../../features/map/MapPage';

let capturedHandler = {};

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
  TileLayer: () => null,
  Marker: ({ children }) => <>{children ?? null}</>,
  Popup: ({ children }) => <>{children ?? null}</>,
  useMap: () => ({ flyTo: vi.fn() }),
  useMapEvents: (handlers) => {
    capturedHandler = handlers;
    return {};
  }
}));

beforeEach(() => {
  capturedHandler = {};
});

describe('MapPage - karttaklikki', () => {
  it('ei kutsu onLocationSelected kun isPickingLocation on false', () => {
    const onLocationSelectedMock = vi.fn();

    render(
      <MapPage
        isMenuOpen={false}
        isPickingLocation={false}
        onLocationSelected={onLocationSelectedMock}
      />
    );

    capturedHandler.click({
      latlng: { latitude: 62.601, longitude: 29.7636 }
    });

    expect(onLocationSelectedMock).toHaveBeenCalledTimes(0);
  });
});
