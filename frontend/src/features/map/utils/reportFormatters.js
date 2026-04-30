import { translations } from '../../app/i18n/translations.js';

export function formatReportDate(isoValue, language = 'fi') {
  if (!isoValue) {
    return '-';
  }

  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return String(isoValue);
  }

  return date.toLocaleString(language === 'en' ? 'en-GB' : 'fi-FI');
}

export function getReportFieldLabel(key, language = 'fi') {
  return (
    translations[language]?.reportFields?.[key] ??
    translations.fi.reportFields?.[key] ??
    key
  );
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
