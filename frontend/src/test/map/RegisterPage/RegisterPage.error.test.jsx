import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RegisterPage from '../../../features/map/ui/RegisterPage.jsx';

vi.mock('../../../features/api/authApi.js', () => ({
  registerUser: vi.fn(() =>
    Promise.reject(new Error('Rekisteröinti epäonnistui'))
  )
}));

vi.mock('../../../features/map/ui/passwordValidation.js', () => ({
  validatePassword: vi.fn(() => ({ isValid: true, rules: [] })),
  passwordsMatch: vi.fn(() => true)
}));

vi.mock('lucide-react', () => ({
  Eye: () => null,
  EyeOff: () => null,
  X: () => null
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('RegisterPage – virhetilanne', () => {
  it('näyttää virheilmoituksen kun rekisteröinti epäonnistuu', async () => {
    render(<RegisterPage />);

    const inputs = document.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: 'testikäyttäjä' } });
    fireEvent.change(inputs[1], { target: { value: 'testi@testi.fi' } });
    fireEvent.change(inputs[2], { target: { value: 'salasana123' } });
    fireEvent.change(inputs[3], { target: { value: 'salasana123' } });
    fireEvent.click(screen.getByRole('button', { name: /luo tili/i }));

    await waitFor(() => {
      expect(screen.getByText('Rekisteröinti epäonnistui')).toBeInTheDocument();
    });
  });
});
