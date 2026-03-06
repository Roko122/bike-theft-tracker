import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import TheftReportForm from '../../../features/map/ui/TheftReportForm';

vi.mock('../../../features/map/theftReportsApi', () => ({
  createTheftReport: vi.fn(() => Promise.resolve({ id: '1' }))
}));

describe('TheftReportForm - validointi - varkauden aika puuttuu', () => {
  it('näyttää virheen kun varkauden aika on tyhjä ja kuvaus on täytetty', () => {
    const { container } = render(<TheftReportForm />);

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: { value: 'Testikuvaus' }
    });

    fireEvent.click(screen.getByText('Lähetä ilmoitus'));

    if (!screen.queryByText('Varkauden aika on pakollinen.')) {
      fireEvent.submit(container.querySelector('form'));
    }

    expect(screen.getByText('Varkauden aika on pakollinen.')).toBeInTheDocument();
  });
});
