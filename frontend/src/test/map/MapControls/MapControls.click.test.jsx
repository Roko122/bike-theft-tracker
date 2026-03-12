import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import MapControls from '../../../features/map/ui/MapControls';

vi.mock('lucide-react', () => ({
  LocateFixed: () => <div data-testid="locate-fixed-icon" />
}));

describe('MapControls - napin klikkaus', () => {
  it('kutsuu onCenterToUser täsmälleen kerran kun nappia klikataan', () => {
    const onCenterToUserMock = vi.fn();

    render(<MapControls onCenterToUser={onCenterToUserMock} />);

    const button = screen.getByRole('button', { name: 'Keskitä sijaintiin' });
    fireEvent.click(button);

    expect(onCenterToUserMock).toHaveBeenCalledTimes(1);
  });
});
