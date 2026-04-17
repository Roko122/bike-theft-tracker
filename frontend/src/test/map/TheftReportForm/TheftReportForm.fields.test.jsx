import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TheftReportForm from '../../../features/map/ui/TheftReportForm.jsx';

describe('TheftReportForm - kenttien näkyvyys', () => {
  it('näyttää pakollisuusohjeen, tähdet ja esimerkkiplaceholderit', () => {
    render(<TheftReportForm />);

    expect(screen.getByText('* Pakollinen tieto')).toBeInTheDocument();

    expect(screen.getByText(/Kuvaus/)).toHaveTextContent('Kuvaus *');
    expect(screen.getAllByText(/Tapahtuma-aika/)[0]).toHaveTextContent(
      'Tapahtuma-aika *'
    );
    expect(screen.getByText(/Sijainti/)).toHaveTextContent('Sijainti *');
    expect(screen.getByText(/^Merkki/)).toHaveTextContent('Merkki *');
    expect(screen.getByText(/^Malli/)).toHaveTextContent('Malli *');
    expect(screen.getByText(/^Tyyppi/)).toHaveTextContent('Tyyppi *');
    expect(screen.getByText(/^V.ri/)).toHaveTextContent(/V.ri\s+\*/);
    expect(screen.getByText(/Lis.kuvaus py.r.st./)).toHaveTextContent(
      /Lis.kuvaus py.r.st.\s+\*/
    );

    expect(screen.getByText(/^Osoite$/)).toBeInTheDocument();
    expect(screen.getByText(/^Sarjanumero$/)).toBeInTheDocument();
    expect(screen.getByText(/^Kuvat$/)).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Esim\..*14\.00-14\.30\./)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Esim. Kauppakatu 29')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Esim. Helkama')).toBeInTheDocument();
  });
});
