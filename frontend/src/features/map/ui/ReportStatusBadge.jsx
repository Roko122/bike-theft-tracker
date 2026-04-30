import { useI18n } from '../../app/i18n/LanguageContext.jsx';

function statusTone(status) {
  const normalized = String(status ?? '').toUpperCase();

  if (normalized === 'SIGHTED') return 'warning';
  if (normalized === 'RECOVERED') return 'success';
  if (normalized === 'CLOSED') return 'neutral';

  return 'danger';
}

export default function ReportStatusBadge({ status }) {
  const { t } = useI18n();
  const normalizedStatus = String(status ?? '').toUpperCase();

  if (!normalizedStatus) {
    return <div className="details-status">-</div>;
  }

  return (
    <div className={`details-status details-status--${statusTone(normalizedStatus)}`}>
      {t(`details.status.${normalizedStatus}`)}
    </div>
  );
}
