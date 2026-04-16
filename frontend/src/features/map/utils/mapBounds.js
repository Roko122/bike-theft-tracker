export function getBoundsParams(map) {
  const bounds = map.getBounds();

  return {
    minLon: bounds.getWest(),
    minLat: bounds.getSouth(),
    maxLon: bounds.getEast(),
    maxLat: bounds.getNorth()
  };
}
