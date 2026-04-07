import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LoginPage from '../../../features/map/ui/loginPage.jsx';

vi.mock('../../../features/api/authApi.js', () => ({
  loginUser: vi.fn(() => Promise.resolve({ username: 'testikäyttäjä' }))
}));

describe('LoginPage – onnistunut kirjautuminen', () => {
  it('kutsuu onLoginSuccess täsmälleen kerran kun kirjautuminen onnistuu', async () => {
    const onLoginSuccessMock = vi.fn();

    render(<LoginPage onLoginSuccess={onLoginSuccessMock} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'testikäyttäjä' }
    });
    fireEvent.change(document.querySelector('input[type="password"]'), {
      target: { value: 'salasana123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /kirjaudu/i }));

    await waitFor(() => {
      expect(onLoginSuccessMock).toHaveBeenCalledTimes(1);
    });
  });
});
