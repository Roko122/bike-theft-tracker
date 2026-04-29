import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Layers3,
  Shield,
  X
} from 'lucide-react';
import './DocumentationPage.css';

const projectTree = `bike-theft-tracker
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java/com/rkrs/bikethefttracker
│   │   │   │   ├── config
│   │   │   │   ├── controller
│   │   │   │   ├── dto
│   │   │   │   ├── entity
│   │   │   │   ├── mapper
│   │   │   │   ├── repository
│   │   │   │   ├── security
│   │   │   │   └── service
│   │   │   └── resources
│   │   └── test
│   ├── pom.xml
│   └── docker-compose.yaml
├── docs
│   ├── frontend
│   └── planning
├── frontend
│   ├── public/docs
│   ├── src
│   │   ├── features/api
│   │   ├── features/app
│   │   ├── features/map
│   │   ├── test
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md`;

const quickGuides = [
  {
    title: 'Karttanäkymä',
    summary:
      'Karttakäytös, markerit ja näkyvän alueen ilmoitusten lataus.',
    files: [
      'src/features/map/MapPage.jsx',
      'src/features/map/components/MapEffects.jsx',
      'src/features/map/components/TheftMarkersLayer.jsx',
      'src/features/map/hooks/useVisibleThefts.js'
    ]
  },
  {
    title: 'Varkausilmoitus',
    summary:
      'Lomakkeen kentät, validointi, kuvien käsittely ja tallennus.',
    files: [
      'src/features/map/ui/TheftReportForm.jsx',
      'src/features/map/ui/theftReportForm/useTheftReportForm.js',
      'src/features/map/ui/theftReportForm/BikeDetailsSection.jsx',
      'src/features/map/ui/theftReportForm/LocationSection.jsx'
    ]
  },
  {
    title: 'Kirjautuminen',
    summary:
      'Sessiohallinta, tokenien uusinta ja käyttäjätilan ylläpito.',
    files: [
      'src/features/app/auth/AuthContext.jsx',
      'src/features/api/authorizedFetch.js',
      'src/features/api/authApi.js',
      'src/main/java/com/rkrs/bikethefttracker/security/AuthenticationService.java'
    ]
  },
  {
    title: 'Omat ilmoitukset',
    summary:
      'Ilmoituslista, yksityiskohdat ja tilan päivittäminen.',
    files: [
      'src/features/app/ui/AppSidebar.jsx',
      'src/features/map/ui/MyTheftReportsSidebar.jsx',
      'src/features/map/ui/TheftReportDetailsSidebar.jsx',
      'src/features/api/theftReportApi.js'
    ]
  },
  {
    title: 'Havainnot ja ilmoitukset',
    summary:
      'Havaintolomake, havaintojen tallennus ja omistajalle lähtevät ilmoitukset.',
    files: [
      'src/features/map/ui/SightingReportPage.jsx',
      'src/features/api/theftReportApi.js',
      'src/main/java/com/rkrs/bikethefttracker/service/SightingService.java',
      'src/main/java/com/rkrs/bikethefttracker/service/NotificationService.java'
    ]
  },
  {
    title: 'Tekstit ja dokumentaatio',
    summary:
      'Käännökset, käyttöliittymätekstit ja dokumentaatiosivu.',
    files: [
      'src/features/app/i18n/translations.js',
      'src/features/app/i18n/LanguageContext.jsx',
      'src/features/app/docs/DocumentationPage.jsx',
      'src/features/app/docs/DocumentationPage.css'
    ]
  }
];

