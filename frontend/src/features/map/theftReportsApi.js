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

// Koodia varkausilmoituskomonenttiin BTT-28

export async function createTheftReport(payload) {
  const url = `${BASE_URL}${API_PREFIX}/theft-reports`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      // charset mukana -> auttaa välttämään outoja UTF-8 parse -virheitä
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const extra = await readErrorBody(res);
    throw new Error(
      `POST /theft-reports epäonnistui: ${res.status} ${res.statusText}${extra}`
    );
  }

  return res.json();
}
// BTT-28 koodi päättyy