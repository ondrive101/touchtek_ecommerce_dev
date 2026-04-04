'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function Gallery({ images = [] }) {
  const validImages = useMemo(
    () => images.filter((item) => item?.fileUrl),
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isMountedZoom, setIsMountedZoom] = useState(false);


const openZoom = () => setIsZoomOpen(true);
const closeZoom = () => setIsZoomOpen(false);

  const activeImage = validImages[activeIndex];

  const prevImage = () => {
    setActiveIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  // const openZoom = () => {
  //   setIsZoomOpen(true);
  //   requestAnimationFrame(() => setIsMountedZoom(true));
  // };

  // const closeZoom = () => {
  //   setIsMountedZoom(false);
  //   setTimeout(() => setIsZoomOpen(false), 260);
  // };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!validImages.length) return;

      if (e.key === 'Escape' && isZoomOpen) closeZoom();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [validImages.length, isZoomOpen]);

  if (!validImages.length) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center bg-white">
        <span className="text-sm text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white">
        <div className="relative">
          {/* Main image */}
          <div className="relative flex h-[420px] items-center justify-center bg-white sm:h-[520px] lg:h-[600px]">
            <div className="relative h-full w-full">
              <Image
                src={activeImage.fileUrl}
                alt={activeImage.alt || `Product image ${activeIndex + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain transition-transform duration-500 ease-out"
              />
            </div>

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-md transition-all duration-300 hover:scale-105 hover:text-black sm:left-3"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-md transition-all duration-300 hover:scale-105 hover:text-black sm:right-3"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={openZoom}
              aria-label="Zoom image"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-all duration-300 hover:scale-105 hover:text-black"
            >
              <Maximize2 size={17} />
            </button>
          </div>

          {/* Footer / thumbnails */}
          <div className="bg-white px-0 pt-3">
            <div className="mb-3 flex items-center gap-3">
              <p className="text-[15px] font-semibold text-black">Product Images</p>
              <span className="text-sm font-medium text-gray-400">
                {String(activeIndex + 1).padStart(2, '0')} / {String(validImages.length).padStart(2, '0')}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {validImages.map((item, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    className={`group relative h-[78px] w-[78px] overflow-hidden rounded-xl bg-[#f6f6f6] transition-all duration-300 sm:h-[84px] sm:w-[84px] ${
                      isActive
                        ? 'opacity-100'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={item.fileUrl}
                      alt={item.alt || `Thumbnail ${idx + 1}`}
                      fill
                      sizes="84px"
                      className="object-contain p-1.5"
                    />

                    <span
                      className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full transition-all duration-300 ${
                        isActive ? 'w-10 bg-black' : 'w-0 bg-black'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen zoom */}
      <AnimatePresence mode="wait">
  {isZoomOpen && (
    <motion.div
      key="gallery-zoom-backdrop"
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[999] bg-black/60"
      onClick={closeZoom}
    >
      <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-8">
        <motion.div
          key={activeImage.fileUrl}
          initial={{ opacity: 0, scale: 0.94, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.96, y: 12, filter: 'blur(6px)' }}
          transition={{
            duration: 0.38,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative h-[78vh] w-full max-w-[1100px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={activeImage.fileUrl}
            alt={activeImage.alt || `Zoomed image ${activeIndex + 1}`}
            fill
            priority
            sizes="100vw"
            className="object-contain drop-shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
          />

          <motion.button
            type="button"
            onClick={closeZoom}
            aria-label="Close zoom view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22, delay: 0.08 }}
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
          >
            <X size={20} />
          </motion.button>

          {validImages.length > 1 && (
            <>
              <motion.button
                type="button"
                onClick={prevImage}
                aria-label="Previous image"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22, delay: 0.1 }}
                className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                <ChevronLeft size={22} />
              </motion.button>

              <motion.button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.22, delay: 0.1 }}
                className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                <ChevronRight size={22} />
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}