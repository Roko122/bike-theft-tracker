# Bike Theft Tracker - Feature to File Map (Frontend + Backend)

Tämän dokumentin tarkoitus:
- Näyttää nopeasti, missä tiedostossa kukin ominaisuus on.
- Kuvata rakenne tiedosto- ja moduulitasolla (ei metodi/funktio -tasolla).

## 1) Käynnistys ja sovelluksen runko

| Ominaisuus | Tiedostot |
| --- | --- |
| React-käynnistys, globaalit CSS-importit | `src/main.jsx` |
| Sovelluksen päänäkymä, header, footer, flash-viestit | `src/App.jsx` |
| Sovelluksen yleiset tyylit | `src/styles.css` |

## 2) Navigointi ja näkymän tila

| Ominaisuus | Tiedostot |
| --- | --- |
| Sidebarin, lomakkeiden, kirjautumismodaalin ja yksityiskohtanäkymän tilakone | `src/features/app/hooks/useAppViewState.js` |
| Sidebarin eri panelit (base/form/details/sighting) | `src/features/app/ui/AppSidebar.jsx` |
| Login/Register-dialogi | `src/features/app/ui/AuthDialog.jsx` |

## 3) Auth ja sessio

| Ominaisuus | Tiedostot |
| --- | --- |
| Auth context, currentUser, logout, sessionExpiredVersion | `src/features/app/auth/AuthContext.jsx` |
| Session-expired bridge API-kerroksesta UI:hin | `src/features/app/auth/sessionExpiryBridge.js` |
| Auth-hook alias (useAuthSession) | `src/features/app/hooks/useAuthSession.js` |
| Login UI | `src/features/map/ui/loginPage.jsx` |
| Register UI + salasanan validointi | `src/features/map/ui/RegisterPage.jsx`, `src/features/map/ui/passwordValidation.js` |

## 4) Kieli ja käännökset (FI/EN)

| Ominaisuus | Tiedostot |
| --- | --- |
| Kielen vaihto, localStorage, `t()` | `src/features/app/i18n/LanguageContext.jsx` |
| Kaikki tekstisisällöt (FI/EN) | `src/features/app/i18n/translations.js` |

## 5) Kartta, markerit ja map-käyttöliittymä

| Ominaisuus | Tiedostot |
| --- | --- |
| Leaflet-kartan pääkomponentti | `src/features/map/MapPage.jsx` |
| Kartan event-efektit (map ref, click-pick, lock, auto-center, visible theft load) | `src/features/map/components/MapEffects.jsx` |
| Kartan marker-layer + popup | `src/features/map/components/TheftMarkersLayer.jsx` |
| Kartan kontrollit (zoom, center) | `src/features/map/ui/MapControls.jsx` |
| Kartan status-overlayt (save-success, pick-hint) | `src/features/map/components/MapStatusOverlay.jsx` |
| Kartan selite (status-värit) | `src/features/map/components/MapLegend.jsx` |
| Kartan vakiot (center, zoom, status-värit) | `src/features/map/constants.js` |
| Näkyvien ilmoitusten haku kartan rajoilla | `src/features/map/hooks/useVisibleThefts.js` |
| Käyttäjän sijaintimarkkeri + center/zoom helperit | `src/features/map/hooks/useUserLocationMarker.js` |
| Map-success sessionStorage-logiikka | `src/features/map/hooks/useMapSuccessMessage.js` |
| Bounds->API parametrit | `src/features/map/utils/mapBounds.js` |

## 6) Varkausilmoitus (create)

