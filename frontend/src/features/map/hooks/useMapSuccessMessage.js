import { useEffect, useState } from 'react';

export function useMapSuccessMessage() {
  const [showMapSuccess, setShowMapSuccess] = useState(false);

  useEffect(() => {
    const shouldShow = sessionStorage.getItem('showMapSuccess');

    if (shouldShow === 'true') {
      setShowMapSuccess(true);
      sessionStorage.removeItem('showMapSuccess');
    }
  }, []);

  useEffect(() => {
    if (!showMapSuccess) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowMapSuccess(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showMapSuccess]);

  return showMapSuccess;
}