const frontendMap = [
  {
    area: 'Sovelluksen perusrakenne',
    purpose:
      'Käynnistää sovelluksen, kokoaa providerit ja määrittää päätason rakenteen.',
    files: ['src/main.jsx', 'src/App.jsx', 'src/styles.css']
  },
  {
    area: 'Näkymien ohjaus',
    purpose:
      'Hallinnoi, mikä sivupaneeli tai näkymä on kulloinkin aktiivinen.',
    files: [
      'src/features/app/hooks/useAppViewState.js',
      'src/features/app/ui/AppSidebar.jsx',
      'src/features/app/ui/AuthDialog.jsx'
    ]
  },
  {
    area: 'Kirjautuminen ja sessio',
    purpose:
      'Lukee käyttäjän tilan, reagoi session vanhenemiseen ja hoitaa uloskirjautumisen.',
    files: [
      'src/features/app/auth/AuthContext.jsx',
      'src/features/app/auth/sessionExpiryBridge.js',
      'src/features/app/hooks/useAuthSession.js',
      'src/features/api/authApi.js',
      'src/features/api/authorizedFetch.js'
    ]
  },
  {
    area: 'Kartta',
    purpose:
      'Kartta, karttatapahtumat, markerit, sijaintitiedot ja kartan ohjaimet.',
    files: [
      'src/features/map/MapPage.jsx',
      'src/features/map/components/MapEffects.jsx',
      'src/features/map/components/MapLegend.jsx',
      'src/features/map/components/MapStatusOverlay.jsx',
      'src/features/map/components/TheftMarkersLayer.jsx',
      'src/features/map/ui/MapControls.jsx',
      'src/features/map/hooks/useVisibleThefts.js',
      'src/features/map/hooks/useUserLocationMarker.js'
    ]
  },
  {
    area: 'Varkausilmoituksen luonti',
    purpose:
      'Lomake, kenttäryhmät, validointi, sijainti ja kuvien sisältävä tallennuspyyntö.',
    files: [
      'src/features/map/ui/TheftReportForm.jsx',
      'src/features/map/ui/theftReportForm/useTheftReportForm.js',
      'src/features/map/ui/theftReportForm/BikeDetailsSection.jsx',
      'src/features/map/ui/theftReportForm/DateTimeField.jsx',
      'src/features/map/ui/theftReportForm/LocationSection.jsx',
      'src/features/map/ui/theftReportForm/formOptions.js'
    ]
  },
  {
    area: 'Ilmoitukset ja havainnot',
    purpose:
      'Yksityiskohtanäkymä, tilan päivitys, havaintolomake ja kuvien esitys.',
    files: [
      'src/features/map/ui/TheftReportDetailsSidebar.jsx',
      'src/features/map/ui/SightingReportPage.jsx',
      'src/features/map/ui/MyTheftReportsSidebar.jsx',
      'src/features/map/ui/ImageCarousel.jsx',
      'src/features/map/utils/reportFormatters.js',
      'src/features/map/utils/reportImages.js'
    ]
  },
  {
    area: 'Tekstit ja dokumentaatio',
    purpose:
      'Kielen valinta, käyttöliittymätekstit ja projektin sisäinen dokumentaatio.',
    files: [
      'src/features/app/i18n/LanguageContext.jsx',
      'src/features/app/i18n/translations.js',
      'src/features/app/docs/DocumentationPage.jsx',
      'src/features/app/docs/DocumentationPage.css'
    ]
  },
  {
    area: 'Testit',
    purpose:
      'Vitest-testit keskeisille näkymille, API-kutsuille ja karttakäytökselle.',
    files: ['src/test/app/*', 'src/test/map/*', 'src/test/api/*', 'src/test/setup.js']
  }
];

