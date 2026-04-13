import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import RegisterPage from '../../../features/map/ui/RegisterPage.jsx';

vi.mock('../../../features/api/authApi.js', () => ({
  registerUser: vi.fn(() => Promise.resolve({ username: 'testikäyttäjä' }))
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

describe('RegisterPage – onnistunut rekisteröinti', () => {
  it('kutsuu onRegistered täsmälleen kerran kun rekisteröinti onnistuu', async () => {
    const onRegisteredMock = vi.fn();

    render(<RegisterPage onRegistered={onRegisteredMock} />);

    // Liitetään labelit inputteihin testissä, koska komponentissa ei ole controlId/htmlFor-sidontaa.
    const usernameLabel = screen.getByText(/käyttäjätunnus/i, {
      selector: 'label'
    });
    const emailLabel = screen.getByText(/sähköposti/i, { selector: 'label' });
    const passwordLabel = screen.getByText(/salasana$/i, { selector: 'label' });
    const confirmPasswordLabel = screen.getByText(/salasana uudelleen/i, {
      selector: 'label'
    });

    const inputs = document.querySelectorAll('input');
    const usernameInput = inputs[0];
    const emailInput = inputs[1];
    const passwordInput = inputs[2];
    const confirmPasswordInput = inputs[3];

    usernameInput.id = 'register-username';
    usernameLabel.setAttribute('for', 'register-username');
    emailInput.id = 'register-email';
    emailLabel.setAttribute('for', 'register-email');
    passwordInput.id = 'register-password';
    passwordLabel.setAttribute('for', 'register-password');
    confirmPasswordInput.id = 'register-confirm-password';
    confirmPasswordLabel.setAttribute('for', 'register-confirm-password');

    fireEvent.change(screen.getByLabelText(/käyttäjätunnus/i), {
      target: { value: 'testikäyttäjä' }
    });
    fireEvent.change(screen.getByLabelText(/sähköposti/i), {
      target: { value: 'testi@testi.fi' }
    });
    fireEvent.change(screen.getByLabelText(/salasana$/i), {
      target: { value: 'Salasana123!' }
    });
    fireEvent.change(screen.getByLabelText(/salasana uudelleen/i), {
      target: { value: 'Salasana123!' }
    });

    fireEvent.click(screen.getByRole('button', { name: /luo tili/i }));

    await waitFor(() => {
      expect(onRegisteredMock).toHaveBeenCalledTimes(1);
    });
  });
});
