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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('App - login flash message', () => {
  it('nayttaa onnistumisviestin kirjautumisen jalkeen', async () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /Kirjaudu tai rekister/i })
    );

    const inputs = document.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'tester' } });
    fireEvent.change(inputs[1], { target: { value: 'salasana123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Kirjaudu' }));

    await waitFor(() => {
      expect(screen.getByText('Kirjautuminen onnistui.')).toBeInTheDocument();
    });
  });
});
