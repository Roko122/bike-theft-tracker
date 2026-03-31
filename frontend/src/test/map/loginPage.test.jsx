import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import LoginPage from '../../features/map/ui/loginPage';
import { fireEvent } from '@testing-library/react';

vi.mock('../../features/map/ui/auth.Api', () => ({
  loginUser: vi.fn()
}));

test('näyttää kirjautumissivun', () => {
  render(<LoginPage />);
  expect(screen.getByText(/kirjaudu sisään/i)).toBeInTheDocument();
});

test('näyttää käyttäjänimi- ja salasanakentät sekä napit', () => {
  render(<LoginPage />);

  expect(screen.getByText(/käyttäjänimi/i)).toBeInTheDocument();
  expect(screen.getByText(/salasana/i)).toBeInTheDocument();

  const textInput = screen.getByRole('textbox');
  expect(textInput).toBeInTheDocument();

  const passwordInput = document.querySelector('input[type="password"]');
  expect(passwordInput).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: /^kirjaudu$/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /luo tunnus/i })
  ).toBeInTheDocument();
});

test('kutsuu onFirstTime-funktiota kun painetaan Luo tunnus', () => {
  const onFirstTime = vi.fn();

  render(<LoginPage onFirstTime={onFirstTime} />);

  fireEvent.click(screen.getByRole('button', { name: /luo tunnus/i }));

  expect(onFirstTime).toHaveBeenCalledTimes(1);
});
