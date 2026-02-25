const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const API_PREFIX = "/api/v1";

function url(path) {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

async function request(method, path, body) {
  const res = await fetch(url(path), {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${path} failed: ${res.status} ${text}`);
  }

  return res.json().catch(() => null);
}

// Hae kaikki ilmoitukset
export function fetchTheftReports() {
  return request("GET", "/theft-reports");
}

// Karttaa varten (sama endpoint nyt)
export function fetchTheftReportMapItems() {
  return request("GET", "/theft-reports");
}

// Luo uusi ilmoitus
export function createTheftReport(payload) {
  return request("POST", "/theft-reports", payload);
}