import { Bike, LogIn, LogOut, Menu, X } from 'lucide-react';
import NotificationMenu from './NotificationMenu.jsx';
import UserBadge from './UserBadge.jsx';

function LanguageSwitch({ language, onChange, label }) {
  return (
    <div className="language-switch" role="group" aria-label={label}>
      <button
        type="button"
        className={
          language === 'fi'
            ? 'language-switch__button language-switch__button--active'
            : 'language-switch__button'
        }
        onClick={() => onChange('fi')}
      >
        FI
      </button>
      <button
        type="button"
        className={
          language === 'en'
            ? 'language-switch__button language-switch__button--active'
            : 'language-switch__button'
        }
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </div>
  );
}

function HeaderActions({
  currentUser,
  language,
  onLanguageChange,
  onLogout,
  onOpenLogin,
  onOpenMyReports,
  t
}) {
  return (
    <div className="header-actions">
      <LanguageSwitch
        language={language}
        onChange={onLanguageChange}
        label={t('common.language')}
      />

      {currentUser ? (
        <>
          <NotificationMenu
            currentUser={currentUser}
            onOpenReport={onOpenMyReports}
          />
          <UserBadge user={currentUser} />
          <button
            type="button"
            className="app-btn app-btn--secondary"
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>{t('app.logout')}</span>
          </button>
        </>
      ) : (
        <button
          type="button"
          className="app-btn app-btn--secondary"
          onClick={onOpenLogin}
        >
          <LogIn size={18} />
          <span>{t('app.loginOrRegister')}</span>
        </button>
      )}
    </div>
  );
}

export default function AppHeader({
  currentUser,
  isMenuOpen,
  language,
  onLanguageChange,
  onLogout,
  onOpenLogin,
  onOpenMyReports,
  onToggleMenu,
  t,
  children
}) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onToggleMenu}>
        <span className="visually-hidden">
          {isMenuOpen ? t('app.closeMenu') : t('app.openMenu')}
        </span>
        {isMenuOpen ? <X /> : <Menu />}
      </button>

      <div className="title">
        <Bike size={20} />
        <strong>{t('common.appName')}</strong>
      </div>

      <HeaderActions
        currentUser={currentUser}
        language={language}
        onLanguageChange={onLanguageChange}
        onLogout={onLogout}
        onOpenLogin={onOpenLogin}
        onOpenMyReports={onOpenMyReports}
        t={t}
      />

      {children}
    </header>
  );
}
