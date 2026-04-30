import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RegisterPage from '../../../features/map/ui/RegisterPage.jsx';

vi.mock('../../../features/api/authApi.js', () => ({
  registerUser: vi.fn(() => Promise.resolve({ username: 'testikayttaja' }))
}));

vi.mock('../../../features/map/ui/passwordValidation.js', () => ({
  validatePassword: vi.fn(() => ({ isValid: true, rules: [] })),
  passwordsMatch: vi.fn(() => true)
}));

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Eye: () => null,
    EyeOff: () => null,
    Mail: () => null,
    ShieldCheck: () => null,
    UserRound: () => null,
    X: () => null
  };
});

describe('RegisterPage - kenttien nakyvyys', () => {
  it('renderoi kaikki kentat', () => {
    render(<RegisterPage />);

    expect(screen.getByText(/käyttäjätunnus/i)).toBeInTheDocument();
    expect(screen.getByText(/sähköposti/i)).toBeInTheDocument();
    expect(screen.getByText(/^salasana$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /luo tili/i })).toBeInTheDocument();
  });
});
