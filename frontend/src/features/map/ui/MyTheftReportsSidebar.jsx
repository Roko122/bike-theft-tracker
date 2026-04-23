import { useEffect, useState } from 'react';
import { Bike, MapPin, CalendarDays, FileText } from 'lucide-react';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import {
  getMyTheftReports,
  getSightingsForReport,
  resolveApiAssetUrl
} from '../../api/theftReportApi.js';
import { formatReportDate } from '../utils/reportFormatters.js';

/**
 * Näyttää kirjautuneen käyttäjän omat varkausilmoitukset listana.
 * Kun käyttäjä klikkaa ilmoitusta, avataan ilmoituksen tarkempi näkymä.
 */
export default function MyTheftReportsSidebar({ onSelectReport, onShowOnMap }) {
  const { language, t } = useI18n();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [sightingsByReportId, setSightingsByReportId] = useState({});

  function extractSightingTime(sighting) {
    return (
      sighting?.createdAt ??
      sighting?.reportedAt ??
      sighting?.sightingTime ??
      sighting?.timestamp ??
      sighting?.created_at ??
      null
    );
  }

  function extractSightingLocation(sighting) {
    const lat =
      sighting?.location?.latitude ??
      sighting?.location?.lat ??
      sighting?.latitude ??
      sighting?.lat ??
      null;
    const lon =
      sighting?.location?.longitude ??
      sighting?.location?.lon ??
      sighting?.location?.lng ??
      sighting?.longitude ??
      sighting?.lon ??
      sighting?.lng ??
      null;

    if (lat == null || lon == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) {
      return null;
    }

    return {
      latitude: Number(lat),
      longitude: Number(lon)
    };
  }

  function formatSightingCoordinates(location) {
    if (!location) {
      return '-';
    }
    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }

  function extractSightingImageUrl(sighting) {
    const directImage =
      sighting?.imageUrl ??
      sighting?.imagePath ??
      sighting?.image ??
      sighting?.photoUrl ??
      sighting?.photoPath ??
      null;
    if (directImage) {
      return resolveApiAssetUrl(directImage);
    }

    if (Array.isArray(sighting?.images) && sighting.images.length > 0) {
      const firstImage =
        sighting.images[0]?.url ??
        sighting.images[0]?.imageUrl ??
        sighting.images[0]?.path ??
        sighting.images[0];
      if (typeof firstImage === 'string' && firstImage.trim() !== '') {
        return resolveApiAssetUrl(firstImage);
      }
    }

    return '';
  }

  async function handleToggleSightings(reportId) {
    if (!reportId) {
      return;
    }

    if (expandedReportId === reportId) {
      setExpandedReportId(null);
      return;
    }

    setExpandedReportId(reportId);

    const currentState = sightingsByReportId[reportId];
    if (currentState?.loading || currentState?.loaded) {
      return;
    }

    setSightingsByReportId((previous) => ({
      ...previous,
      [reportId]: {
        items: [],
        loading: true,
        loaded: false,
        error: ''
      }
    }));

    try {
      const data = await getSightingsForReport(reportId);
      setSightingsByReportId((previous) => ({
        ...previous,
        [reportId]: {
          items: Array.isArray(data) ? data : [],
          loading: false,
          loaded: true,
          error: ''
        }
      }));
    } catch (loadError) {
      setSightingsByReportId((previous) => ({
        ...previous,
        [reportId]: {
          items: [],
          loading: false,
          loaded: true,
          error: loadError?.message ?? t('sidebar.myReports.sightingsFetchFailed')
        }
      }));
    }
  }

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
            <div className="details-header__eyebrow">{t('sidebar.myReports.eyebrow')}</div>
            <h3 className="details-header__title">{t('sidebar.myReports.title')}</h3>
            <div className="details-header__meta">
              {t('sidebar.myReports.total')}: {reports.length}
            </div>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="details-section">
            <p>{t('sidebar.myReports.empty')}</p>
          </div>
        ) : (
          <div className="details-section details-section--rows">
            {reports.map((report) => {
              const isExpanded = expandedReportId === report.id;
              const sightingsState = sightingsByReportId[report.id] ?? {
                items: [],
                loading: false,
                loaded: false,
                error: ''
              };

              return (
                <div key={report.id} className="my-reports-item">
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
                    <strong>{t('reportFields.status')}:</strong> {report.status ?? '-'}
                  </div>

                  <div className="my-reports-item__actions">
                    <button
                      type="button"
                      className="app-btn app-btn--ghost"
                      onClick={() => onSelectReport?.(report.id)}
                    >
                      {t('sidebar.myReports.openReport')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn--secondary"
                      onClick={() => handleToggleSightings(report.id)}
                    >
                      {isExpanded
                        ? t('sidebar.myReports.hideSightings')
                        : t('sidebar.myReports.showSightings')}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="my-reports-sightings">
                      <h4 className="my-reports-sightings__title">
                        {t('sidebar.myReports.sightingsTitle')}
                      </h4>

                      {sightingsState.loading && (
                        <p style={{ margin: 0 }}>{t('common.loading')}</p>
                      )}

                      {!sightingsState.loading && sightingsState.error && (
                        <div className="my-reports-sightings__error">
                          <strong>{t('sidebar.myReports.sightingsFetchFailed')}</strong>
                          <div style={{ whiteSpace: 'pre-wrap' }}>{sightingsState.error}</div>
                        </div>
                      )}

                      {!sightingsState.loading &&
                        !sightingsState.error &&
                        sightingsState.items.length === 0 && (
                          <p style={{ margin: 0 }}>{t('sidebar.myReports.sightingsEmpty')}</p>
                        )}

                      {!sightingsState.loading &&
                        !sightingsState.error &&
                        sightingsState.items.length > 0 && (
                          <div className="my-reports-sightings__list">
                            {sightingsState.items.map((sighting, index) => {
                              const sightingImageUrl = extractSightingImageUrl(sighting);
                              const sightingLocation = extractSightingLocation(sighting);
                              return (
                                <article
                                  key={sighting.id ?? `${report.id}-sighting-${index}`}
                                  className="my-reports-sighting"
                                >
                                  <div className="my-reports-sighting__meta">
                                    <FileText size={14} />
                                    <span>
                                      {t('sidebar.myReports.sightingLabel')} {index + 1}
                                    </span>
                                  </div>

                                  <div className="my-reports-sighting__row">
                                    <strong>{t('sidebar.myReports.sightingReportedAt')}:</strong>{' '}
                                    {formatReportDate(extractSightingTime(sighting), language)}
                                  </div>

                                  <div className="my-reports-sighting__row">
                                    <strong>{t('sidebar.myReports.sightingLocation')}:</strong>{' '}
                                    {sightingLocation ? (
                                      <button
                                        type="button"
                                        className="my-reports-sighting__location-btn"
                                        onClick={() => onShowOnMap?.(sightingLocation)}
                                      >
                                        <MapPin size={14} />
                                        <span>{formatSightingCoordinates(sightingLocation)}</span>
                                      </button>
                                    ) : (
                                      '-'
                                    )}
                                  </div>

                                  <p className="my-reports-sighting__description">
                                    {sighting?.description?.trim?.() || '-'}
                                  </p>

                                  {sightingImageUrl && (
                                    <img
                                      src={sightingImageUrl}
                                      alt={t('sidebar.myReports.sightingImageAlt')}
                                      className="my-reports-sighting__image"
                                      loading="lazy"
                                    />
                                  )}
                                </article>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
