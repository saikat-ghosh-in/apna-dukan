import { useState, useRef, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const ImageGallery = ({ images, productName, inStock }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const thumbnailRefs = useRef([]);

  const minSwipeDistance = 50;

  useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center">
        <div className="text-gray-200 text-8xl select-none">◈</div>
      </div>
    );
  }

  const changeImage = (newIndex) => {
    if (newIndex === selectedIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex(newIndex);
      setIsTransitioning(false);
    }, 180);
  };

  const goToPrevious = () =>
    changeImage(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);

  const goToNext = () =>
    changeImage(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goToNext();
    else if (distance < -minSwipeDistance) goToPrevious();
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Image */}
        <div className="w-full h-full flex items-center justify-center p-5">
          <img
            key={selectedIndex}
            src={images[selectedIndex]}
            alt={`${productName} - ${selectedIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"
              }`}
          />
        </div>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[3px] flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-5 py-2 rounded-full tracking-[0.18em] uppercase shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
              translate-x-1 group-hover:translate-x-0 transition-all duration-200 ease-out bg-white/95 hover:bg-white
              text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-md cursor-pointer active:scale-90
              items-center justify-center ring-1 ring-gray-200/60"
              aria-label="Previous image"
            >
              <MdChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
              -translate-x-1 group-hover:translate-x-0 transition-all duration-200 ease-out bg-white/95 hover:bg-white
              text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-md cursor-pointer active:scale-90
              items-center justify-center ring-1 ring-gray-200/60"
              aria-label="Next image"
            >
              <MdChevronRight size={20} />
            </button>

            {/* Counter Pill */}
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs 
            font-semibold px-2.5 py-1 rounded-full tracking-wide">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 
                ${index === selectedIndex
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="w-full h-full flex items-center justify-center bg-gray-50 p-1">
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;