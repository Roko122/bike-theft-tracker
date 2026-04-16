import { useState } from 'react';
import { Eye, EyeOff, Mail, ShieldCheck, UserRound, X } from 'lucide-react';
import { registerUser } from '../../api/authApi.js';
import { passwordsMatch, validatePassword } from './passwordValidation.js';

function PasswordToggleButton({ visible, onClick }) {
  return (
    <button
      type="button"
      className="auth-input__toggle"
      onClick={onClick}
      aria-label={visible ? 'Piilota salasana' : 'Näytä salasana'}
    >
      {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      <span>{visible ? 'Piilota' : 'Näytä'}</span>
    </button>
  );
}

export default function RegisterPage({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValidation = validatePassword(password);
  const unmetPasswordRules = passwordValidation.rules.filter(
    (rule) => !rule.passed
  );
  const isPasswordValid = passwordValidation.isValid;
  const isPasswordMatch = passwordsMatch(password, confirmPassword);
  const showPasswordMismatch = confirmPassword.length > 0 && !isPasswordMatch;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Salasana ei täytä vaatimuksia');
      return;
    }

    if (!isPasswordMatch) {
      setError('Salasanat eivät täsmää');
      return;
    }

    try {
      setLoading(true);
      const result = await registerUser({ username, email, password });
      onRegistered?.(result);
    } catch (submitError) {
      setError(submitError.message || 'Rekisteröinti epäonnistui');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card auth-card--wide">
      <div className="auth-card__hero">
        <div className="auth-card__icon">
          <ShieldCheck size={20} />
        </div>
        <div className="auth-card__hero-copy">
          <p className="auth-card__eyebrow">Uusi käyttäjä</p>
          <h2 className="auth-card__title">Luo tunnus</h2>
          <p className="auth-card__subtitle">
            Rekisteröidy, jotta voit lisätä omia ilmoituksia ja hallita niitä.
          </p>
        </div>
      </div>

      {error && <div className="auth-alert auth-alert--danger">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="auth-field__label">Käyttäjätunnus</span>
          <div className="auth-input-wrap">
            <UserRound size={16} className="auth-input-wrap__icon" />
            <input
              className="auth-input auth-input--with-leading-icon"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
        </label>

        <label className="auth-field">
          <span className="auth-field__label">Sähköposti</span>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-wrap__icon" />
            <input
              className="auth-input auth-input--with-leading-icon"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </label>

        <label className="auth-field">
          <span className="auth-field__label">Salasana</span>
          <div className="auth-input-wrap">
            <input
              className="auth-input auth-input--with-trailing-action"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <PasswordToggleButton
              visible={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            />
          </div>
          {unmetPasswordRules.length > 0 && (
            <div className="auth-helper-list">
              {unmetPasswordRules.map((rule) => (
                <div key={rule.key} className="auth-helper-list__item">
                  <X size={14} />
                  <span>{rule.label}</span>
                </div>
              ))}
            </div>
          )}
        </label>

        <label className="auth-field">
          <span className="auth-field__label">Salasana uudelleen</span>
          <div className="auth-input-wrap">
            <input
              className="auth-input auth-input--with-trailing-action"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <PasswordToggleButton
              visible={showConfirmPassword}
              onClick={() => setShowConfirmPassword((value) => !value)}
            />
          </div>
          {showPasswordMismatch && (
            <div className="auth-helper-list">
              <div className="auth-helper-list__item">
                <X size={14} />
                <span>Salasanat eivät ole samat</span>
              </div>
            </div>
          )}
        </label>

        <div className="auth-actions">
          <button
            type="submit"
            className="app-btn app-btn--primary app-btn--wide"
            disabled={loading || !isPasswordValid || !isPasswordMatch}
          >
            <span>{loading ? 'Luodaan tiliä...' : 'Luo tili'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
