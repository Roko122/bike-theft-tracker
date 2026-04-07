import { useEffect, useMemo, useState } from 'react';

export default function ImageCarousel({
  images,
  height = 180,
  altPrefix = 'Ilmoituksen kuva',
  fit = 'cover'
}) {
  const imageUrls = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const imagesKey = useMemo(() => imageUrls.join('|'), [imageUrls]);

  useEffect(() => {
    setActiveIndex(0);
  }, [imagesKey]);

  if (imageUrls.length === 0) return null;

  const hasMany = imageUrls.length > 1;
  const currentImageUrl = imageUrls[activeIndex] ?? imageUrls[0];
  const objectFitClass =
    fit === 'contain' ? 'image-carousel__image--contain' : 'image-carousel__image--cover';

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? imageUrls.length - 1 : current - 1
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === imageUrls.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="image-carousel" style={{ '--carousel-height': `${height}px` }}>
      <img
        src={currentImageUrl}
        alt={`${altPrefix} ${activeIndex + 1}`}
        loading="lazy"
        className={`image-carousel__image ${objectFitClass}`}
      />

      {hasMany && (
        <>
          <button
            type="button"
            className="image-carousel__nav image-carousel__nav--prev"
            aria-label="Edellinen kuva"
            onClick={showPrevious}
          >
            ‹
          </button>
          <button
            type="button"
            className="image-carousel__nav image-carousel__nav--next"
            aria-label="Seuraava kuva"
            onClick={showNext}
          >
            ›
          </button>

          <div className="image-carousel__counter">
            {activeIndex + 1}/{imageUrls.length}
          </div>

          <div className="image-carousel__dots" aria-hidden="true">
            {imageUrls.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                className={
                  index === activeIndex
                    ? 'image-carousel__dot image-carousel__dot--active'
                    : 'image-carousel__dot'
                }
                onClick={() => setActiveIndex(index)}
                aria-label={`Näytä kuva ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
