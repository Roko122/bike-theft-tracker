import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import RegisterPage from '../../../features/map/ui/RegisterPage.jsx';

vi.mock('../../../features/api/authApi.js', () => ({
  registerUser: vi.fn(() => Promise.resolve({ username: 'testikayttaja' })),
  loginUser: vi.fn(() => Promise.resolve({ username: 'testikayttaja' }))
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
    X: () => null
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('RegisterPage - onnistunut rekisterointi', () => {
  it('kutsuu onRegistered kerran automaattisen loginin jalkeen', async () => {
    const onRegisteredMock = vi.fn();

    render(<RegisterPage onRegistered={onRegisteredMock} />);

    const inputs = document.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: 'testikayttaja' } });
    fireEvent.change(inputs[1], { target: { value: 'testi@testi.fi' } });
    fireEvent.change(inputs[2], { target: { value: 'Salasana123!' } });
    fireEvent.change(inputs[3], { target: { value: 'Salasana123!' } });

    fireEvent.click(screen.getByRole('button', { name: /luo tili/i }));

    await waitFor(() => {
      expect(onRegisteredMock).toHaveBeenCalledTimes(1);
      expect(onRegisteredMock).toHaveBeenCalledWith({
        username: 'testikayttaja'
      });
    });
  });
});
