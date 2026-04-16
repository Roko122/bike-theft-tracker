import { useEffect, useState } from 'react';
import { createTheftReport } from '../../../api/theftReportApi.js';

function toIso(value) {
  return value instanceof Date ? value.toISOString() : null;
}

export function useTheftReportForm({ defaultLocation, onCreated }) {
  const [formValues, setFormValues] = useState({
    description: '',
    theftTime: new Date(),
    theftAddress: '',
    latitude: defaultLocation?.latitude ?? '',
    longitude: defaultLocation?.longitude ?? '',
    locationSource: defaultLocation ? 'map' : '',
    brand: '',
    model: '',
    type: '',
    color: '',
    serialNumber: '',
    bikeDescription: '',
    images: []
  });
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (
      defaultLocation?.latitude == null ||
      defaultLocation?.longitude == null
    ) {
      return;
    }

    setFormValues((current) => ({
      ...current,
      latitude: String(defaultLocation.latitude),
      longitude: String(defaultLocation.longitude),
      locationSource: 'map'
    }));
    setLocationError('');
  }, [defaultLocation]);

  const updateField = (name, value) => {
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const setLocation = (latitude, longitude, locationSource) => {
    setFormValues((current) => ({
      ...current,
      latitude: String(latitude),
      longitude: String(longitude),
      locationSource
    }));
  };

  const clearLocation = () => {
    setFormValues((current) => ({
      ...current,
      latitude: '',
      longitude: '',
      locationSource: ''
    }));
    setLocationError('');
  };

  const useMyLocation = () => {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Selaimesi ei tue sijainnin hakua (geolocation).');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          position.coords.latitude,
          position.coords.longitude,
          'gps'
        );
      },
      (geoError) => {
        setLocationError(
          geoError.message ||
            'Sijainnin haku epäonnistui. Tarkista selaimen luvat.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formValues.description.trim()) {
      setError('Kuvaus on pakollinen.');
      return;
    }

    if (!(formValues.theftTime instanceof Date) || Number.isNaN(formValues.theftTime.getTime())) {
      setError('Varkauden aika on pakollinen.');
      return;
    }

    const latitude = Number(formValues.latitude);
    const longitude = Number(formValues.longitude);

    if (
      !formValues.latitude ||
      !formValues.longitude ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      setError('Sijainti puuttuu. Valitse oma sijainti tai kartalta.');
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      setError(
        'Sijainti ei ole kelvollinen (latitude/longitude rajojen ulkopuolella).'
      );
      return;
    }

    const payload = {
      description: formValues.description.trim(),
      theftTime: toIso(formValues.theftTime),
      theftAddress: formValues.theftAddress.trim() || null,
      location: { latitude, longitude },
      bike: {
        brand: formValues.brand,
        model: formValues.model,
        type: formValues.type,
        color: formValues.color,
        serialNumber: formValues.serialNumber,
        description: formValues.bikeDescription
      }
    };

    try {
      if (formValues.images.length > 5) {
        setError('Voit lisätä enintään 5 kuvaa.');
        return;
      }

      setLoading(true);
      const createdReport = await createTheftReport(payload, formValues.images);
      onCreated?.(createdReport);
    } catch (submitError) {
      setError(submitError.message || 'Tallennus epäonnistui.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formValues,
    locationError,
    loading,
    error,
    updateField,
    useMyLocation,
    clearLocation,
    submit
  };
}
