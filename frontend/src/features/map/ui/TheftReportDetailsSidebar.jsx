import { useEffect, useMemo, useState } from 'react';
import { Binoculars, CircleHelp, UserRound } from 'lucide-react';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import {
  getTheftReportById,
  updateTheftReportStatus
} from '../../api/theftReportApi.js';
import ImageCarousel from './ImageCarousel.jsx';
import { getReportImageUrls } from '../utils/reportImages.js';
import { formatReportDate } from '../utils/reportFormatters.js';

const STATUS_OPTIONS = ['ACTIVE', 'SIGHTED', 'RECOVERED', 'CLOSED'];

function statusTone(status) {
  const normalized = String(status ?? '').toUpperCase();
  if (normalized === 'SIGHTED') return 'warning';
  if (normalized === 'RECOVERED') return 'success';
  if (normalized === 'CLOSED') return 'neutral';
  return 'danger';
}

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
  canCreateSighting = false,
  currentUsername = ''
}) {
  const { language, t } = useI18n();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusDraft, setStatusDraft] = useState('ACTIVE');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

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
          setStatusDraft(data?.status ?? 'ACTIVE');
          setStatusError('');
          setStatusMessage('');
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
  const isOwner =
    Boolean(currentUsername) &&
    Boolean(reporterName) &&
    currentUsername.trim().toLowerCase() === reporterName.trim().toLowerCase();

  async function handleSaveStatus() {
    if (!report?.id || !statusDraft) {
      return;
    }

    try {
      setStatusSaving(true);
      setStatusError('');
      setStatusMessage('');
      const updatedReport = await updateTheftReportStatus(report.id, statusDraft);
      setReport(updatedReport);
      setStatusDraft(updatedReport?.status ?? statusDraft);
      setStatusMessage(t('details.statusEditor.saved'));
    } catch (saveError) {
      setStatusError(saveError?.message ?? t('details.statusEditor.saveFailed'));
    } finally {
      setStatusSaving(false);
    }
  }

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
                <div className={`details-status details-status--${statusTone(report.status)}`}>
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

            {isOwner && (
              <>
                <h4 className="details-section__title details-section__title--spaced">
                  {t('details.statusEditor.title')}
                </h4>
                <div className="details-status-editor">
                  <div className="details-status-editor__row">
                    <label className="details-status-editor__label" htmlFor="report-status-select">
                      {t('details.statusEditor.label')}
                    </label>
                    <select
                      id="report-status-select"
                      className="details-status-editor__select"
                      value={statusDraft}
                      onChange={(event) => {
                        setStatusDraft(event.target.value);
                        setStatusError('');
                        setStatusMessage('');
                      }}
                      disabled={statusSaving}
                    >
                      {STATUS_OPTIONS.map((statusValue) => (
                        <option key={statusValue} value={statusValue}>
                          {t(`details.status.${statusValue}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`details-status details-status--${statusTone(statusDraft)}`}>
                    {t(`details.status.${statusDraft}`)}
                  </div>

                  {statusError && (
                    <p className="details-status-editor__error">{statusError}</p>
                  )}

                  {!statusError && statusMessage && (
                    <p className="details-status-editor__success">{statusMessage}</p>
                  )}

                  <button
                    type="button"
                    className="app-btn app-btn--secondary details-status-editor__save"
                    onClick={handleSaveStatus}
                    disabled={statusSaving || !statusDraft || statusDraft === report.status}
                  >
                    {statusSaving ? t('details.statusEditor.saving') : t('details.statusEditor.save')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
