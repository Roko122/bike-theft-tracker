import { resolveApiAssetUrl } from '../../api/theftReportApi.js';

const IMAGE_URL_KEYS = [
  'url',
  'imageUrl',
  'downloadUrl',
  'href',
  'path',
  'src'
];

function readImageUrl(item) {
  if (typeof item === 'string') return item;
  if (!item || typeof item !== 'object') return '';

  for (const key of IMAGE_URL_KEYS) {
    const value = item[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }
  } //KAto jos aikaa.....  java scrib obj suoraan kuva json. koto läpi.

  return '';
}
export function getReportImageUrls(images) {
  return Array.isArray(images) ? images.filter(Boolean) : [];
}
