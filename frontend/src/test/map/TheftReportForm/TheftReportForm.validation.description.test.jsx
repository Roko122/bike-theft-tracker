import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import TheftReportForm from '../../../features/map/ui/TheftReportForm';

vi.mock('../../../features/map/theftReportsApi', () => ({
  createTheftReport: vi.fn(() => Promise.resolve({ id: '1' }))
}));

describe('TheftReportForm - validointi - kuvaus puuttuu', () => {
  it('näyttää virheen kun kuvaus on tyhjä ja lomake lähetetään', () => {
    const { container } = render(<TheftReportForm />);

    fireEvent.click(screen.getByText('Lähetä ilmoitus'));

    if (!screen.queryByText('Kuvaus on pakollinen.')) {
      fireEvent.submit(container.querySelector('form'));
    }

    expect(screen.getByText('Kuvaus on pakollinen.')).toBeInTheDocument();
  });
});