const backendMap = [
  {
    area: 'Käynnistys ja asetukset',
    purpose:
      'Spring Boot -projektin rakenne, asetukset ja paikallinen kehitysympäristö.',
    files: [
      'pom.xml',
      'docker-compose.yaml',
      'example.env',
      'src/main/resources/application.properties',
      'src/main/java/com/rkrs/bikethefttracker/BikeTheftTrackerApplication.java'
    ]
  },
  {
    area: 'Rajapinta',
    purpose:
      'HTTP-rajapinta kirjautumiselle, ilmoituksille, havainnoille ja ilmoituksille.',
    files: [
      'src/main/java/com/rkrs/bikethefttracker/controller/AuthController.java',
      'src/main/java/com/rkrs/bikethefttracker/controller/TheftReportController.java',
      'src/main/java/com/rkrs/bikethefttracker/controller/SightingController.java',
      'src/main/java/com/rkrs/bikethefttracker/controller/NotificationController.java'
    ]
  },
  {
    area: 'Liiketoimintalogiikka',
    purpose:
      'Keskeinen sovelluslogiikka: ilmoitukset, pyörät, havainnot, kuvat ja käyttäjän toiminnot.',
    files: [
      'src/main/java/com/rkrs/bikethefttracker/service/TheftReportService.java',
      'src/main/java/com/rkrs/bikethefttracker/service/BikeService.java',
      'src/main/java/com/rkrs/bikethefttracker/service/SightingService.java',
      'src/main/java/com/rkrs/bikethefttracker/service/NotificationService.java',
      'src/main/java/com/rkrs/bikethefttracker/service/ImageStorageService.java'
    ]
  },
  {
    area: 'Tietoturva ja tokenit',
    purpose:
      'Kirjautuminen, tokenit, suodattimet ja käyttäjän tunnistus.',
    files: [
      'src/main/java/com/rkrs/bikethefttracker/security/AuthenticationService.java',
      'src/main/java/com/rkrs/bikethefttracker/security/JwtService.java',
      'src/main/java/com/rkrs/bikethefttracker/security/RefreshTokenService.java',
      'src/main/java/com/rkrs/bikethefttracker/filter/JwtFilter.java',
      'src/main/java/com/rkrs/bikethefttracker/config/SecurityConfig.java'
    ]
  },
  {
    area: 'Data ja domain',
    purpose:
      'Entiteetit, repositoryt, DTO:t ja mapperit API:n ja tietokannan välillä.',
    files: [
      'src/main/java/com/rkrs/bikethefttracker/entity/*',
      'src/main/java/com/rkrs/bikethefttracker/repository/*',
      'src/main/java/com/rkrs/bikethefttracker/dto/*',
      'src/main/java/com/rkrs/bikethefttracker/mapper/*'
    ]
  },
  {
    area: 'Testit',
    purpose:
      'Controller-, service-, repository-, mapper- ja entiteettitestit sekä testischema.',
    files: [
      'src/test/java/com/rkrs/bikethefttracker/controller/*',
      'src/test/java/com/rkrs/bikethefttracker/service/*',
      'src/test/java/com/rkrs/bikethefttracker/repository/*',
      'src/test/java/com/rkrs/bikethefttracker/mapper/*',
      'src/test/resources/schema.sql'
    ]
  }
];

const keySymbols = [
  {
    symbol: 'useAppViewState()',
    file: 'src/features/app/hooks/useAppViewState.js',
    why:
      'Kaikki sidebarin, loginin, detailien ja lomakkeiden siirtymät kulkevat täältä.',
    editWhen:
      'Muuta tätä aina, jos lisäät uuden panelin, uuden modaalin tai haluat muuttaa nykyistä käyttöpolkua.'
  },
  {
    symbol: 'AppContent',
    file: 'src/App.jsx',
    why:
      'Sovelluksen kokoonpanokerros. Yhdistää authin, ilmoitukset, dokumentaation, flash-viestit ja kartan.',
    editWhen:
      'Koske tähän, kun lisäät uuden ylätason toiminnon, header-actionin tai footer-linkin.'
  },
  {
    symbol: 'authorizedFetch()',
    file: 'src/features/api/authorizedFetch.js',
    why:
      'Toteuttaa 401 -> refresh -> retry -ketjun. Ilman tätä sessio käyttäytyisi hajanaisesti eri API-kutsuissa.',
    editWhen:
      'Muuta, jos autentikointimalli, cookie-politiikka tai session vanhenemisen UX muuttuu.'
  },
  {
    symbol: 'useTheftReportForm()',
    file: 'src/features/map/ui/theftReportForm/useTheftReportForm.js',
    why:
      'Sisältää ilmoituslomakkeen validoinnit, payload-muotoilun ja submit-logiikan.',
    editWhen:
      'Muuta, kun lisäät kenttiä, vaihdat validointisääntöjä tai muutat backendin odottamaa request-rakennetta.'
  },
  {
    symbol: 'MapPage',
    file: 'src/features/map/MapPage.jsx',
    why:
      'Karttanäkymä on käyttökokemuksen ydin. Tämä yhdistää Leafletin, kontrollit, markerit ja picker-tilat.',
    editWhen:
      'Muuta, kun kartalle tulee uusi overlay, markerityyppi, geolokaatio- tai interaktiokäytös.'
  },
  {
    symbol: 'MapEffects.*',
    file: 'src/features/map/components/MapEffects.jsx',
    why:
      'Useat kriittiset karttasivuvaikutukset on erotettu tänne: keskitys, click-picker, lukitus ja näkyvien ilmoitusten lataus.',
    editWhen:
      'Muuta, jos karttatapahtumien elinkaari tai sivuvaikutusten ajoitus aiheuttaa bugeja.'
  },
  {
    symbol: 'TheftReportService',
    file: 'src/main/java/com/rkrs/bikethefttracker/service/TheftReportService.java',
    why:
      'Keskeinen backend-luokka varkausilmoitusten CRUD-poluille, omistajuustarkistuksille ja kuvaliitoksille.',
    editWhen:
      'Muuta, kun ilmoituksen dataa, omistajuussääntöjä tai kuvien tallennuspolkua muutetaan.'
  },
  {
    symbol: 'AuthenticationService',
    file: 'src/main/java/com/rkrs/bikethefttracker/security/AuthenticationService.java',
    why:
      'Rakentaa login- ja refresh-token -ketjun. Frontendin sessionhallinta nojaa suoraan tämän käytökseen.',
    editWhen:
      'Muuta, kun tokenien elinkaari, refresh-logiikka tai kirjautumisen vaste muuttuu.'
  },
  {
    symbol: 'SightingService.createSighting()',
    file: 'src/main/java/com/rkrs/bikethefttracker/service/SightingService.java',
    why:
      'Tallentaa havainnon, liittää kuvan ja luo samalla notifikaation omistajalle.',
    editWhen:
      'Muuta, jos havaintovirta, notifikaatioehdot tai sighting-kuvien käsittely muuttuu.'
  }
];

