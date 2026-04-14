import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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

describe('RegisterPage – kenttien näkyvyys', () => {
  it('renderöi kaikki kentät', () => {
    render(<RegisterPage />);

    expect(screen.getByText('Käyttäjätunnus')).toBeInTheDocument();
    expect(screen.getByText('Sähköposti')).toBeInTheDocument();
    expect(screen.getByText('Salasana')).toBeInTheDocument();
    expect(screen.getByText('Luo tili')).toBeInTheDocument();
  });
});
