export function getFormTooltips(t) {
  return {
    description: t('theftForm.tooltips.description'),
    theftTime: t('theftForm.tooltips.theftTime'),
    theftAddress: t('theftForm.tooltips.theftAddress'),
    location: t('theftForm.tooltips.location'),
    bike: t('theftForm.tooltips.bike'),
    bikeDescription: t('theftForm.tooltips.bikeDescription')
  };
}

export function getBikeFields(t) {
  return [
    {
      name: 'brand',
      label: t('theftForm.bikeFields.brand.label'),
      placeholder: t('theftForm.bikeFields.brand.placeholder'),
      required: true
    },
    {
      name: 'model',
      label: t('theftForm.bikeFields.model.label'),
      placeholder: t('theftForm.bikeFields.model.placeholder'),
      required: true
    },
    {
      name: 'type',
      label: t('theftForm.bikeFields.type.label'),
      placeholder: t('theftForm.bikeFields.type.placeholder'),
      required: true
    },
    {
      name: 'color',
      label: t('theftForm.bikeFields.color.label'),
      placeholder: t('theftForm.bikeFields.color.placeholder'),
      required: true
    },
    {
      name: 'serialNumber',
      label: t('theftForm.bikeFields.serialNumber.label'),
      placeholder: t('theftForm.bikeFields.serialNumber.placeholder'),
      required: false
    }
  ];
}
