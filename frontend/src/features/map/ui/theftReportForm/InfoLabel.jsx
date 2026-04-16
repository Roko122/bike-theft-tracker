import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Info } from 'lucide-react';

export default function InfoLabel({ label, tooltipId, tooltipText }) {
  return (
    <span className="d-flex align-items-center gap-1">
      {label}
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        container={document.body}
        overlay={<Tooltip id={tooltipId}>{tooltipText}</Tooltip>}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          tabIndex={0}
        >
          <Info size={16} color="#6c757d" />
        </span>
      </OverlayTrigger>
    </span>
  );
}
