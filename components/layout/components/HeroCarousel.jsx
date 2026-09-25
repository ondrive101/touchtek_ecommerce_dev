'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const introVideoBanner = {
  id: 'intro-video-discount',
  isVideo: true,
  video: '/videos/intro.mp4',
  link: '/en/products',
  alt: 'New Customer Welcome - 20% OFF Discount Info',
};

export default function HeroCarousel({ banners = [] }) {
  const [isMuted, setIsMuted] = useState(true);

  // Place intro video as the very first banner, and any other banners after it
  const allBanners = [
    introVideoBanner,
    ...(Array.isArray(banners) ? banners.filter((b) => b?.id !== 'intro-video-discount') : []),
  ];

  const hasMultiple = allBanners.length > 1;

  return (
    <section className="relative w-full aspect-[16/9] sm:aspect-auto sm:h-[55vh] md:h-[65vh] lg:h-[75vh] xl:h-[85vh] overflow-hidden bg-black">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={
          hasMultiple
            ? {
                nextEl: '.hero-button-next',
                prevEl: '.hero-button-prev',
              }
            : false
        }
        pagination={hasMultiple ? { clickable: true } : false}
        autoplay={
          hasMultiple
            ? {
                delay: 7000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={hasMultiple}
        className="h-full w-full hero-carousel"
      >
        {allBanners.map((slide, index) => {
          const isVideo = Boolean(slide.isVideo || slide.video || slide.video_url);
          const videoSrc = slide.video || slide.video_url;
          const href = slide?.skuCode
            ? `/en/product/${slide.categorySlug}/${slide.subCategorySlug}/${slide.productSlug}/${slide.skuCode}`
            : slide?.link || `/en/products`;

          return (
            <SwiperSlide key={slide.id || index}>
              <div className="relative w-full h-full bg-black">
                {isVideo ? (
                  <div className="relative w-full h-full">
                    <Link href={href} className="block w-full h-full cursor-pointer">
                      <video
                        src={videoSrc}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Mute/Unmute sound toggle button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMuted((prev) => !prev);
                      }}
                      className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                      title={isMuted ? 'Unmute video' : 'Mute video'}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                      )}
                    </button>
                  </div>
                ) : (
                  <Link href={href} className="block w-full h-full">
                    <Image
                      src={slide?.image}
                      alt={slide?.alt || 'Hero banner'}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="100vw"
                    />
                  </Link>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {hasMultiple && (
        <>
          <button
            aria-label="Previous slide"
            className="hero-button-prev hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 text-white rounded-full items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            aria-label="Next slide"
            className="hero-button-next hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 text-white rounded-full items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      <style jsx global>{`
        .hero-carousel .swiper-pagination {
          bottom: 8px !important;
        }
        @media (min-width: 640px) {
          .hero-carousel .swiper-pagination {
            bottom: 16px !important;
          }
        }
        .hero-carousel .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
          opacity: 0.6;
          width: 6px;
          height: 6px;
          margin: 0 3px !important;
          transition: all 0.3s ease;
        }
        .hero-carousel .swiper-pagination-bullet-active {
          opacity: 1;
          width: 18px;
          border-radius: 9999px;
          background: #ffffff;
        }
        @media (min-width: 640px) {
          .hero-carousel .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            margin: 0 4px !important;
          }
          .hero-carousel .swiper-pagination-bullet-active {
            width: 24px;
          }
        }
      `}</style>
    </section>
  );
}
