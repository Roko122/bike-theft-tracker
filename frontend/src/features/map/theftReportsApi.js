// Backendin perusosoite.
// Luetaan ensisijaisesti .env-tiedostosta (VITE_API_BASE_URL),
// muuten käytetään localhostia kehityksessä.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

// API:n yhteinen prefix (Swaggerin mukaan /api/v1)
const API_PREFIX = "/api/v1";

/**
 * Hakee kaikki varkausilmoitukset backendistä.
 * Palauttaa Promise<array>.
 */
export async function fetchTheftReports() {
  const url = `${BASE_URL}${API_PREFIX}/theft-reports`;

  // Suoritetaan GET-pyyntö
  const res = await fetch(url);

  // Jos status ei ole 2xx, heitetään virhe
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GET /theft-reports epäonnistui: ${res.status} ${res.statusText} ${text}`
    );
  }

  // Palautetaan JSON-data (lista ilmoituksia)
  return res.json();
}
