import { useEffect, useState } from 'react';
import { Bike, MapPin, CalendarDays } from 'lucide-react';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import { getMyTheftReports } from '../../api/theftReportApi.js';
import { formatReportDate } from '../utils/reportFormatters.js';

/**
 * Näyttää kirjautuneen käyttäjän omat varkausilmoitukset listana.
 * Kun käyttäjä klikkaa ilmoitusta, avataan ilmoituksen tarkempi näkymä.
 */
export default function MyTheftReportsSidebar({ onSelectReport }) {
  const { language, t } = useI18n();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadReports() {
      try {
        setLoading(true);
        setError('');

        const data = await getMyTheftReports();

        if (!cancelled) {
          setReports(Array.isArray(data) ? data : []);
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

    loadReports();

    return () => {
      cancelled = true;
    };
  }, [t]);

  if (loading) {
    return <p style={{ marginTop: 12 }}>{t('common.loading')}</p>;
  }

  if (error) {
    return (
      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>
          {t('details.fetchFailed')}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="details">
      <div className="details-body">
        <div className="details-header details-header--summary">
          <div className="details-header__content">
            <div className="details-header__eyebrow">Omat ilmoitukset</div>
            <h3 className="details-header__title">
              Tarkastele omia varkausilmoituksiasi
            </h3>
            <div className="details-header__meta">
              Ilmoituksia yhteensä: {reports.length}
            </div>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="details-section">
            <p>Et ole vielä tehnyt yhtään varkausilmoitusta.</p>
          </div>
        ) : (
          <div className="details-section details-section--rows">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                className="app-btn app-btn--ghost"
                onClick={() => onSelectReport?.(report.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'block',
                  padding: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  marginBottom: '10px'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                  <Bike
                    size={16}
                    style={{ marginRight: 6, verticalAlign: 'middle' }}
                  />
                  <span>
                    {report.bike?.brand ?? report.brand ?? '-'}{' '}
                    {report.bike?.model ?? report.model ?? ''}
                  </span>
                </div>

                <div style={{ fontSize: '0.95rem', marginBottom: 6 }}>
                  <MapPin
                    size={14}
                    style={{ marginRight: 6, verticalAlign: 'middle' }}
                  />
                  <span>{report.theftAddress ?? report.address ?? '-'}</span>
                </div>

                <div style={{ fontSize: '0.95rem', marginBottom: 6 }}>
                  <CalendarDays
                    size={14}
                    style={{ marginRight: 6, verticalAlign: 'middle' }}
                  />
                  <span>{formatReportDate(report.theftTime, language)}</span>
                </div>

                <div>
                  <strong>Tila:</strong> {report.status ?? '-'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
