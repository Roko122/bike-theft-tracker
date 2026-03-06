import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TheftReportForm from '../../../features/map/ui/TheftReportForm';
import { createTheftReport } from '../../../features/map/theftReportsApi';

vi.mock('../../../features/map/theftReportsApi', () => ({
  createTheftReport: vi.fn(() => Promise.resolve({ id: 'xyz789' }))
}));

describe('TheftReportForm - onnistunut lähetys', () => {
  it('kutsuu createTheftReport kerran oikealla payloadilla ja näyttää onnistumisviestin', async () => {
    const { container } = render(
      <TheftReportForm defaultLocation={{ latitude: 62.601, longitude: 29.7636 }} />
    );

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: { value: 'Testikuvaus' }
    });

    fireEvent.change(container.querySelector('input[type="datetime-local"]'), {
      target: { value: '2024-01-01T12:00' }
    });

    fireEvent.click(screen.getByText('Lähetä ilmoitus'));

    if (!createTheftReport.mock.calls.length) {
      fireEvent.submit(container.querySelector('form'));
    }

    await waitFor(() => {
      expect(
        screen.getByText((text) => text.includes('Ilmoitus tallennettu'))
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText((text) => text.includes('Ilmoitus tallennettu'))
    ).toBeInTheDocument();

    expect(createTheftReport).toHaveBeenCalledTimes(1);
    expect(createTheftReport).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Testikuvaus',
        location: expect.objectContaining({
          latitude: 62.601,
          longitude: 29.7636
        })
      })
    );
  });
});
