import { useState } from 'react';
import { LogIn, UserRound } from 'lucide-react';
import { loginUser } from '../../api/authApi.js';

export default function LoginPage({ onLoginSuccess, onFirstTime }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      const user = await loginUser({ username, password });
      onLoginSuccess?.(user);
    } catch (submitError) {
      setError(submitError.message || 'Kirjautuminen epäonnistui');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <div className="auth-card__hero">
        <div className="auth-card__icon">
          <UserRound size={20} />
        </div>
        <div className="auth-card__hero-copy">
          <p className="auth-card__eyebrow">Tervetuloa takaisin</p>
          <h2 className="auth-card__title">Kirjaudu sisään</h2>
          <p className="auth-card__subtitle">
            Hallitse ilmoituksia ja lisää uusia varkauksia kartalle.
          </p>
        </div>
      </div>

      {error && <div className="auth-alert auth-alert--danger">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="auth-field__label">Käyttäjänimi</span>
          <input
            className="auth-input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>

        <label className="auth-field">
          <span className="auth-field__label">Salasana</span>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <div className="auth-actions">
          <button
            type="submit"
            className="app-btn app-btn--primary app-btn--wide"
            disabled={loading}
          >
            <LogIn size={18} />
            <span>{loading ? 'Kirjaudutaan...' : 'Kirjaudu'}</span>
          </button>

          <button
            type="button"
            className="app-btn app-btn--secondary app-btn--wide"
            onClick={() => onFirstTime?.()}
          >
            <span>Luo tunnus</span>
          </button>
        </div>
      </form>
    </section>
  );
}
