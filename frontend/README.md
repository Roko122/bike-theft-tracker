# Polkupyörä tracker – Map frontend (Vite + React + JavaScript + Leaflet + React Bootstrap + lucide react)

- Koodi on JavaScriptiä

## Käyttö

1) Pura zip ja avaa kansio VS Codessa
2) Asenna:
   - `npm install`
3) Käynnistä:
   - `npm run dev`
4) Avaa Viten URL

## Missä muokataan?

- Karttasivu: `src/features/map/MapPage.jsx`
- Kontrolit/valikko: `src/features/map/ui/MapControls.jsx`
- Tyylit: `src/styles.css`

## Bootsrap ja Lucide

- Bootstrap: Valmiit UI komponentit
- Lucide: valmis ikoni kirjasto

Tavoitteena:
- Yhtenäinen ulkoasu
- Vähemmän omaa CSS-koodia
- Nopeampi kehitys
- Selkeä ja ylläpidettävä komponenttirakenne

### Riippuvuudet

Frontend-kansiossa:
- `npm install react-bootstrap bootstrap lucide-react`

## React Bootstarp käyttö

React Bootstrap -komponentteja käytetään **React-komponenttitiedostoissa (.jsx)**.

Esimerkiksi:

- `src/features/map/ui/MapControls.jsx`
- `src/features/theft-report/TheftReportForm.jsx`
- `src/components/ui/SomeCard.jsx`

## Importointi

Lisää komponenttitiedoston alkuun, eli sen jsx tiedoston alkuun jossa komponenttia käytetään:

`import { Button, Card, Form, Alert } from "react-bootstrap";`

## Nappi

Kirjoitetaan React-komponentin return-osaan.

<Button variant="primary">Tallenna</Button>
<Button variant="outline-secondary">Peruuta</Button>
<Button variant="danger">Poista</Button>


## Kortti (Card)

Kirjoitetaan komponentin return-osaan.

<Card className="shadow-sm">
  <Card.Body>
    <Card.Title>Otsikko</Card.Title>
    <Card.Text>Tähän sisältöä.</Card.Text>
  </Card.Body>
</Card>

Käytetään esimerkiksi:
- Ilmoituksen näyttämisessä
- Sivun rakenteessa
- Modal-sisällössä

Esim.:
src/features/theft-report/TheftReportCard.jsx

## Alert

<Alert variant="warning">
  Tämä on varoitusviesti.
</Alert>

Käytetään esimerkiksi:
- Virheilmoituksissa
- Onnistumisviesteissä
- Lomakevalidoinnissa

Esim.:
src/features/theft-report/TheftReportForm.jsx

## Lomake (Form)

Kirjoitetaan lomakekomponenttiin, esimerkiksi:

src/features/theft-report/TheftReportForm.jsx

<Form>
  <Form.Group className="mb-3">
    <Form.Label>Kuvaus</Form.Label>
    <Form.Control
      type="text"
      placeholder="Kirjoita kuvaus"
    />
  </Form.Group>

  <Button variant="primary">Lähetä</Button>
</Form>

Lomakkeita käytetään:
-Varkausilmoituksen luontiin
-Hakutoimintoihin
-Asetuksiin