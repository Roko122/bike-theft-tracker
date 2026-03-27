import { useEffect, useMemo, useState } from 'react';
import { getTheftReportById } from '../../api/theftReportApi.js';

// Yksittäinen “label + value” rivi sivupalkkiin
function Row({ label, value }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '110px 1fr',
        gap: 10,
        alignItems: 'start'
      }}
    >
      <div style={{ opacity: 0.75, fontSize: 12 }}>{label}</div>
      <div style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>
        {value == null || value === '' ? '-' : String(value)}
      </div>
    </div>
  );
}

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
      theftTime: 'Tapahtuma-aika',
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
  function formatDateTime(iso) {
    if (!iso) return '-';

    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);

    // Sama logiikka kuin MapPage.jsx popupissa: +2 tuntia
    const adjusted = new Date(d.getTime() + 2 * 60 * 60 * 1000);

    return adjusted.toLocaleString();
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

          {/* Perustiedot */}
          <div style={{ display: 'grid', gap: 6 }}>
            <h4 style={{ margin: '12px 0 4px' }}>Perustiedot</h4>

            <Row label="ID" value={report.id} />
            <Row label="Kuvaus" value={report.description} />
            <Row
              label="Tapahtuma-aika"
              value={report.theftTime ? formatDateTime(report.theftTime) : '-'}
            />
            <Row label="Tila" value={report.status} />

            {/* Sijainti */}
            <h4 style={{ margin: '12px 0 4px' }}>Sijainti</h4>

            <Row label="Osoite" value={report.theftAddress ?? report.address} />

            {/* Pyörän tiedot (bike voi olla objekti) */}
            <h4 style={{ margin: '12px 0 4px' }}>Pyörän tiedot</h4>

            <Row label="Merkki" value={report.bike?.brand ?? report.brand} />
            <Row label="Malli" value={report.bike?.model ?? report.model} />
            <Row label="Tyyppi" value={report.bike?.type ?? report.type} />
            <Row label="Väri" value={report.bike?.color ?? report.color} />
            <Row
              label="Sarjanumero"
              value={report.bike?.serialNumber ?? report.serialNumber}
            />
            <Row label="Lisäkuvaus" value={report.bike?.description} />
          </div>
        </div>
      )}
    </div>
  );
}
