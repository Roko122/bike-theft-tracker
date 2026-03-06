import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import TheftReportForm from '../../../features/map/ui/TheftReportForm';

vi.mock('../../../features/map/theftReportsApi', () => ({
  createTheftReport: vi.fn(() => Promise.resolve({ id: '1' }))
}));

describe('TheftReportForm - kenttien näkyvyys', () => {
  it('näyttää kaikki pyydetyt kenttätekstit', () => {
    render(<TheftReportForm />);

    expect(screen.getByText('Kuvaus')).toBeInTheDocument();
    expect(screen.getByText('Varkauden aika')).toBeInTheDocument();
    expect(screen.getByText('Osoite')).toBeInTheDocument();
    expect(screen.getByText('Merkki')).toBeInTheDocument();
    expect(screen.getByText('Malli')).toBeInTheDocument();
    expect(screen.getByText('Tyyppi')).toBeInTheDocument();
    expect(screen.getByText('Väri')).toBeInTheDocument();
    expect(screen.getByText('Sarjanumero')).toBeInTheDocument();
    expect(screen.getByText('Käyttäjänimi')).toBeInTheDocument();
    expect(screen.getByText('Sähköposti')).toBeInTheDocument();
    expect(screen.getByText('Lähetä ilmoitus')).toBeInTheDocument();
  });
});
