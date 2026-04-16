import { LocateFixed, Minus, Plus } from 'lucide-react';

function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

function MapControlButton({ icon: Icon, label, onClick }) {
  return (
    <button
      className="map-control-btn"
      onClick={(event) => {
        stopEvent(event);
        onClick?.();
      }}
      type="button"
      title={label}
      aria-label={label}
    >
      <Icon size={22} />
    </button>
  );
}

export default function MapControls({
  onCenterToUser,
  onZoomIn,
  onZoomOut
}) {
  return (
    <div
      className="map-controls"
      onClick={stopEvent}
      onMouseDown={stopEvent}
      onDoubleClick={stopEvent}
    >
      <MapControlButton
        icon={Plus}
        label="Suurenna karttaa"
        onClick={onZoomIn}
      />
      <MapControlButton
        icon={Minus}
        label="Pienennä karttaa"
        onClick={onZoomOut}
      />
      <MapControlButton
        icon={LocateFixed}
        label="Keskitä sijaintiin"
        onClick={onCenterToUser}
      />
    </div>
  );
}
