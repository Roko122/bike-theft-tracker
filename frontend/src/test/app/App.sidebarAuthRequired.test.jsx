import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App.jsx';

vi.mock('../../features/map/MapPage.jsx', () => ({
  default: () => <div data-testid="map-page" />
}));

vi.mock('../../features/api/authApi.js', () => ({
  getCurrentUser: vi.fn(() => Promise.reject(new Error('SESSION_EXPIRED'))),
  loginUser: vi.fn(() => Promise.resolve({ username: 'tester' })),
  logoutUser: vi.fn(() => Promise.resolve(null)),
  registerUser: vi.fn(() => Promise.resolve({ username: 'tester' }))
}));

describe('App - ilmoituspainike kirjautumattomana', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('on disabloitu mutta kirjautumislinkki pysyy käytettävissä', async () => {
    render(<App />);

    fireEvent.click(await screen.findByRole('button', { name: /Avaa valikko/i }));

    expect(
      screen.getByRole('button', { name: /Uusi varkausilmoitus/i })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /Kirjaudu sisään/i }));

    expect(
      screen.getByRole('heading', { name: /Kirjaudu tai rekister/i })
    ).toBeInTheDocument();
  });
});
