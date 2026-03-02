import { useEffect, useMemo, useState } from 'react';
import { getTheftReportById } from '../../theftReports/api';

/**
 * BTT-26: Varkausilmoituksen detail-näkymä sivupalkkiin.
 *
 * - Hakee ilmoituksen täydet tiedot reportId:llä (api-layerin kautta)
 * - Näyttää lataus-/virhetilat
 * - Renderöi kentät selkeästi label + arvo -pareina
 *
 * Props:
 *  - reportId: string | number (pakollinen)
 *  - onClose: () => void (valinnainen, sulkee näkymän parentissa)
 */
export default function TheftReportDetailsSidebar({ reportId, onClose }) {
  // Haettu ilmoitus
  const [report, setReport] = useState(null);

  // UI-tilat
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Kenttien labelit suomeksi.
   * Laajenna listaa sitä mukaan kun DTO tarkentuu.
   */
  const labelFi = useMemo(() => {
    const labels = {
      id: 'ID',
      brand: 'Merkki',
      model: 'Malli',
      type: 'Tyyppi',
      color: 'Väri',
      status: 'Tila',
      theftTime: 'Varkauden aika',
      description: 'Kuvaus',
      serialNumber: 'Sarjanumero',
      address: 'Osoite',
      city: 'Kunta / kaupunki',
      createdAt: 'Luotu',
      updatedAt: 'Päivitetty',
      location: 'Sijainti',
      reporterName: 'Ilmoittaja',
      email: 'Sähköposti'
    };

    return (key) => labels[key] ?? key;
  }, []);

  /**
   * Päivämäärän muotoilu:
   * - Jos arvo ei ole validi date, näytetään sellaisenaan.
   */
  function formatDateTime(value) {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  }

  /**
   * Arvon renderöinti:
   * - null/undefined => "-"
   * - object => pretty JSON
   * - muut => String()
   */
  function renderValue(value) {
    if (value == null) return '-';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  }

  /**
   * Datahaku reportId:n muuttuessa.
   */
  useEffect(() => {
    if (!reportId) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');
        setReport(null);

        const data = await getTheftReportById(reportId);

        if (!cancelled) {
          setReport(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message ?? 'Ilmoituksen haku epäonnistui.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [reportId]);

  return (
    <div className="details">
      <div className="details-header">
        <h3 style={{ margin: 0 }}>Varkausilmoitus</h3>

        <button
          type="button"
          onClick={() => onClose?.()}
          aria-label="Sulje"
          title="Sulje"
        >
          ✕
        </button>
      </div>

      {/* Lataus */}
      {loading && <p style={{ marginTop: 12 }}>Ladataan...</p>}

      {/* Virhe */}
      {!loading && error && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            Ilmoituksen haku epäonnistui
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{error}</div>
        </div>
      )}

      {/* Data */}
      {!loading && !error && report && (
        <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          {/* Pieni “otsikko” */}
          <div style={{ fontWeight: 700 }}>
            {report.brand ?? ''} {report.model ?? ''}
          </div>

          {/* Kentät */}
          <div style={{ display: 'grid', gap: 6 }}>
            {Object.entries(report).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr',
                  gap: 10,
                  alignItems: 'start'
                }}
              >
                <div style={{ opacity: 0.75, fontSize: 12 }}>
                  {labelFi(key)}
                </div>

                <div style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>
                  {/* Päivämääräkentät nätisti */}
                  {key === 'theftTime' ||
                  key === 'createdAt' ||
                  key === 'updatedAt'
                    ? formatDateTime(value)
                    : renderValue(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
