import { REPORT_FIELD_LABELS } from '../constants.js';

export function formatReportDate(isoValue) {
  if (!isoValue) {
    return '-';
  }

  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return String(isoValue);
  }

  const adjustedDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  return adjustedDate.toLocaleString();
}

export function getReportFieldLabel(key) {
  return REPORT_FIELD_LABELS[key] ?? key;
}

export function renderReportValue(value) {
  if (value == null) {
    return '-';
  }

  return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
}

export function hasValidCoordinates(report) {
  return report?.location?.latitude != null && report?.location?.longitude != null;
}
