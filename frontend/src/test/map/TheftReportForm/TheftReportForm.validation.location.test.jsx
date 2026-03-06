import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import TheftReportForm from '../../../features/map/ui/TheftReportForm';

vi.mock('../../../features/map/theftReportsApi', () => ({
  createTheftReport: vi.fn(() => Promise.resolve({ id: '1' }))
}));

describe('TheftReportForm - validointi - sijainti puuttuu', () => {
  it('näyttää virheen kun koordinaatit puuttuvat mutta kuvaus ja aika on täytetty', () => {
    const { container } = render(<TheftReportForm />);

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: { value: 'Testikuvaus' }
    });

    fireEvent.change(container.querySelector('input[type="datetime-local"]'), {
      target: { value: '2024-01-01T12:00' }
    });

    fireEvent.click(screen.getByText('Lähetä ilmoitus'));

    if (
      !screen.queryByText('Sijainti puuttuu. Valitse oma sijainti tai kartalta.')
    ) {
      fireEvent.submit(container.querySelector('form'));
    }

    expect(
      screen.getByText('Sijainti puuttuu. Valitse oma sijainti tai kartalta.')
    ).toBeInTheDocument();
  });
});
