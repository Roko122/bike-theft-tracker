import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import MapControls from '../../../features/map/ui/MapControls';

vi.mock('lucide-react', () => ({
  LocateFixed: () => <div data-testid="locate-fixed-icon" />
}));

describe('MapControls - napin renderöinti', () => {
  it('näyttää Keskitä sijaintiin napin', () => {
    render(<MapControls onCenterToUser={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: 'Keskitä sijaintiin' })
    ).toBeInTheDocument();
  });
});
