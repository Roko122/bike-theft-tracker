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

describe('App - auth dialog backdrop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ei sulkeudu taustan klikkauksesta', async () => {
    render(<App />);

    fireEvent.click(
      await screen.findByRole('button', { name: /Kirjaudu tai rekister/i })
    );

    const dialogTitle = screen.getByRole('heading', {
      name: /Kirjaudu tai rekister/i
    });
    expect(dialogTitle).toBeInTheDocument();

    fireEvent.click(document.querySelector('.auth-dialog'));

    expect(
      screen.getByRole('heading', { name: /Kirjaudu tai rekister/i })
    ).toBeInTheDocument();
  });
});
