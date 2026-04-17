import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

vi.mock('../../features/map/ui/passwordValidation.js', () => ({
  validatePassword: vi.fn(() => ({ isValid: true, rules: [] })),
  passwordsMatch: vi.fn(() => true)
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('App - register redirect', () => {
  it('palaa rekisteroinnin jalkeen kirjautumisnakymaan', async () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /Kirjaudu tai rekister/i })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Luo tunnus' }));

    const inputs = document.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: 'tester' } });
    fireEvent.change(inputs[1], { target: { value: 'tester@example.com' } });
    fireEvent.change(inputs[2], { target: { value: 'Salasana123!' } });
    fireEvent.change(inputs[3], { target: { value: 'Salasana123!' } });

    fireEvent.click(screen.getByRole('button', { name: /Luo tili/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Kirjaudu' })).toBeInTheDocument();
    });
  });
});
