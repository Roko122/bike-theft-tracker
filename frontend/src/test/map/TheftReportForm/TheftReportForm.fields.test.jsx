import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TheftReportForm from '../../../features/map/ui/TheftReportForm.jsx';

describe('TheftReportForm - kenttien näkyvyys', () => {
  it('näyttää pakollisuusohjeen, tähdet, markerivihjeen ja esimerkkiplaceholderit', () => {
    render(
      <TheftReportForm defaultLocation={{ latitude: 60.17, longitude: 24.94 }} />
    );

    expect(screen.getByText('* Pakollinen tieto')).toBeInTheDocument();

    expect(screen.getByText(/Kuvaus varkaudesta/)).toHaveTextContent(
      /Kuvaus varkaudesta\s+\*/
    );
    expect(screen.getAllByText(/Tapahtuma-aika/)[0]).toHaveTextContent(
      'Tapahtuma-aika *'
    );
    expect(screen.getByText(/Sijainti/)).toHaveTextContent('Sijainti *');
    expect(screen.getByText(/^Merkki/)).toHaveTextContent('Merkki *');
    expect(screen.getByText(/^Malli/)).toHaveTextContent('Malli *');
    expect(screen.getByText(/^Tyyppi/)).toHaveTextContent('Tyyppi *');
    expect(screen.getByText(/^V.ri/)).toHaveTextContent(/V.ri\s+\*/);
    expect(screen.getByText(/Kuvaus py.r.st./)).toHaveTextContent(
      /Kuvaus py.r.st.\s+\*/
    );

    expect(
      screen.getByText(/Valittu sijainti n.kyy kartalla punaisena merkkin./)
    ).toBeInTheDocument();

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
