import { Info } from 'lucide-react';

export default function InfoLabel({ label, tooltipId, tooltipText }) {
  return (
    <span className="info-label">
      <span>{label}</span>
      <span className="info-label__hint" tabIndex={0} aria-describedby={tooltipId}>
        <Info size={16} />
        <span className="info-label__tooltip" id={tooltipId} role="tooltip">
          {tooltipText}
        </span>
      </span>
    </span>
  );
}