const workflows = [
  {
    title: 'Kirjautuminen ja session automaattinen uusinta',
    steps: [
      'UI kutsuu `authApi`-funktioita ja tallentaa käyttäjän `AuthContext`iin.',
      '`authorizedFetch()` tekee protected-kutsut aina cookieilla.',
      'Jos backend palauttaa `401`, frontend yrittää automaattisesti `POST /auth/refresh`.',
      'Jos refresh epäonnistuu, `sessionExpiryBridge` ilmoittaa UI:lle ja `useAppViewState` ohjaa käyttäjän takaisin login-näkymään.'
    ]
  },
  {
    title: 'Kartalla näkyvien ilmoitusten lataus',
    steps: [
      '`MapPage` alustaa Leaflet-kartan ja liittää `VisibleTheftsLoader`-efektin.',
      '`moveend`-tapahtuma laukaisee `useVisibleThefts`-hookin latauksen.',
      'Hook muodostaa bbox-parametrit utilin kautta ja hakee rajatun listan backendiltä.',
      '`TheftMarkersLayer` renderöi markerit ja palauttaa valitun ilmoituksen takaisin Appin näkymätilaan.'
    ]
  },
  {
    title: 'Varkausilmoituksen luonti',
    steps: [
      '`AppSidebar` avaa `TheftReportForm`-komponentin.',
      '`useTheftReportForm()` validoi kentät, rakentaa payloadin ja tarkistaa sijainnin.',
      '`theftReportApi.createTheftReport()` muodostaa multipart-pyynnön, jossa JSON ja kuvat kulkevat samassa requestissa.',
      'Backendin `TheftReportController` delegoi pyynnön `TheftReportService`-luokalle, joka luo ilmoituksen, pyörän ja kuvat.'
    ]
  },
  {
    title: 'Havainto ja notifikaatio',
    steps: [
      'Detaljinäkymä avaa `SightingReportPage`-komponentin valitulle ilmoitukselle.',
      'Frontend lähettää havainnon mahdollisen kuvan kanssa theft report -endpointin ali.',
      '`SightingService.createSighting()` tallentaa havainnon ja liittää kuvan.',
      '`NotificationService.createNotification()` luo omistajalle lukemattoman ilmoituksen, jonka frontend näyttää kellovalikossa.'
    ]
  }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9åäö\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function renderTextWithCode(text) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function Section({ id, eyebrow, title, description, sectionRef, children }) {
  return (
    <section className="docs-section" id={id} ref={sectionRef}>
      <div className="docs-section__intro">
        {eyebrow ? <p className="docs-section__eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function FileList({ files }) {
  return (
    <ul className="docs-file-list">
      {files.map((file) => (
        <li key={file}>
          <code>{file}</code>
        </li>
      ))}
    </ul>
  );
}

function MapTable({ rows }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            <th>Alue</th>
            <th>Tarkoitus</th>
            <th>Keskeiset tiedostot</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.area}>
              <td>{row.area}</td>
              <td>{row.purpose}</td>
              <td>
                <FileList files={row.files} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SymbolTable() {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            <th>Symboli</th>
            <th>Tiedosto</th>
            <th>Miksi tämän ymmärtäminen kannattaa</th>
            <th>Milloin muokkaat tätä</th>
          </tr>
        </thead>
        <tbody>
          {keySymbols.map((item) => (
            <tr key={item.symbol}>
              <td>
                <code>{item.symbol}</code>
              </td>
              <td>
                <code>{item.file}</code>
              </td>
              <td>{item.why}</td>
              <td>{item.editWhen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableOfContents({ sections, activeId, onNavigate, onClose }) {
  return (
    <aside className="docs-toc">
      <div className="docs-toc__header">
        <h3>Sisällysluettelo</h3>
        <button
          type="button"
          className="docs-toc__close"
          onClick={onClose}
          aria-label="Sulje sisällysluettelo"
        >
          <X size={18} />
        </button>
      </div>

      <nav>
        <ul className="docs-toc__list">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                className={
                  activeId === section.id
                    ? 'docs-toc__link docs-toc__link--active'
                    : 'docs-toc__link'
                }
                onClick={() => onNavigate(section.id)}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default function DocumentationPage({ onClose }) {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const sectionRefs = useRef({});
  const sections = useMemo(
    () => [
      { id: slugify('Projektin rakenne'), title: 'Projektin rakenne' },
      { id: slugify('Muutosten lähtöpisteet'), title: 'Muutosten lähtöpisteet' },
      { id: slugify('Frontend ja backend'), title: 'Frontend ja backend' },
      { id: slugify('Frontendin tiedostokartta'), title: 'Frontendin tiedostokartta' },
      { id: slugify('Backendin tiedostokartta'), title: 'Backendin tiedostokartta' },
      { id: slugify('Keskeiset toteutuskohdat'), title: 'Keskeiset toteutuskohdat' },
      { id: slugify('Keskeiset toimintopolut'), title: 'Keskeiset toimintopolut' }
    ],
    []
  );

  useEffect(() => {
    const observers = sections
      .map((section) => {
        const element = sectionRefs.current[section.id];
        if (!element) {
          return null;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSectionId(section.id);
              }
            });
          },
          {
            rootMargin: '-120px 0px -55% 0px',
            threshold: 0.1
          }
        );

        observer.observe(element);
        return observer;
      })
      .filter(Boolean);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  useEffect(() => {
    if (!activeSectionId && sections.length > 0) {
      setActiveSectionId(sections[0].id);
    }
  }, [activeSectionId, sections]);

  function scrollToSection(sectionId) {
    const target = sectionRefs.current[sectionId];
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    setActiveSectionId(sectionId);
    setTocOpen(false);
  }

  return (
    <div className="docs-page">
      <header className="docs-page__header">
        <div>
          <p className="docs-page__eyebrow">Projektidokumentaatio</p>
          <h1>Bike Theft Tracker</h1>
        </div>

        <div className="docs-page__header-actions">
          {onClose ? (
            <button
              type="button"
              className="docs-page__close"
              onClick={onClose}
              aria-label="Sulje dokumentaatio"
            >
              <X size={20} />
            </button>
          ) : null}
        </div>
      </header>

      <div className="docs-page__body">
        <div
          className={
            tocOpen
              ? 'docs-page__sidebar docs-page__sidebar--open'
              : 'docs-page__sidebar'
          }
        >
          <TableOfContents
            sections={sections}
            activeId={activeSectionId}
            onNavigate={scrollToSection}
            onClose={() => setTocOpen(false)}
          />
        </div>

        <main className="docs-content">
          <Section
            id={sections[0].id}
            eyebrow="Projektin juuri"
            title="Projektin rakenne"
            description="Tiivis näkymä repositorion tärkeimmistä kansioista ja tiedostoista juuritasolta alkaen."
            sectionRef={(element) => {
              sectionRefs.current[sections[0].id] = element;
            }}
          >
            <div className="docs-tree-card">
              <pre className="docs-tree">{projectTree}</pre>
            </div>
          </Section>

          <Section
            id={sections[1].id}
            eyebrow="Nopea haku"
            title="Muutosten lähtöpisteet"
            description="Aloita tästä, kun tiedät mitä haluat muuttaa, mutta et vielä oikeaa tiedostoa."
            sectionRef={(element) => {
              sectionRefs.current[sections[1].id] = element;
            }}
          >
            <div className="docs-quick-grid">
              {quickGuides.map((guide) => (
                <article key={guide.title} className="docs-card">
                  <div className="docs-card__header docs-card__header--inline">
                    <h3>{guide.title}</h3>
                  </div>
                  <p>{guide.summary}</p>
                  <FileList files={guide.files} />
                </article>
              ))}
            </div>
          </Section>

          <Section
            id={sections[2].id}
            eyebrow="Jako osa-alueisiin"
            title="Frontend ja backend"
            description="Useimmat muutokset koskevat vain toista kokonaisuutta. Tämä jako auttaa siirtymään heti oikeaan projektiin."
            sectionRef={(element) => {
              sectionRefs.current[sections[2].id] = element;
            }}
          >
            <div className="docs-split-grid">
              <article className="docs-feature-card docs-feature-card--split">
                <div className="docs-feature-card__title docs-feature-card__title--start">
                  <Layers3 size={18} />
                  <h3>Frontend</h3>
                </div>
                <p>
                  Työskentele frontendissä, kun muokkaat käyttöliittymää,
                  näkymien logiikkaa, karttaa, lomakkeita, tekstejä tai
                  selainpuolen API-kutsuja.
                </p>
                <FileList
                  files={[
                    'src/App.jsx',
                    'src/features/app/*',
                    'src/features/map/*',
                    'src/features/api/*',
                    'src/test/*'
                  ]}
                />
              </article>

              <article className="docs-feature-card docs-feature-card--split">
                <div className="docs-feature-card__title docs-feature-card__title--start">
                  <Shield size={18} />
                  <h3>Backend</h3>
                </div>
                <p>
                  Työskentele backendissä, kun muokkaat rajapintoja,
                  DTO-rakenteita, sovelluslogiikkaa, tietoturvaa,
                  tietokantakyselyitä tai tiedostojen tallennusta.
                </p>
                <FileList
                  files={[
                    'src/main/java/com/rkrs/bikethefttracker/controller/*',
                    'src/main/java/com/rkrs/bikethefttracker/service/*',
                    'src/main/java/com/rkrs/bikethefttracker/security/*',
                    'src/main/java/com/rkrs/bikethefttracker/repository/*',
                    'src/test/java/com/rkrs/bikethefttracker/*'
                  ]}
                />
              </article>
            </div>
          </Section>

          <Section
            id={sections[3].id}
            eyebrow="Frontend"
            title="Frontendin tiedostokartta"
            description="Polut ovat suhteessa frontend-projektin juureen. Taulukko kertoo, mistä kukin ominaisuus käytännössä löytyy."
            sectionRef={(element) => {
              sectionRefs.current[sections[3].id] = element;
            }}
          >
            <MapTable rows={frontendMap} />
          </Section>

          <Section
            id={sections[4].id}
            eyebrow="Backend"
            title="Backendin tiedostokartta"
            description="Polut ovat suhteessa backend-projektin juureen. Taulukko auttaa erottamaan rajapinnan, sovelluslogiikan ja tietoturvan toisistaan."
            sectionRef={(element) => {
              sectionRefs.current[sections[4].id] = element;
            }}
          >
            <MapTable rows={backendMap} />
            <div className="docs-inline-note">
              API-dokumentaatio löytyy Swagger UI:sta osoitteesta{' '}
              <code>http://localhost:8080/swagger-ui/index.html</code>, kun
              backend on käynnissä.
            </div>
          </Section>

          <Section
            id={sections[5].id}
            eyebrow="Keskeiset toteutuskohdat"
            title="Keskeiset toteutuskohdat"
            description="Nämä funktiot, komponentit ja luokat vaikuttavat laajasti sovelluksen toimintaan, joten ne kannattaa ymmärtää ennen suurempia muutoksia."
            sectionRef={(element) => {
              sectionRefs.current[sections[5].id] = element;
            }}
          >
            <SymbolTable />
          </Section>

          <Section
            id={sections[6].id}
            eyebrow="Toiminnan kulku"
            title="Keskeiset toimintopolut"
            description="Tässä on kuvattu tärkeimmät polut, joita pitkin käyttöliittymä ja data etenevät sovelluksessa."
            sectionRef={(element) => {
              sectionRefs.current[sections[6].id] = element;
            }}
          >
            <div className="docs-workflows">
              {workflows.map((workflow) => (
                <article key={workflow.title} className="docs-workflow">
                  <h3>{workflow.title}</h3>
                  <ol>
                    {workflow.steps.map((step) => (
                      <li key={step}>{renderTextWithCode(step)}</li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </Section>

          <footer className="docs-footer-note">
            Dokumentoinnissa hyödynnetty tekoälyä
          </footer>
        </main>
      </div>
    </div>
  );
}
