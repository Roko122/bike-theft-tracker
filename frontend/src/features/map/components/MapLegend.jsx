import { useI18n } from '../../app/i18n/LanguageContext.jsx';
import {
  REPORT_STATUS_COLORS,
  REPORT_STATUS_LABELS
} from '../constants.js';

const LEGEND_ITEMS = [
  'ACTIVE',
  'SIGHTED',
  'RECOVERED',
  'CLOSED'
].map((status) => ({
  status,
  color: REPORT_STATUS_COLORS[status],
  label: REPORT_STATUS_LABELS[status]
}));

export default function MapLegend() {
  const { t } = useI18n();

  return (
    <aside className="map-legend" aria-label={t('map.legendAria')}>
      <div className="map-legend__title">{t('map.legendTitle')}</div>
      <div className="map-legend__items">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.status} className="map-legend__item">
            <span
              className="map-legend__swatch"
              style={{ '--legend-color': item.color }}
              aria-hidden="true"
            >
              <span className="report-marker__pin" style={{ '--marker-color': item.color }}>
                <span className="report-marker__dot"></span>
              </span>
            </span>
            <span className="map-legend__label">
              {t(`details.status.${item.status}`) || item.label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
