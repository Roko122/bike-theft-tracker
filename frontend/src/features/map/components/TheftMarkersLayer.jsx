import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import {
  formatReportDate,
  getReportFieldLabel,
  renderReportValue
} from '../utils/reportFormatters.js';
import { REPORT_STATUS_COLORS } from '../constants.js';

function getMarkerColor(status) {
  const normalizedStatus = String(status ?? '').toUpperCase();
  const mappedStatus =
    normalizedStatus === 'SIGHTING' ? 'SIGHTED' : normalizedStatus;

  return REPORT_STATUS_COLORS[mappedStatus] ?? REPORT_STATUS_COLORS.ACTIVE;
}

function createReportMarkerIcon(status) {
  const markerColor = getMarkerColor(status);

  return L.divIcon({
    className: 'report-marker',
    html: `
      <span class="report-marker__pin" style="--marker-color: ${markerColor}">
        <span class="report-marker__dot"></span>
      </span>
    `,
    iconSize: [28, 40],
    iconAnchor: [14, 36],
    popupAnchor: [0, -30]
  });
}

function TheftPopup({ report, onSelect }) {
  const { language, t } = useI18n();
  const title = [report.brand, report.model].filter(Boolean).join(' ');

  return (
    <Popup maxWidth={440} minWidth={280}>
      <div className="popup-card">
        <div className="popup-card__header">
          <div>
            <div className="popup-card__eyebrow">{t('popup.eyebrow')}</div>
            <div className="popup-card__title">{title || t('popup.unknownBike')}</div>
          </div>
          <div className="popup-card__meta">#{report.id}</div>
        </div>

        <div className="popup-card__details">
          {Object.entries(report)
            .filter(
              ([key]) =>
                key !== 'location' &&
                key !== 'images' &&
                key !== 'id' &&
                key !== 'status'
            )
            .map(([key, value]) => (
              <div key={key} className="popup-card__row">
                <div className="popup-card__label">
                  {getReportFieldLabel(key, language)}
                </div>
                <div className="popup-card__value">
                  {key === 'theftTime'
                    ? formatReportDate(value, language)
                    : renderReportValue(value)}
                </div>
              </div>
            ))}
        </div>

        <div className="popup-card__footer">
          <button
            type="button"
            className="app-btn app-btn--primary popup-card__action"
            onClick={() => onSelect?.(report.id)}
          >
            {t('popup.open')}
          </button>
        </div>
      </div>
    </Popup>
  );
}

export default function TheftMarkersLayer({
  reports,
  isPickingLocation,
  onReportSelected
}) {
  if (isPickingLocation) {
    return null;
  }

  return reports.map((report) => (
    <Marker
      key={report.id}
      position={[report.location.latitude, report.location.longitude]}
      icon={createReportMarkerIcon(report.status)}
    >
      <TheftPopup report={report} onSelect={onReportSelected} />
    </Marker>
  ));
}
