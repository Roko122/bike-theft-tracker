import { useI18n } from '../i18n/LanguageContext.jsx';

export default function UserBadge({ user }) {
  const { t } = useI18n();
  const label = user?.username ?? 'User';
  const initials = label.slice(0, 2).toUpperCase();

  return (
    <div className="header-user-badge" title={label}>
      <div className="header-user-badge__avatar">{initials}</div>
      <div className="header-user-badge__content">
        <span className="header-user-badge__label">{t('app.loggedIn')}</span>
        <strong>{label}</strong>
      </div>
    </div>
  );
}