| Ominaisuus | Tiedostot |
| --- | --- |
| Varkausilmoituksen pää-UI | `src/features/map/ui/TheftReportForm.jsx` |
| Varkausilmoituksen state, validoinnit, submit | `src/features/map/ui/theftReportForm/useTheftReportForm.js` |
| Sijaintiosio (GPS/map-pick/clear) | `src/features/map/ui/theftReportForm/LocationSection.jsx` |
| Aika + päivämäärä | `src/features/map/ui/theftReportForm/DateTimeField.jsx` |
| Pyörän tiedot -osio | `src/features/map/ui/theftReportForm/BikeDetailsSection.jsx` |
| Label + tooltip komponentti | `src/features/map/ui/theftReportForm/InfoLabel.jsx` |
| Lomakekenttien asetukset ja tooltip-tekstit | `src/features/map/ui/theftReportForm/formOptions.js` |

## 7) Ilmoituksen tiedot ja havainnot

| Ominaisuus | Tiedostot |
| --- | --- |
| Ilmoituksen details-sivupaneeli | `src/features/map/ui/TheftReportDetailsSidebar.jsx` |
| Havaintoilmoituksen UI + submit | `src/features/map/ui/SightingReportPage.jsx` |
| Kuvakaruselli + lightbox | `src/features/map/ui/ImageCarousel.jsx` |
| Pieni valitun sijainnin vihje-elementti | `src/features/map/ui/LocationMarkerHint.jsx` |
| Ilmoitusten päivämäärä/field-formatointi | `src/features/map/utils/reportFormatters.js` |
| Ilmoituksen kuvien URL-resolvoinnit | `src/features/map/utils/reportImages.js` |

## 8) API-kerros

| Ominaisuus | Tiedostot |
| --- | --- |
| API base URL + prefix | `src/features/api/apiConfig.js` |
| Credentialed fetch, refresh-token retry, session-expired signalointi | `src/features/api/authorizedFetch.js` |
| Auth endpointit (`register`, `login`, `me`, `logout`) | `src/features/api/authApi.js` |
| Theft report endpointit (`list`, `byId`, `bounds`, `create`, `sighting`) | `src/features/api/theftReportApi.js` |

## 9) Testit

| Ominaisuus | Tiedostot |
| --- | --- |
| App-tason testit | `src/test/app/*` |
| Karttanäkymä-, lomake- ja details-testit | `src/test/map/*` |
| API-tason testit | `src/test/api/*` |
| Vitest setup | `src/test/setup.js` |

## 10) Dokumentaatio UI:ssa

- Footerin dokumentaatiolinkki: `src/App.jsx`
- Selainversion dokumentaatio (suora linkki appista): `public/docs/index.html`
- Markdown-lahde GitHubiin: `docs/FEATURE_MAP.md`

## 11) Backend - käynnistys ja ympäristö

| Ominaisuus | Tiedostot |
| --- | --- |
| Spring Boot -projektin build ja riippuvuudet | `../backend/pom.xml` |
| Maven wrapper | `../backend/mvnw`, `../backend/mvnw.cmd`, `../backend/.mvn/wrapper/*` |
| Backendin ympäristömuuttujat (esimerkki + paikallinen) | `../backend/example.env`, `../backend/.env` |
| Docker Compose (esim. tietokanta) | `../backend/docker-compose.yaml` |
| Springin pääkäynnistys | `../backend/src/main/java/com/rkrs/bikethefttracker/BikeTheftTrackerApplication.java` |

## 12) Backend - API, controllerit ja DTO:t

| Ominaisuus | Tiedostot |
| --- | --- |
| Auth-endpointit | `../backend/src/main/java/com/rkrs/bikethefttracker/controller/AuthController.java` |
| Theft report -endpointit | `../backend/src/main/java/com/rkrs/bikethefttracker/controller/TheftReportController.java` |
| Sighting-endpointit | `../backend/src/main/java/com/rkrs/bikethefttracker/controller/SightingController.java` |
| Notification-endpointit | `../backend/src/main/java/com/rkrs/bikethefttracker/controller/NotificationController.java` |
| API request/response -mallit | `../backend/src/main/java/com/rkrs/bikethefttracker/dto/*` |
| OpenAPI-kuvaus | `../backend/src/main/resources/static/openapi.yaml` |

