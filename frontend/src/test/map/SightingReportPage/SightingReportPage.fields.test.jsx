import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SightingReportPage from '../../../features/map/ui/SightingReportPage.jsx';

vi.mock('../../../features/api/theftReportApi.js', () => ({
  createSightingForReport: vi.fn(() => Promise.resolve({ id: 1 }))
}));

describe('SightingReportPage - kentät ja ohjeet', () => {
  it('näyttää pakollisuusohjeen, sijaintimarkerivihjeen ja sijainnin ennen kuvaa', () => {
    render(
      <SightingReportPage
        reportId="abc123"
        defaultLocation={{ latitude: 60.17, longitude: 24.94 }}
      />
    );

    expect(screen.getByText('* Pakollinen tieto')).toBeInTheDocument();
    expect(screen.getByText(/Mit. havaitsit\?/)).toHaveTextContent(
      /Mit. havaitsit\?\s+\*/
    );
    expect(screen.getByText(/^Sijainti/)).toHaveTextContent(/Sijainti\s+\*/);
    expect(
      screen.getByText(/Valittu sijainti n.kyy kartalla punaisena merkkin./)
    ).toBeInTheDocument();

    const headers = screen.getAllByText(/^(Sijainti|Kuva)$/);
    expect(headers[0]).toHaveTextContent(/Sijainti/);
    expect(headers[1]).toHaveTextContent(/Kuva/);
  });
});
