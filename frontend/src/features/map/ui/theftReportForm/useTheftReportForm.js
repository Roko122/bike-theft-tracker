import { useEffect, useState } from 'react';
import { createTheftReport } from '../../../api/theftReportApi.js';
import { translations } from '../../../app/i18n/translations.js';

function padDateTimePart(value) {
  return String(value).padStart(2, '0');
}

function toLocalDateTime(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return null;
  }

  const year = value.getFullYear();
  const month = padDateTimePart(value.getMonth() + 1);
  const day = padDateTimePart(value.getDate());
  const hours = padDateTimePart(value.getHours());
  const minutes = padDateTimePart(value.getMinutes());
  const seconds = padDateTimePart(value.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function getErrorText(language, key) {
  return (
    translations[language]?.theftForm?.errors?.[key] ??
    translations.fi.theftForm.errors[key]
  );
}

export function useTheftReportForm({
  defaultLocation,
  onCreated,
  onLocationSelected,
  language = 'fi'
}) {
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
    onLocationSelected?.({ latitude, longitude });
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
      setLocationError(getErrorText(language, 'geolocationUnsupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords.latitude, position.coords.longitude, 'gps');
      },
      (geoError) => {
        setLocationError(
          geoError.message || getErrorText(language, 'geolocationFailed')
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
      setError(getErrorText(language, 'descriptionRequired'));
      return;
    }

    if (!formValues.brand.trim()) {
      setError(getErrorText(language, 'brandRequired'));
      return;
    }

    if (!formValues.model.trim()) {
      setError(getErrorText(language, 'modelRequired'));
      return;
    }

    if (!formValues.type.trim()) {
      setError(getErrorText(language, 'typeRequired'));
      return;
    }

    if (!formValues.color.trim()) {
      setError(getErrorText(language, 'colorRequired'));
      return;
    }

    if (!formValues.bikeDescription.trim()) {
      setError(getErrorText(language, 'bikeDescriptionRequired'));
      return;
    }

    if (
      !(formValues.theftTime instanceof Date) ||
      Number.isNaN(formValues.theftTime.getTime())
    ) {
      setError(getErrorText(language, 'theftTimeRequired'));
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
      setError(getErrorText(language, 'locationMissing'));
      return;
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError(getErrorText(language, 'invalidLocation'));
      return;
    }

    const payload = {
      description: formValues.description.trim(),
      theftTime: toLocalDateTime(formValues.theftTime),
      theftAddress: formValues.theftAddress.trim() || null,
      location: { latitude, longitude },
      bike: {
        brand: formValues.brand.trim(),
        model: formValues.model.trim(),
        type: formValues.type.trim(),
        color: formValues.color.trim(),
        serialNumber: formValues.serialNumber
          ? formValues.serialNumber.trim()
          : null,
        description: formValues.bikeDescription.trim()
      }
    };

    try {
      if (formValues.images.length > 5) {
        setError(getErrorText(language, 'tooManyImages'));
        return;
      }

      setLoading(true);
      const createdReport = await createTheftReport(payload, formValues.images);
      onCreated?.(createdReport);
    } catch (submitError) {
      setError(submitError.message || getErrorText(language, 'saveFailed'));
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
