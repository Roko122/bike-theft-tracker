import { useEffect, useMemo, useState } from 'react';
import { Binoculars, CircleHelp, UserRound } from 'lucide-react';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import {
  deleteTheftReport,
  getTheftReportById,
  updateTheftReport,
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

function toDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const text = String(value);
  if (text.includes('T')) {
    return text.slice(0, 16);
  }
  return '';
}

function readLatitude(report) {
  return (
    report?.location?.latitude ??
    report?.location?.lat ??
    report?.latitude ??
    report?.lat ??
    ''
  );
}

function readLongitude(report) {
  return (
    report?.location?.longitude ??
    report?.location?.lng ??
    report?.location?.lon ??
    report?.longitude ??
    report?.lng ??
    report?.lon ??
    ''
  );
}

function buildEditDraftFromReport(report) {
  return {
    description: report?.description ?? '',
    theftTime: toDateTimeLocal(report?.theftTime),
    theftAddress: report?.theftAddress ?? report?.address ?? '',
    latitude: String(readLatitude(report) ?? ''),
    longitude: String(readLongitude(report) ?? ''),
    brand: report?.bike?.brand ?? report?.brand ?? '',
    model: report?.bike?.model ?? report?.model ?? '',
    type: report?.bike?.type ?? report?.type ?? '',
    color: report?.bike?.color ?? report?.color ?? '',
    serialNumber: report?.bike?.serialNumber ?? report?.serialNumber ?? '',
    bikeDescription: report?.bike?.description ?? ''
  };
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
  currentUsername = '',
  onShowOnMap,
  onDeleted,
  onUpdated
}) {
  const { language, t } = useI18n();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [statusDraft, setStatusDraft] = useState('ACTIVE');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState(buildEditDraftFromReport(null));
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editMessage, setEditMessage] = useState('');

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
          setEditDraft(buildEditDraftFromReport(data));
          setEditMode(false);
          setStatusError('');
          setStatusMessage('');
          setEditError('');
          setEditMessage('');
          setDeleteError('');
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

  const reportLocation = useMemo(() => {
    const latitude = Number(readLatitude(report));
    const longitude = Number(readLongitude(report));

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return null;
    }

    return { latitude, longitude };
  }, [report]);

  const reporterName = report?.bike?.user?.username?.trim?.() ?? '';
  const reporterInitial = reporterName ? reporterName.charAt(0).toUpperCase() : '?';
  const isOwner =
    Boolean(currentUsername) &&
    Boolean(reporterName) &&
    currentUsername.trim().toLowerCase() === reporterName.trim().toLowerCase();

  function patchEditDraft(field, value) {
    setEditDraft((previous) => ({
      ...previous,
      [field]: value
    }));
  }

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
      setEditDraft(buildEditDraftFromReport(updatedReport));
      setStatusMessage(t('details.statusEditor.saved'));
      onUpdated?.();
    } catch (saveError) {
      setStatusError(saveError?.message ?? t('details.statusEditor.saveFailed'));
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleSaveEdits() {
    if (!report?.id) {
      return;
    }

    const latitude = Number(editDraft.latitude);
    const longitude = Number(editDraft.longitude);

    if (
      !editDraft.description.trim() ||
      !editDraft.theftTime ||
      !editDraft.brand.trim() ||
      !editDraft.model.trim() ||
      !editDraft.type.trim() ||
      !editDraft.color.trim() ||
      !editDraft.bikeDescription.trim()
    ) {
      setEditError(t('details.editor.requiredFields'));
      setEditMessage('');
      return;
    }

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setEditError(t('details.editor.invalidLocation'));
      setEditMessage('');
      return;
    }

    const payload = {
      id: report.id,
      description: editDraft.description.trim(),
      theftTime: editDraft.theftTime,
      theftAddress: editDraft.theftAddress.trim(),
      location: {
        longitude,
        latitude
      },
      bike: {
        id: report?.bike?.id ?? null,
        brand: editDraft.brand.trim(),
        model: editDraft.model.trim(),
        type: editDraft.type.trim(),
        color: editDraft.color.trim(),
        serialNumber: editDraft.serialNumber.trim(),
        description: editDraft.bikeDescription.trim(),
        user: report?.bike?.user ?? null
      }
    };

    try {
      setEditSaving(true);
      setEditError('');
      setEditMessage('');
      const updatedReport = await updateTheftReport(report.id, payload);
      setReport(updatedReport);
      setStatusDraft(updatedReport?.status ?? statusDraft);
      setEditDraft(buildEditDraftFromReport(updatedReport));
      setEditMode(false);
      setEditMessage(t('details.editor.saved'));
      onUpdated?.();
    } catch (saveError) {
      setEditError(saveError?.message ?? t('details.editor.saveFailed'));
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDeleteReport() {
    if (!report?.id) {
      return;
    }

    const confirmed = window.confirm(t('details.management.deleteConfirm'));
    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError('');
      await deleteTheftReport(report.id);
      onDeleted?.();
    } catch (deleteFailure) {
      setDeleteError(deleteFailure?.message ?? t('details.management.deleteFailed'));
    } finally {
      setDeleteLoading(false);
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
            <Row
              label={t('details.fields.locationCoordinates')}
              value={
                reportLocation
                  ? `${reportLocation.latitude.toFixed(5)}, ${reportLocation.longitude.toFixed(5)}`
                  : '-'
              }
            />

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

            <h4 className="details-section__title details-section__title--spaced">
              {t('details.management.title')}
            </h4>

            <div className="details-management-actions">
              <button
                type="button"
                className="app-btn app-btn--ghost"
                onClick={() => reportLocation && onShowOnMap?.(reportLocation)}
                disabled={!reportLocation}
              >
                {t('details.management.showOnMap')}
              </button>

              {isOwner && (
                <>
                  <button
                    type="button"
                    className="app-btn app-btn--secondary"
                    onClick={() => {
                      setEditMode((previous) => !previous);
                      setEditError('');
                      setEditMessage('');
                      setEditDraft(buildEditDraftFromReport(report));
                    }}
                  >
                    {editMode ? t('details.editor.cancel') : t('details.editor.open')}
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn--ghost details-management-actions__danger"
                    onClick={handleDeleteReport}
                    disabled={deleteLoading}
                  >
                    {deleteLoading
                      ? t('details.management.deleting')
                      : t('details.management.delete')}
                  </button>
                </>
              )}
            </div>

            {deleteError && <p className="details-status-editor__error">{deleteError}</p>}

            {isOwner && (
              <>
                <h4 className="details-section__title details-section__title--spaced">
                  {t('details.statusEditor.title')}
                </h4>
                <div className="details-status-editor">
                  <div className="details-status-editor__controls">
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
                    <button
                      type="button"
                      className="app-btn app-btn--secondary details-status-editor__save"
                      onClick={handleSaveStatus}
                      disabled={statusSaving || !statusDraft || statusDraft === report.status}
                    >
                      {statusSaving
                        ? t('details.statusEditor.saving')
                        : t('details.statusEditor.save')}
                    </button>
                  </div>

                  {statusError && (
                    <p className="details-status-editor__error">{statusError}</p>
                  )}
                  {!statusError && statusMessage && (
                    <p className="details-status-editor__success">{statusMessage}</p>
                  )}
                </div>

                {editMode && (
                  <div className="details-edit-form">
                    <h4 className="details-section__title">{t('details.editor.formTitle')}</h4>

                    <label className="details-edit-form__field">
                      <span>{t('details.fields.description')}</span>
                      <textarea
                        value={editDraft.description}
                        onChange={(event) => patchEditDraft('description', event.target.value)}
                        rows={4}
                      />
                    </label>

                    <div className="details-edit-form__grid">
                      <label className="details-edit-form__field">
                        <span>{t('details.fields.theftTime')}</span>
                        <input
                          type="datetime-local"
                          value={editDraft.theftTime}
                          onChange={(event) => patchEditDraft('theftTime', event.target.value)}
                        />
                      </label>
                      <label className="details-edit-form__field">
                        <span>{t('details.fields.address')}</span>
                        <input
                          type="text"
                          value={editDraft.theftAddress}
                          onChange={(event) => patchEditDraft('theftAddress', event.target.value)}
                        />
                      </label>
                    </div>

                    <div className="details-edit-form__grid">
                      <label className="details-edit-form__field">
                        <span>{t('details.fields.latitude')}</span>
                        <input
                          type="number"
                          step="any"
                          value={editDraft.latitude}
                          onChange={(event) => patchEditDraft('latitude', event.target.value)}
                        />
                      </label>
                      <label className="details-edit-form__field">
                        <span>{t('details.fields.longitude')}</span>
                        <input
                          type="number"
                          step="any"
                          value={editDraft.longitude}
                          onChange={(event) => patchEditDraft('longitude', event.target.value)}
                        />
                      </label>
                    </div>

                    <div className="details-edit-form__grid">
                      <label className="details-edit-form__field">
                        <span>{t('details.fields.brand')}</span>
                        <input
                          type="text"
                          value={editDraft.brand}
                          onChange={(event) => patchEditDraft('brand', event.target.value)}
                        />
                      </label>
                      <label className="details-edit-form__field">
                        <span>{t('details.fields.model')}</span>
                        <input
                          type="text"
                          value={editDraft.model}
                          onChange={(event) => patchEditDraft('model', event.target.value)}
                        />
                      </label>
                    </div>

                    <div className="details-edit-form__grid">
                      <label className="details-edit-form__field">
                        <span>{t('details.fields.type')}</span>
                        <input
                          type="text"
                          value={editDraft.type}
                          onChange={(event) => patchEditDraft('type', event.target.value)}
                        />
                      </label>
                      <label className="details-edit-form__field">
                        <span>{t('details.fields.color')}</span>
                        <input
                          type="text"
                          value={editDraft.color}
                          onChange={(event) => patchEditDraft('color', event.target.value)}
                        />
                      </label>
                    </div>

                    <label className="details-edit-form__field">
                      <span>{t('details.fields.serialNumber')}</span>
                      <input
                        type="text"
                        value={editDraft.serialNumber}
                        onChange={(event) => patchEditDraft('serialNumber', event.target.value)}
                      />
                    </label>

                    <label className="details-edit-form__field">
                      <span>{t('details.fields.bikeDescription')}</span>
                      <textarea
                        value={editDraft.bikeDescription}
                        onChange={(event) => patchEditDraft('bikeDescription', event.target.value)}
                        rows={4}
                      />
                    </label>

                    {editError && <p className="details-status-editor__error">{editError}</p>}
                    {!editError && editMessage && (
                      <p className="details-status-editor__success">{editMessage}</p>
                    )}

                    <div className="details-edit-form__actions">
                      <button
                        type="button"
                        className="app-btn app-btn--secondary"
                        onClick={handleSaveEdits}
                        disabled={editSaving}
                      >
                        {editSaving ? t('details.editor.saving') : t('details.editor.save')}
                      </button>
                      <button
                        type="button"
                        className="app-btn app-btn--ghost"
                        onClick={() => {
                          setEditMode(false);
                          setEditError('');
                          setEditMessage('');
                          setEditDraft(buildEditDraftFromReport(report));
                        }}
                      >
                        {t('details.editor.cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
