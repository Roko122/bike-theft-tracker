import { useEffect, useMemo, useState } from 'react';
import { Binoculars, CircleHelp, UserRound } from 'lucide-react';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import { getTheftReportById } from '../../api/theftReportApi.js';
import ImageCarousel from './ImageCarousel.jsx';
import { getReportImageUrls } from '../utils/reportImages.js';
import { formatReportDate } from '../utils/reportFormatters.js';

function Row({ label, value }) {
  return (
    <div className="details-row">
      <div className="details-row__label">{label}</div>
      <div className="details-row__value">
        {value == null || value === '' ? '-' : String(value)}
      </div>
    </div>
  );
}

export default function TheftReportDetailsSidebar({
  reportId,
  onCreateSighting,
  canCreateSighting = false
}) {
  const { language, t } = useI18n();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reportId) {
      return;
    }

    let cancelled = false;

    async function loadReport() {
      try {
        setLoading(true);
        setError('');
        setReport(null);

        const data = await getTheftReportById(reportId);
        if (!cancelled) {
          setReport(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message ?? t('details.fetchFailed'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      cancelled = true;
    };
  }, [reportId, t]);

  const imageUrls = useMemo(
    () => getReportImageUrls(report?.images),
    [report?.images]
  );
  const reporterName = report?.bike?.user?.username?.trim?.() ?? '';
  const reporterInitial = reporterName ? reporterName.charAt(0).toUpperCase() : '?';

  return (
    <div className="details">
      {loading && <p style={{ marginTop: 12 }}>{t('common.loading')}</p>}

      {!loading && error && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            {t('details.fetchFailed')}
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{error}</div>
        </div>
      )}

      {!loading && !error && report && (
        <div className="details-body">
          <div className="details-header details-header--summary">
            <div className="details-header__content">
              <div className="details-header__topline">
                <div className="details-header__eyebrow">{t('details.title')}</div>
                <div className={`details-status details-status--${report.status?.toLowerCase?.() === 'sighted' ? 'warning' : report.status?.toLowerCase?.() === 'recovered' ? 'success' : report.status?.toLowerCase?.() === 'closed' ? 'neutral' : 'danger'}`}>
                  {t(`details.status.${report.status}`)}
                </div>
              </div>
              <h3 className="details-header__title">
                {report?.brand ?? ''} {report?.model ?? ''}
              </h3>
              {report?.id && (
                <div className="details-header__meta">ID #{report.id}</div>
              )}

              {canCreateSighting && (
                <div className="details-callout">
                  <span className="details-callout__label">
                    {t('details.sighting.label')}
                  </span>
                  <div className="details-callout__actions">
                    <button
                      type="button"
                      className="app-btn app-btn--secondary details-callout__button"
                      onClick={() => onCreateSighting?.(report)}
                    >
                      <Binoculars size={16} />
                      <span>{t('details.sighting.button')}</span>
                    </button>
                    <span
                      className="details-callout__hint"
                      tabIndex={0}
                      aria-label={t('details.sighting.tooltipAria')}
                    >
                      <CircleHelp size={16} />
                      <span className="details-callout__tooltip">
                        {t('details.sighting.tooltip')}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {imageUrls.length > 0 && (
            <div className="details-section">
              <h4 className="details-section__title">{t('details.sections.images')}</h4>
              <ImageCarousel images={imageUrls} height={220} fit="contain" />
            </div>
          )}

          <div className="details-section details-section--rows">
            <h4 className="details-section__title">{t('details.sections.basics')}</h4>

            <Row label={t('details.fields.description')} value={report.description} />
            <Row
              label={t('details.fields.theftTime')}
              value={formatReportDate(report.theftTime, language)}
            />

            <h4 className="details-section__title">{t('details.sections.location')}</h4>
            <Row label={t('details.fields.address')} value={report.theftAddress ?? report.address} />

            <h4 className="details-section__title">{t('details.sections.bike')}</h4>
            <Row label={t('details.fields.brand')} value={report.bike?.brand ?? report.brand} />
            <Row label={t('details.fields.model')} value={report.bike?.model ?? report.model} />
            <Row label={t('details.fields.type')} value={report.bike?.type ?? report.type} />
            <Row label={t('details.fields.color')} value={report.bike?.color ?? report.color} />
            <Row
              label={t('details.fields.serialNumber')}
              value={report.bike?.serialNumber ?? report.serialNumber}
            />
            <Row
              label={t('details.fields.bikeDescription')}
              value={report.bike?.description}
            />

            <h4 className="details-section__title details-section__title--spaced">
              {t('details.fields.username')}
            </h4>
            <div className="details-reporter-card details-reporter-card--embedded">
              <div className="details-reporter-card__avatar" aria-hidden="true">
                {reporterName ? reporterInitial : <UserRound size={16} />}
              </div>
              <div className="details-reporter-card__content">
                <div className="details-reporter-card__name">
                  {reporterName || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