## 13) Backend - domain, data ja mappaus

| Ominaisuus | Tiedostot |
| --- | --- |
| JPA-entiteetit (Bike, TheftReport, Sighting, User, Notification, Role, RefreshToken...) | `../backend/src/main/java/com/rkrs/bikethefttracker/entity/*` |
| Repositoryt (JPA-kyselyt ja data access) | `../backend/src/main/java/com/rkrs/bikethefttracker/repository/*` |
| Service-kerros (liiketoimintalogiikka) | `../backend/src/main/java/com/rkrs/bikethefttracker/service/*` |
| Mapperit entity <-> DTO | `../backend/src/main/java/com/rkrs/bikethefttracker/mapper/*` |
| Backendin app-asetukset | `../backend/src/main/resources/application.properties` |
| Testien app-asetukset + skeema | `../backend/src/test/resources/application.properties`, `../backend/src/test/resources/schema.sql` |

## 14) Backend - security, auth ja infra

| Ominaisuus | Tiedostot |
| --- | --- |
| Security-konfiguraatio | `../backend/src/main/java/com/rkrs/bikethefttracker/config/SecurityConfig.java` |
| Web/CORS-konfiguraatio | `../backend/src/main/java/com/rkrs/bikethefttracker/config/WebConfig.java`, `../backend/src/main/java/com/rkrs/bikethefttracker/properties/CorsProperties.java` |
| JWT + refresh token -logiikka | `../backend/src/main/java/com/rkrs/bikethefttracker/security/JwtService.java`, `../backend/src/main/java/com/rkrs/bikethefttracker/security/RefreshTokenService.java`, `../backend/src/main/java/com/rkrs/bikethefttracker/security/AuthenticationService.java` |
| Security-filterit | `../backend/src/main/java/com/rkrs/bikethefttracker/filter/JwtFilter.java`, `../backend/src/main/java/com/rkrs/bikethefttracker/filter/RequestLoggingFilter.java` |
| Cookie-apurit | `../backend/src/main/java/com/rkrs/bikethefttracker/util/CookiesUtil.java` |
| Poikkeuskäsittely (global + custom exceptionit) | `../backend/src/main/java/com/rkrs/bikethefttracker/exception/*` |

## 15) Backend - kuvat ja tiedostot

| Ominaisuus | Tiedostot |
| --- | --- |
| Bike-kuvien tallennushakemisto (runtime-data) | `../backend/images/bikes/*` |
| Kuvien tallennuspalvelu backendissä | `../backend/src/main/java/com/rkrs/bikethefttracker/service/ImageStorageService.java` |

## 16) Backend-testit

| Ominaisuus | Tiedostot |
| --- | --- |
| Spring context smoke test | `../backend/src/test/java/com/rkrs/bikethefttracker/BikeTheftTrackerApplicationTests.java` |
| Controller-testit (theft reports) | `../backend/src/test/java/com/rkrs/bikethefttracker/controller/*` |
| Service-testit | `../backend/src/test/java/com/rkrs/bikethefttracker/service/*` |
| Repository-testit | `../backend/src/test/java/com/rkrs/bikethefttracker/repository/*` |
| Mapper- ja entity-testit | `../backend/src/test/java/com/rkrs/bikethefttracker/mapper/*`, `../backend/src/test/java/com/rkrs/bikethefttracker/entity/*` |

## 17) Muut kansiot juuritasolla (ei osa tätä appia)

| Kansio | Huomio |
| --- | --- |
| `../hjs_week2` | Erillinen Maven-projekti (oma `.git`) |
| `../week1_tjs` | Erillinen Maven-projekti (oma `.git`) |

## 18) Projektin docs-kuvat juuritasolla

| Ominaisuus | Tiedostot |
| --- | --- |
| Frontend-kuvat / screenshotit | `../docs/frontend/*` |
| Suunnittelu- ja backend-kaaviot | `../docs/planning/*` |
