export const translations = {
  fi: {
    common: {
      appName: 'Bike Theft Tracker',
      language: 'Kieli',
      finnish: 'Suomi',
      english: 'Englanti',
      loading: 'Ladataan...'
    },
    flash: {
      theftSaved: 'Varkausilmoitus tallennettu.',
      sightingSaved: 'Havaintoilmoitus tallennettu.',
      loginSuccess: 'Kirjautuminen onnistui.',
      logoutSuccess: 'Uloskirjautuminen onnistui.'
    },
    app: {
      openMenu: 'Avaa valikko',
      closeMenu: 'Sulje valikko',
      loggedIn: 'Kirjautunut',
      loginOrRegister: 'Kirjaudu tai rekisteröidy',
      logout: 'Kirjaudu ulos',
      github: 'GitHub',
      docs: 'Dokumentaatio'
    },
    sidebar: {
      back: 'Takaisin',
      eyebrow: 'Kartta ja ilmoitukset',
      title: 'Pyörävarkaudet yhdellä näkymällä',
      subtitle: 'Avaa ilmoitus kartalta tai lisää uusi havainto nopeasti nykyiseen sijaintiin.',
      newTheftReport: 'Uusi varkausilmoitus',
      loginRequired: 'Ilmoituksen lähettäminen vaatii kirjautumisen.',
      login: 'Kirjaudu sisään'
    },
    auth: {
      account: 'Käyttäjätili',
      createAccount: 'Rekisteröidy',
      closeDialog: 'Sulje kirjautumisikkuna'
    },
    login: {
      eyebrow: 'Tervetuloa takaisin',
      title: 'Kirjaudu sisään',
      subtitle: 'Hallitse ilmoituksia ja lisää uusia varkauksia kartalle.',
      username: 'Käyttäjänimi',
      password: 'Salasana',
      submit: 'Kirjaudu',
      submitting: 'Kirjaudutaan...',
      createAccount: 'Luo tunnus',
      error: 'Kirjautuminen epäonnistui'
    },
    register: {
      eyebrow: 'Uusi käyttäjä',
      title: 'Luo tunnus',
      subtitle: 'Rekisteröidy, jotta voit lisätä omia ilmoituksia ja hallita niitä.',
      username: 'Käyttäjätunnus',
      email: 'Sähköposti',
      password: 'Salasana',
      confirmPassword: 'Salasana uudelleen',
      create: 'Luo tili',
      creating: 'Luodaan tiliä...',
      passwordMismatch: 'Salasanat eivät ole samat',
      passwordInvalid: 'Salasana ei täytä vaatimuksia',
      passwordsDoNotMatch: 'Salasanat eivät täsmää',
      error: 'Rekisteröinti epäonnistui',
      showPassword: 'Näytä salasana',
      hidePassword: 'Piilota salasana',
      show: 'Näytä',
      hide: 'Piilota'
    },
    theftForm: {
      eyebrow: 'Uusi ilmoitus',
      title: 'Varkausilmoitus',
      subtitle: 'Lisää pyörän tiedot, tapahtuma-aika ja sijainti mahdollisimman tarkasti.',
      description: 'Kuvaus',
      descriptionPlaceholder: 'Pyörä varastettiin kaupan edestä lukittuna noin klo 14.00-14.30.',
      theftTime: 'Tapahtuma-aika',
      theftTimePlaceholder: 'Valitse päivä',
      theftAddress: 'Osoite',
      theftAddressPlaceholder: 'Kauppakatu 29',
      location: 'Sijainti',
      bikeSection: 'Pyörän tiedot',
      bikeDescription: 'Lisäkuvaus pyörästä',
      bikeDescriptionPlaceholder: 'Ruosteinen mutta hyvässä kunnossa. Etukori, tarakka ja harmaat renkaat.',
      images: 'Kuvat',
      addImages: 'Lisää kuvia pyörästä',
      imagesHint: 'PNG, JPG tai JPEG. Voit lisätä enintään 5 kuvaa.',
      submit: 'Lähetä ilmoitus',
      submitting: 'Lähetetään...',
      useMyLocation: 'Käytä omaa sijaintia',
      pickFromMap: 'Valitse kartalta',
      clearLocation: 'Tyhjennä sijainti',
      myLocation: 'Oma sijainti',
      selectedOnMap: 'Valittu kartalta',
      selectLocationHint: 'Valitse sijainti käyttämällä omaa sijaintia tai karttaa.',
      tooltips: {
        description: 'Kuvaile mahdollisimman tarkasti, mitä tapahtui ja miten varkaus havaittiin.',
        theftTime: 'Valitse päivä ja aika, jolloin varkaus tapahtui.',
        theftAddress: 'Anna lähin osoite, jossa varkaus tapahtui.',
        location: 'Valitse sijainti käyttämällä omaa sijaintiasi tai valitsemalla paikka kartalta.',
        bike: 'Täytä pyörän tiedot mahdollisimman tarkasti.',
        bikeDescription: 'Kerro pyörän tuntomerkit, lisävarusteet, tarrat, korit, vauriot tai muut tunnistamista helpottavat tiedot.'
      },
      bikeFields: {
        brand: { label: 'Merkki', placeholder: 'Helkama' },
        model: { label: 'Malli', placeholder: 'Trail 7' },
        type: { label: 'Tyyppi', placeholder: 'Maastopyörä' },
        color: { label: 'Väri', placeholder: 'Sininen' },
        serialNumber: { label: 'Sarjanumero', placeholder: '123456789' }
      },
      errors: {
        descriptionRequired: 'Kuvaus on pakollinen.',
        theftTimeRequired: 'Varkauden aika on pakollinen.',
        locationMissing: 'Sijainti puuttuu. Valitse oma sijainti tai kartalta.',
        invalidLocation: 'Sijainti ei ole kelvollinen (latitude/longitude rajojen ulkopuolella).',
        tooManyImages: 'Voit lisätä enintään 5 kuvaa.',
        saveFailed: 'Tallennus epäonnistui.',
        geolocationUnsupported: 'Selaimesi ei tue sijainnin hakua (geolocation).',
        geolocationFailed: 'Sijainnin haku epäonnistui. Tarkista selaimen luvat.'
      }
    },
    sighting: {
      eyebrow: 'Uusi havainto',
      title: 'Havaintoilmoitus',
      subtitle: 'Kirjaa missä pyörä havaittiin ja lisää kuva, jos sellainen on.',
      whatDidYouSee: 'Mitä havaitsit?',
      descriptionPlaceholder: 'Kuvaile mahdollisimman tarkasti mitä näit, milloin ja missä tilanteessa.',
      image: 'Kuva',
      chooseImage: 'Valitse kuva',
      imageHint: 'Enintään 1 kuva. PNG, JPG tai JPEG. Maksimikoko 5 MB.',
      location: 'Sijainti',
      useMyLocation: 'Käytä omaa sijaintia',
      pickFromMap: 'Valitse kartalta',
      clearLocation: 'Tyhjennä sijainti',
      myLocation: 'Oma sijainti',
      selectedOnMap: 'Valittu kartalta',
      selectLocationHint: 'Valitse sijainti käyttämällä omaa sijaintia tai karttaa.',
      submit: 'Lähetä havaintoilmoitus',
      submitting: 'Tallennetaan...',
      errors: {
        missingReportId: 'Valitun ilmoituksen tunniste puuttuu. Avaa havainto ilmoituksen kautta.',
        descriptionRequired: 'Kuvaus on pakollinen.',
        locationMissing: 'Sijainti puuttuu. Valitse oma sijainti tai kartalta.',
        invalidLocation: 'Sijainti ei ole kelvollinen.',
        imageTooLarge: 'Kuvan enimmäiskoko on 5 MB.',
        saveFailed: 'Havaintoilmoituksen tallennus epäonnistui.',
        geolocationUnsupported: 'Selaimesi ei tue sijainnin hakua.',
        geolocationFailed: 'Sijainnin haku epäonnistui. Tarkista luvat.'
      }
    },
    details: {
      title: 'Varkausilmoitus',
      fetchFailed: 'Ilmoituksen haku epäonnistui',
      unknownStatus: 'Tila tuntematon',
      status: {
        ACTIVE: 'Aktiivinen ilmoitus',
        SIGHTED: 'Havainto tehty',
        RECOVERED: 'Pyörä palautunut',
        CLOSED: 'Ilmoitus suljettu'
      },
      sections: {
        images: 'Kuvat',
        basics: 'Perustiedot',
        location: 'Sijainti',
        bike: 'Pyörän tiedot'
      },
      fields: {
        description: 'Kuvaus',
        theftTime: 'Tapahtuma-aika',
        address: 'Osoite',
        brand: 'Merkki',
        model: 'Malli',
        type: 'Tyyppi',
        color: 'Väri',
        serialNumber: 'Sarjanumero',
        bikeDescription: 'Lisäkuvaus'
      },
      sighting: {
        label: 'Havainto',
        button: 'Tee havaintoilmoitus',
        tooltip: 'Jos olet nähnyt pyörän tai tiedät siitä jotain, voit tehdä havaintoilmoituksen tämän painikkeen kautta.',
        tooltipAria: 'Lisätietoa havaintoilmoituksesta'
      }
    },
    popup: {
      eyebrow: 'Varkausilmoitus',
      unknownBike: 'Tuntematon pyörä',
      open: 'Avaa ilmoitus'
    },
    map: {
      reportSaved: 'Ilmoitus tallennettu!',
      pickHint: 'Klikkaa karttaa valitaksesi sijainti',
      legendAria: 'Karttamerkkien selite',
      legendTitle: 'Merkintöjen värit'
    },
    passwordRules: {
      minLength: 'Vähintään 8 merkkiä',
      hasUppercase: 'Sisältää ison kirjaimen',
      hasLowercase: 'Sisältää pienen kirjaimen',
      hasNumber: 'Sisältää numeron',
      hasSpecial: 'Sisältää erikoismerkin'
    },
    reportFields: {
      id: 'id',
      brand: 'Merkki',
      model: 'Malli',
      type: 'Tyyppi',
      color: 'Väri',
      status: 'Tila',
      theftTime: 'Tapahtuma-aika',
      description: 'Lisäkuvaus'
    }
  },
  en: {
    common: {
      appName: 'Bike Theft Tracker',
      language: 'Language',
      finnish: 'Finnish',
      english: 'English',
      loading: 'Loading...'
    },
    flash: {
      theftSaved: 'The theft report was saved.',
      sightingSaved: 'The sighting report was saved.',
      loginSuccess: 'Signed in successfully.',
      logoutSuccess: 'Signed out successfully.'
    },
    app: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      loggedIn: 'Signed in',
      loginOrRegister: 'Sign in or register',
      logout: 'Sign out',
      github: 'GitHub',
      docs: 'Documentation'
    },
    sidebar: {
      back: 'Back',
      eyebrow: 'Map and reports',
      title: 'Bike thefts in one view',
      subtitle: 'Open a report from the map or add a new sighting quickly for the current area.',
      newTheftReport: 'New theft report',
      loginRequired: 'Submitting a report requires signing in.',
      login: 'Sign in'
    },
    auth: {
      account: 'User account',
      createAccount: 'Register an account',
      closeDialog: 'Close sign-in dialog'
    },
    login: {
      eyebrow: 'Welcome back',
      title: 'Sign in',
      subtitle: 'Manage reports and add new bike thefts to the map.',
      username: 'Username',
      password: 'Password',
      submit: 'Sign in',
      submitting: 'Signing in...',
      createAccount: 'Create account',
      error: 'Sign-in failed'
    },
    register: {
      eyebrow: 'New user',
      title: 'Create account',
      subtitle: 'Register so you can add your own reports and manage them.',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      create: 'Create account',
      creating: 'Creating account...',
      passwordMismatch: 'Passwords do not match',
      passwordInvalid: 'Password does not meet the requirements',
      passwordsDoNotMatch: 'Passwords do not match',
      error: 'Registration failed',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      show: 'Show',
      hide: 'Hide'
    },
    theftForm: {
      eyebrow: 'New report',
      title: 'Theft report',
      subtitle: 'Add the bike details, time of the incident and location as accurately as possible.',
      description: 'Description',
      descriptionPlaceholder: 'The bike was stolen from in front of a store while locked between 14:00 and 14:30.',
      theftTime: 'Time of incident',
      theftTimePlaceholder: 'Select date',
      theftAddress: 'Address',
      theftAddressPlaceholder: 'Main Street 29',
      location: 'Location',
      bikeSection: 'Bike details',
      bikeDescription: 'Additional bike details',
      bikeDescriptionPlaceholder: 'Rusty but in good condition. Front basket, rack and grey tires.',
      images: 'Images',
      addImages: 'Add bike images',
      imagesHint: 'PNG, JPG or JPEG. You can add up to 5 images.',
      submit: 'Submit report',
      submitting: 'Submitting...',
      useMyLocation: 'Use my location',
      pickFromMap: 'Pick from map',
      clearLocation: 'Clear location',
      myLocation: 'My location',
      selectedOnMap: 'Selected on map',
      selectLocationHint: 'Choose a location using your own location or the map.',
      tooltips: {
        description: 'Describe as accurately as possible what happened and how the theft was noticed.',
        theftTime: 'Choose the date and time when the theft happened.',
        theftAddress: 'Enter the nearest address where the theft happened.',
        location: 'Choose a location using your own position or by selecting a place on the map.',
        bike: 'Fill in the bike details as accurately as possible.',
        bikeDescription: 'Describe distinctive marks, accessories, stickers, baskets, damage or other details that help identify the bike.'
      },
      bikeFields: {
        brand: { label: 'Brand', placeholder: 'Trek' },
        model: { label: 'Model', placeholder: 'Trail 7' },
        type: { label: 'Type', placeholder: 'Mountain bike' },
        color: { label: 'Color', placeholder: 'Blue' },
        serialNumber: { label: 'Serial number', placeholder: '123456789' }
      },
      errors: {
        descriptionRequired: 'Description is required.',
        theftTimeRequired: 'The time of theft is required.',
        locationMissing: 'Location is missing. Choose your location or pick from the map.',
        invalidLocation: 'The location is not valid (latitude/longitude out of range).',
        tooManyImages: 'You can add up to 5 images.',
        saveFailed: 'Saving failed.',
        geolocationUnsupported: 'Your browser does not support geolocation.',
        geolocationFailed: 'Failed to get location. Check browser permissions.'
      }
    },
    sighting: {
      eyebrow: 'New sighting',
      title: 'Sighting report',
      subtitle: 'Record where the bike was seen and add an image if available.',
      whatDidYouSee: 'What did you observe?',
      descriptionPlaceholder: 'Describe as accurately as possible what you saw, when, and in what situation.',
      image: 'Image',
      chooseImage: 'Choose image',
      imageHint: 'At most 1 image. PNG, JPG or JPEG. Max size 5 MB.',
      location: 'Location',
      useMyLocation: 'Use my location',
      pickFromMap: 'Pick from map',
      clearLocation: 'Clear location',
      myLocation: 'My location',
      selectedOnMap: 'Selected on map',
      selectLocationHint: 'Choose a location using your own location or the map.',
      submit: 'Submit sighting report',
      submitting: 'Saving...',
      errors: {
        missingReportId: 'The selected report id is missing. Open the sighting form from a report.',
        descriptionRequired: 'Description is required.',
        locationMissing: 'Location is missing. Choose your location or pick from the map.',
        invalidLocation: 'The location is not valid.',
        imageTooLarge: 'The maximum image size is 5 MB.',
        saveFailed: 'Saving the sighting report failed.',
        geolocationUnsupported: 'Your browser does not support geolocation.',
        geolocationFailed: 'Failed to get location. Check permissions.'
      }
    },
    details: {
      title: 'Theft report',
      fetchFailed: 'Fetching the report failed',
      unknownStatus: 'Unknown status',
      status: {
        ACTIVE: 'Active report',
        SIGHTED: 'Sighting made',
        RECOVERED: 'Bike recovered',
        CLOSED: 'Report closed'
      },
      sections: {
        images: 'Images',
        basics: 'Basic information',
        location: 'Location',
        bike: 'Bike details'
      },
      fields: {
        description: 'Description',
        theftTime: 'Time of incident',
        address: 'Address',
        brand: 'Brand',
        model: 'Model',
        type: 'Type',
        color: 'Color',
        serialNumber: 'Serial number',
        bikeDescription: 'Additional details'
      },
      sighting: {
        label: 'Sighting',
        button: 'Create sighting report',
        tooltip: 'If you have seen the bike or know something about it, you can create a sighting report with this button.',
        tooltipAria: 'More information about sighting reports'
      }
    },
    popup: {
      eyebrow: 'Theft report',
      unknownBike: 'Unknown bike',
      open: 'Open report'
    },
    map: {
      reportSaved: 'Report saved!',
      pickHint: 'Click the map to select a location',
      legendAria: 'Map marker legend',
      legendTitle: 'Marker colors'
    },
    passwordRules: {
      minLength: 'At least 8 characters',
      hasUppercase: 'Contains an uppercase letter',
      hasLowercase: 'Contains a lowercase letter',
      hasNumber: 'Contains a number',
      hasSpecial: 'Contains a special character'
    },
    reportFields: {
      id: 'id',
      brand: 'Brand',
      model: 'Model',
      type: 'Type',
      color: 'Color',
      status: 'Status',
      theftTime: 'Time of incident',
      description: 'Description'
    }
  }
};
