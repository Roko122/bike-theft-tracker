import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LoginPage from '../../../features/map/ui/loginPage.jsx';

vi.mock('../../../features/api/authApi.js', () => ({
  loginUser: vi.fn(() =>
    Promise.reject(new Error('Kirjautuminen epäonnistui'))
  )
}));

describe('LoginPage – virhetilanne', () => {
  it('näyttää virheilmoituksen kun kirjautuminen epäonnistuu', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'testikäyttäjä' }
    });
    fireEvent.change(document.querySelector('input[type="password"]'), {
      target: { value: 'väärä' }
    });
    fireEvent.click(screen.getByRole('button', { name: /kirjaudu/i }));

    await waitFor(() => {
      expect(screen.getByText('Kirjautuminen epäonnistui')).toBeInTheDocument();
    });
  });
});
