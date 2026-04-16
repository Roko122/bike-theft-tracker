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
  return (
    <aside className="map-legend" aria-label="Karttamerkkien selite">
      <div className="map-legend__title">Merkintöjen värit</div>
      <div className="map-legend__items">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.status} className="map-legend__item">
            <span
              className="map-legend__swatch"
              style={{ '--legend-color': item.color }}
              aria-hidden="true"
            />
            <span className="map-legend__label">{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
