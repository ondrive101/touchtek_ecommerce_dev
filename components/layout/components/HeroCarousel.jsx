'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Example free tech wallpapers from Unsplash
const heroBanners = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=50',
    alt: 'Tech circuit board wallpaper',
    link: '#',
  }, 
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=50',
    alt: 'Abstract technology wallpaper',
    link: '#',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=50    ',
    alt: 'Futuristic neon city wallpaper',
    link: '#',
  },
];

export default function HeroCarousel({banners}) {
  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.hero-button-next',
          prevEl: '.hero-button-prev',
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        className="h-full w-full"
      >
        {banners.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <a href='#' className="block w-full h-full">
                <Image
                  src={slide?.image}
                  alt={slide?.alt || 'Hero banner'}
                  fill
                  priority={slide?.id === 1}
                  className="object-cover"
                  sizes="100vw"
                />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="hero-button-prev absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-300">
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="hero-button-next absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-300">
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
