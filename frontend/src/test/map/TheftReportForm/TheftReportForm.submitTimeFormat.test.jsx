import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import TheftReportForm from '../../../features/map/ui/TheftReportForm.jsx';
import { createTheftReport } from '../../../features/api/theftReportApi.js';

vi.mock('../../../features/api/theftReportApi.js', () => ({
  createTheftReport: vi.fn(() => Promise.resolve({ id: 'xyz789' }))
}));

describe('TheftReportForm - theftTime payload format', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 30, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sends the selected local theft time without a timezone conversion', async () => {
    const { container } = render(
      <TheftReportForm defaultLocation={{ latitude: 60.17, longitude: 24.94 }} />
    );

    fireEvent.change(screen.getByPlaceholderText(/Pyörä varastettiin/i), {
      target: { value: 'Pyora vietiin pihasta iltapaivalla.' }
    });
    fireEvent.change(container.querySelector('.report-time-select__input'), {
      target: { value: '15:00' }
    });
    fireEvent.change(screen.getByPlaceholderText('Esim. Helkama'), {
      target: { value: 'Helkama' }
    });
    fireEvent.change(screen.getByPlaceholderText('Esim. Trail 7'), {
      target: { value: 'Jopo' }
    });
    fireEvent.change(screen.getByPlaceholderText('Esim. Maastopyörä'), {
      target: { value: 'Hybridipyörä' }
    });
    fireEvent.change(screen.getByPlaceholderText('Esim. Sininen'), {
      target: { value: 'Musta' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Ruosteinen mutta hyvässä kunnossa/i), {
      target: { value: 'Tarakka ja etukori.' }
    });

    await act(async () => {
      fireEvent.submit(container.querySelector('form'));
      await vi.runAllTimersAsync();
    });

    expect(createTheftReport).toHaveBeenCalledTimes(1);
    expect(createTheftReport).toHaveBeenCalledWith(
      expect.objectContaining({
        theftTime: '2026-04-30T15:00:00'
      }),
      []
    );
  });
});
