import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TheftReportForm from '../../../features/map/ui/TheftReportForm.jsx';

describe('TheftReportForm - validointi - pakolliset pyörätiedot', () => {
  it('näyttää virheen jos merkki puuttuu', async () => {
    render(
      <TheftReportForm
        defaultLocation={{ latitude: 62.601, longitude: 29.7636 }}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Esim\..*14\.00-14\.30\./),
      { target: { value: 'Pyörä vietiin pihasta.' } }
    );

    fireEvent.change(screen.getByPlaceholderText(/Esim\. Trail 7/), {
      target: { value: 'Trail 7' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Esim\. Maastopy.r./), {
      target: { value: 'Maastopyörä' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Esim\. Sininen/), {
      target: { value: 'Sininen' }
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Esim\..*Etukori.*harmaat renkaat\./),
      { target: { value: 'Etukori ja tarakka.' } }
    );

    fireEvent.click(screen.getByRole('button', { name: /L.het. ilmoitus/ }));

    expect(await screen.findByText(/Py.r.n merkki on pakollinen\./)).toBeInTheDocument();
  });
});
