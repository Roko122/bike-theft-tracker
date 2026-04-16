import { useEffect, useMemo, useState } from 'react';
import { Binoculars } from 'lucide-react';
import { getTheftReportById } from '../../api/theftReportApi.js';
import ImageCarousel from './ImageCarousel.jsx';
import { getReportImageUrls } from '../utils/reportImages.js';
import { formatReportDate } from '../utils/reportFormatters.js';

const STATUS_LABELS = {
  ACTIVE: 'Aktiivinen ilmoitus',
  SIGHTED: 'Havainto tehty',
  RECOVERED: 'Pyörä palautunut',
  CLOSED: 'Ilmoitus suljettu'
};

const STATUS_TONE_CLASS = {
  ACTIVE: 'details-status details-status--danger',
  SIGHTED: 'details-status details-status--warning',
  RECOVERED: 'details-status details-status--success',
  CLOSED: 'details-status details-status--neutral'
};

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

function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? 'Tila tuntematon';
}

function getStatusToneClass(status) {
  return STATUS_TONE_CLASS[status] ?? STATUS_TONE_CLASS.CLOSED;
}

export default function TheftReportDetailsSidebar({
  reportId,
  onClose,
  onCreateSighting,
  canCreateSighting = false
}) {
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
          setError(loadError?.message ?? 'Ilmoituksen haku epäonnistui.');
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
  }, [reportId]);

  const imageUrls = useMemo(
    () => getReportImageUrls(report?.images),
    [report?.images]
  );

  return (
    <div className="details">
      {loading && <p style={{ marginTop: 12 }}>Ladataan...</p>}

      {!loading && error && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            Ilmoituksen haku epäonnistui
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{error}</div>
        </div>
      )}

      {!loading && !error && report && (
        <div className="details-body">
          <div className="details-header details-header--summary">
            <div className="details-header__content">
              <div className="details-header__topline">
                <div className="details-header__eyebrow">Varkausilmoitus</div>
                <div className={getStatusToneClass(report.status)}>
                  {getStatusLabel(report.status)}
                </div>
              </div>
              <h3 className="details-header__title">
                {report?.brand ?? ''} {report?.model ?? ''}
              </h3>
              {report?.id && (
                <div className="details-header__meta">ID #{report.id}</div>
              )}
            </div>
          </div>

          {imageUrls.length > 0 && (
            <div className="details-section">
              <h4 className="details-section__title">Kuvat</h4>
              <ImageCarousel images={imageUrls} height={220} fit="contain" />
            </div>
          )}

          <div className="details-section details-section--rows">
            <h4 className="details-section__title">Perustiedot</h4>

            <Row label="Kuvaus" value={report.description} />
            <Row label="Tapahtuma-aika" value={formatReportDate(report.theftTime)} />

            <h4 className="details-section__title">Sijainti</h4>
            <Row label="Osoite" value={report.theftAddress ?? report.address} />

            <h4 className="details-section__title">Pyörän tiedot</h4>
            <Row label="Merkki" value={report.bike?.brand ?? report.brand} />
            <Row label="Malli" value={report.bike?.model ?? report.model} />
            <Row label="Tyyppi" value={report.bike?.type ?? report.type} />
            <Row label="Väri" value={report.bike?.color ?? report.color} />
            <Row
              label="Sarjanumero"
              value={report.bike?.serialNumber ?? report.serialNumber}
            />
            <Row label="Lisäkuvaus" value={report.bike?.description} />
          </div>

          {canCreateSighting && (
            <button
              type="button"
              className="app-btn app-btn--secondary"
              onClick={() => onCreateSighting?.(report)}
            >
              <Binoculars size={18} />
              <span>Tee havaintoilmoitus</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
