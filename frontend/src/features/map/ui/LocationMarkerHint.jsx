export default function LocationMarkerHint({ text, markerAriaLabel }) {
  return (
    <span className="location-marker-hint">
      <span className="location-marker-hint__icon" aria-label={markerAriaLabel}>
        <span className="location-marker-hint__dot"></span>
      </span>
      <span>{text}</span>
    </span>
  );
}
