import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import TheftReportDetailsSidebar from '../../../features/map/ui/TheftReportDetailsSidebar';

vi.mock('../../../features/theftReports/api', () => ({
  getTheftReportById: vi.fn(() => new Promise(() => {}))
}));

describe('TheftReportDetailsSidebar - sulkeminen', () => {
  it('kutsuu onClose täsmälleen kerran kun sulkupainiketta klikataan', () => {
    const onCloseMock = vi.fn();

    render(<TheftReportDetailsSidebar reportId="abc123" onClose={onCloseMock} />);

    const closeButton = screen.getByRole('button', { name: 'Sulje' });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
