import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import MapControls from '../../../features/map/ui/MapControls';

vi.mock('lucide-react', () => ({
  LocateFixed: () => <div data-testid="locate-fixed-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />
}));

describe('MapControls - napin renderointi', () => {
  it('näyttää kartan ohjausnapit', () => {
    render(
      <MapControls
        onCenterToUser={vi.fn()}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Keskitä sijaintiin' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Suurenna karttaa' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Pienennä karttaa' })
    ).toBeInTheDocument();
  });
});
