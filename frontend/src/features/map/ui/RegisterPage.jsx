import { useState } from 'react';
import { Eye, EyeOff, Mail, ShieldCheck, UserRound, X } from 'lucide-react';
import { loginUser, registerUser } from '../../api/authApi.js';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import { passwordsMatch, validatePassword } from './passwordValidation.js';

function PasswordToggleButton({ visible, onClick }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      className="auth-input__toggle"
      onClick={onClick}
      aria-label={visible ? t('register.hidePassword') : t('register.showPassword')}
    >
      {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      <span>{visible ? t('register.hide') : t('register.show')}</span>
    </button>
  );
}

export default function RegisterPage({ onRegistered }) {
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValidation = validatePassword(password, t);
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
      setError(t('register.passwordInvalid'));
      return;
    }

    if (!isPasswordMatch) {
      setError(t('register.passwordsDoNotMatch'));
      return;
    }

    try {
      setLoading(true);
      await registerUser({ username, email, password });
      const loggedInUser = await loginUser({ username, password });
      onRegistered?.(loggedInUser);
    } catch (submitError) {
      setError(submitError.message || t('register.error'));
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
          <p className="auth-card__eyebrow">{t('register.eyebrow')}</p>
          <h2 className="auth-card__title">{t('register.title')}</h2>
          <p className="auth-card__subtitle">{t('register.subtitle')}</p>
        </div>
      </div>

      {error && <div className="auth-alert auth-alert--danger">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="auth-field__label">{t('register.username')}</span>
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
          <span className="auth-field__label">{t('register.email')}</span>
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
          <span className="auth-field__label">{t('register.password')}</span>
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
          <span className="auth-field__label">{t('register.confirmPassword')}</span>
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
                <span>{t('register.passwordMismatch')}</span>
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
            <span>{loading ? t('register.creating') : t('register.create')}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
