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
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden bg-black">
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
        className="h-full w-full"
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
                      className="absolute bottom-6 right-6 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                      title={isMuted ? 'Unmute video' : 'Mute video'}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-gray-300" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-emerald-400" />
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
            className="hero-button-prev absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            aria-label="Next slide"
            className="hero-button-next absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}
    </section>
  );
}
