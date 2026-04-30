import { resolveApiAssetUrl } from '../../api/theftReportApi.js';
import { getApiBaseUrl } from '../../api/apiConfig.js';

export function getReportImageUrls(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map(url => getApiBaseUrl() + url)
    .filter(Boolean)
    .map(resolveApiAssetUrl);
}
