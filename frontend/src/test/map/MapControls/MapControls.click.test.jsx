import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import MapControls from '../../../features/map/ui/MapControls';

vi.mock('lucide-react', () => ({
  LocateFixed: () => <div data-testid="locate-fixed-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />
}));

describe('MapControls - napin klikkaus', () => {
  it('kutsuu control-callbackit täsmälleen kerran', () => {
    const onCenterToUserMock = vi.fn();
    const onZoomInMock = vi.fn();
    const onZoomOutMock = vi.fn();

    render(
      <MapControls
        onCenterToUser={onCenterToUserMock}
        onZoomIn={onZoomInMock}
        onZoomOut={onZoomOutMock}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Keskitä sijaintiin' })
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Suurenna karttaa' })
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Pienennä karttaa' })
    );

    expect(onCenterToUserMock).toHaveBeenCalledTimes(1);
    expect(onZoomInMock).toHaveBeenCalledTimes(1);
    expect(onZoomOutMock).toHaveBeenCalledTimes(1);
  });
});
