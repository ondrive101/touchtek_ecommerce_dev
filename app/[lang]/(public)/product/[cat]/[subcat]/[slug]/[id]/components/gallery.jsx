'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export default function Gallery({ images = [] }) {
  const validImages = useMemo(
    () =>
      (images || [])
        .map((item) => {
          const url =
            (typeof item?.image === 'string' && item.image.trim()) ||
            (typeof item?.fileUrl === 'string' && item.fileUrl.trim()) ||
            null;
          return {
            id: item.id,
            url,
            alt: item.colorName || item.alt || 'Product image',
            colorName: item.colorName || '',
          };
        })
        .filter((item) => Boolean(item.url)),
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isMagnified, setIsMagnified] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);

  const imageContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openZoom = () => {
    setIsZoomOpen(true);
    setIsMagnified(false);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    setIsMagnified(false);
  };

  const activeImage = validImages[activeIndex];

  const prevImage = useCallback(() => {
    setIsMagnified(false);
    setActiveIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  }, [validImages.length]);

  const nextImage = useCallback(() => {
    setIsMagnified(false);
    setActiveIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  }, [validImages.length]);

  // Lock body scroll when zoom modal is active
  useEffect(() => {
    if (isZoomOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isZoomOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [validImages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!validImages.length) return;
      if (e.key === 'Escape' && isZoomOpen) closeZoom();
      if (e.key === 'ArrowLeft' && isZoomOpen) prevImage();
      if (e.key === 'ArrowRight' && isZoomOpen) nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [validImages.length, isZoomOpen, prevImage, nextImage]);

  // Handle pan when magnified
  const handleMouseMove = (e) => {
    if (!isMagnified || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const toggleMagnify = (e) => {
    if (e) e.stopPropagation();
    if (!isMagnified && imageContainerRef.current && e) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    }
    setIsMagnified((prev) => !prev);
  };

  if (!validImages.length) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center bg-white rounded-2xl border border-gray-100">
        <span className="text-sm text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white">
        <div className="relative">
          {/* Main image container - Full area is clickable to zoom */}
          <div
            onClick={openZoom}
            className="group relative flex h-[420px] sm:h-[520px] lg:h-[500px] w-full cursor-zoom-in items-center justify-center rounded-2xl bg-white overflow-hidden border border-gray-100/80 shadow-sm transition-all duration-300 hover:shadow-md select-none"
            title="Click to zoom in"
          >
            <div className="relative h-full w-full p-4 sm:p-6">
              <Image
                src={activeImage.url}
                alt={activeImage.alt || `Product image ${activeIndex + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>

            {/* Corner Zoom Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openZoom();
              }}
              aria-label="Zoom image"
              className="absolute right-3.5 top-3.5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md backdrop-blur-sm border border-gray-100 transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white"
              title="Click to zoom"
            >
              <Maximize2 size={17} />
            </button>

            {/* Navigation Arrows on main image */}
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Click to zoom badge indicator */}
            <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white/90 text-xs font-medium backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <ZoomIn size={13} />
              <span>Click to zoom</span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="bg-white px-0 pt-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[15px] font-semibold text-black">
                Product Images
              </p>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(validImages.length).padStart(2, '0')}
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
                    title={item.colorName}
                    className={`group relative h-[78px] w-[78px] overflow-hidden rounded-xl bg-[#f8f8f8] transition-all duration-300 sm:h-[84px] sm:w-[84px] ${
                      isActive
                        ? 'opacity-100 ring-2 ring-black shadow-sm'
                        : 'opacity-70 hover:opacity-100 hover:ring-1 hover:ring-gray-300'
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt={item.alt || `Thumbnail ${idx + 1}`}
                      fill
                      sizes="84px"
                      className="object-contain p-2"
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

      {/* Fullscreen Zoom Modal rendered into Portal to escape parent container transforms */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isZoomOpen && (
              <motion.div
                key="gallery-zoom-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[99999] flex flex-col justify-between p-3 sm:p-6 select-none overflow-hidden"
                style={{
                  backgroundColor: 'rgba(12, 12, 14, 0.96)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
                onClick={closeZoom}
              >
                {/* Top Header Bar */}
                <div
                  className="relative z-30 flex items-center justify-between w-full max-w-7xl mx-auto px-2 sm:px-4 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left: Counter & Image info */}
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-full bg-neutral-900/90 text-white text-xs font-semibold border border-white/20 shadow-md">
                      {String(activeIndex + 1).padStart(2, '0')} /{' '}
                      {String(validImages.length).padStart(2, '0')}
                    </span>
                    {activeImage.colorName && (
                      <span className="text-sm font-medium text-gray-200 hidden sm:inline-block px-3 py-1 rounded-full bg-neutral-900/80 border border-white/15 shadow-sm">
                        Color: <strong className="text-white capitalize">{activeImage.colorName}</strong>
                      </span>
                    )}
                  </div>

                  {/* Right: Controls & Close */}
                  <div className="flex items-center gap-2.5">
                    {/* Zoom in/out toggle button */}
                    <button
                      type="button"
                      onClick={toggleMagnify}
                      aria-label={isMagnified ? 'Zoom out' : 'Zoom in'}
                      className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-gray-950 border border-gray-200 shadow-xl transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95"
                      title={isMagnified ? 'Zoom out (or click image)' : 'Zoom in 2x (or click image)'}
                    >
                      {isMagnified ? (
                        <ZoomOut size={20} className="text-gray-950 stroke-[2.2]" />
                      ) : (
                        <ZoomIn size={20} className="text-gray-950 stroke-[2.2]" />
                      )}
                    </button>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={closeZoom}
                      aria-label="Close zoom view"
                      className="group flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-gray-950 border border-gray-200 shadow-xl transition-all duration-200 hover:scale-105 hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95"
                      title="Close (Esc)"
                    >
                      <X size={22} className="text-gray-950 group-hover:text-white stroke-[2.2] transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Center Stage: The Zoomed Image */}
                <div
                  className="relative flex-1 w-full flex items-center justify-center my-2 overflow-hidden"
                  onClick={closeZoom}
                >
                  <div
                    ref={imageContainerRef}
                    onClick={toggleMagnify}
                    onMouseMove={handleMouseMove}
                    className={`relative w-full max-w-5xl h-[65vh] sm:h-[72vh] flex items-center justify-center transition-all ${
                      isMagnified ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                  >
                    <motion.div
                      key={activeImage.url}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="relative w-full h-full flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="relative w-full h-full"
                        style={{
                          transform: isMagnified ? 'scale(2.2)' : 'scale(1)',
                          transformOrigin: isMagnified
                            ? `${mousePos.x}% ${mousePos.y}%`
                            : 'center center',
                          transition: isMagnified
                            ? 'transform 0.1s ease-out'
                            : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        <Image
                          src={activeImage.url}
                          alt={activeImage.alt || `Zoomed image ${activeIndex + 1}`}
                          fill
                          priority
                          sizes="100vw"
                          className="object-contain drop-shadow-2xl"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Left Navigation Arrow */}
                  {validImages.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      aria-label="Previous image"
                      className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-950 border border-gray-200 shadow-2xl transition-all duration-200 hover:scale-110 hover:bg-gray-100 active:scale-95"
                      title="Previous (Left Arrow)"
                    >
                      <ChevronLeft size={24} className="stroke-[2.5]" />
                    </button>
                  )}

                  {/* Right Navigation Arrow */}
                  {validImages.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      aria-label="Next image"
                      className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-950 border border-gray-200 shadow-2xl transition-all duration-200 hover:scale-110 hover:bg-gray-100 active:scale-95"
                      title="Next (Right Arrow)"
                    >
                      <ChevronRight size={24} className="stroke-[2.5]" />
                    </button>
                  )}
                </div>

                {/* Bottom Bar: Interactive Thumbnails Strip */}
                <div
                  className="relative z-30 flex items-center justify-center w-full py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {validImages.length > 1 && (
                    <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-neutral-900/90 border border-white/20 backdrop-blur-md shadow-2xl overflow-x-auto max-w-full">
                      {validImages.map((item, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                          <button
                            key={`zoom-thumb-${item.id || idx}`}
                            type="button"
                            onClick={() => {
                              setIsMagnified(false);
                              setActiveIndex(idx);
                            }}
                            aria-label={`Select image ${idx + 1}`}
                            title={item.colorName || `Image ${idx + 1}`}
                            className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden bg-white/95 p-1 transition-all duration-200 flex-shrink-0 ${
                              isActive
                                ? 'ring-2 ring-white scale-110 shadow-lg'
                                : 'opacity-50 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            <Image
                              src={item.url}
                              alt={item.alt || `Thumb ${idx + 1}`}
                              fill
                              sizes="56px"
                              className="object-contain p-1"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}