import { ArrowLeft, X } from 'lucide-react';
import LoginPage from '../../map/ui/LoginPage.jsx';
import RegisterPage from '../../map/ui/RegisterPage.jsx';

export default function AuthDialog({
  mode,
  onClose,
  onLoginSuccess,
  onOpenRegister,
  onBackToLogin,
  onRegisterSuccess
}) {
  const isLogin = mode === 'login';
  const title = isLogin ? 'Kirjaudu tai rekisteröidy' : 'Luo tunnus';

  return (
    <div className="auth-dialog" onClick={onClose}>
      <div className="auth-dialog__panel" onClick={(event) => event.stopPropagation()}>
        <div className="auth-dialog__header">
          <div>
            <p className="auth-dialog__eyebrow">Käyttäjätili</p>
            <h2 className="auth-dialog__title">{title}</h2>
          </div>

          <div className="auth-dialog__actions">
            {!isLogin && (
              <button
                type="button"
                className="app-btn app-btn--ghost auth-dialog__back"
                onClick={onBackToLogin}
              >
                <ArrowLeft size={18} />
                <span>Takaisin</span>
              </button>
            )}

            <button
              type="button"
              className="menu-btn auth-dialog__close"
              onClick={onClose}
              aria-label="Sulje kirjautumisikkuna"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {isLogin ? (
          <LoginPage
            onLoginSuccess={onLoginSuccess}
            onFirstTime={onOpenRegister}
          />
        ) : (
          <RegisterPage onRegistered={onRegisterSuccess} />
        )}
      </div>
    </div>
  );
}
