"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, VolumeX, Volume2 } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const videoData = [
  { id: 1, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Airpod.jpeg", name: "AirPod Pro", price: "₹2,999", original_price: "₹5,999" },
  { id: 2, video_url: "/videos/2.mp4", thumbnail_url: "/images/touchtek/Headphone.jpeg", name: "Headphone X1", price: "₹1,999", original_price: "₹3,999" },
  { id: 3, video_url: "/videos/3.mp4", thumbnail_url: "/images/touchtek/Powerbank.jpeg", name: "Powerbank 20K", price: "₹1,099", original_price: "₹3,499" },
  { id: 4, video_url: "/videos/4.mp4", thumbnail_url: "/images/touchtek/Charger.jpeg", name: "Fast Charger", price: "₹799", original_price: "₹1,499" },
  { id: 5, video_url: "/videos/2.mp4", thumbnail_url: "/images/touchtek/Neckband.jpeg", name: "Neckband N10", price: "₹999", original_price: "₹2,499" },
  { id: 6, video_url: "/videos/3.mp4", thumbnail_url: "/images/touchtek/Neckband.jpeg", name: "Neckband N10", price: "₹999", original_price: "₹2,499" },
  { id: 7, video_url: "/videos/4.mp4", thumbnail_url: "/images/touchtek/Neckband.jpeg", name: "Neckband N10", price: "₹999", original_price: "₹2,499" },
  { id: 8, video_url: "/videos/2.mp4", thumbnail_url: "/images/touchtek/Neckband.jpeg", name: "Neckband N10", price: "₹999", original_price: "₹2,499" },
  { id: 9, video_url: "/videos/3.mp4", thumbnail_url: "/images/touchtek/Neckband.jpeg", name: "Neckband N10", price: "₹999", original_price: "₹2,499" },
  { id: 10, video_url: "/videos/4.mp4", thumbnail_url: "/images/touchtek/Neckband.jpeg", name: "Neckband N10", price: "₹999", original_price: "₹2,499" },
];

export default function ProductVideoSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const videoRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [globalMuted, setGlobalMuted] = useState(true);
  const [swiperReady, setSwiperReady] = useState(false);

  // ✅ Only play active ±1 videos to prevent lag
  const updatePlayingVideos = (index) => {
    Object.entries(videoRefs.current).forEach(([idxStr, video]) => {
      if (!video) return;
      const i = parseInt(idxStr);
      const distance = Math.abs(i - index);
      const wrapped = Math.min(distance, videoData.length - distance);
      if (wrapped <= 1) {
        video.muted = true; // always start muted (browser policy)
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  // ✅ Sync mute state
  useEffect(() => {
    Object.values(videoRefs.current).forEach((v) => {
      if (v) v.muted = globalMuted;
    });
  }, [globalMuted]);

  // ✅ Play initial active video after mount
  useEffect(() => {
    const timer = setTimeout(() => updatePlayingVideos(0), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            See It In Action
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Watch our products up close
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
  modules={[Navigation, Pagination, Autoplay]}
  centeredSlides={true}
  slidesPerView={1.2}
  spaceBetween={8}  // ✅ was 12, now 8 (mobile)
  loop={true}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  navigation={{
    prevEl: prevRef.current,
    nextEl: nextRef.current,
  }}
  pagination={{
    clickable: true,
    dynamicBullets: true,
  }}
  onSwiper={(swiper) => {
    setTimeout(() => {
      if (swiper.params?.navigation) {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }
    });
    setSwiperReady(true);
  }}
  onSlideChange={(swiper) => {
    const real = swiper.realIndex;
    setActiveIndex(real);
    updatePlayingVideos(real);
  }}
  breakpoints={{
    640: {
      slidesPerView: 2.2,
      spaceBetween: 12,  // ✅ was 16, now 12
    },
    768: {
      slidesPerView: 2.8,
      spaceBetween: 14,  // ✅ was 20, now 14
    },
    1024: {
      slidesPerView: 3.4,
      spaceBetween: 16,  // ✅ was 24, now 16
    },
    1280: {
      slidesPerView: 4.2,
      spaceBetween: 16,  // ✅ was 24, now 16
    },
  }}
  className="video-swiper !pb-10"
>
            {videoData.map((item, index) => (
              <SwiperSlide key={item.id}>
                {({ isActive }) => (
                  <div
                    className={`
                      relative rounded-2xl overflow-hidden cursor-pointer
                      transition-opacity duration-300
                      ${isActive ? "ring-2 ring-white/25" : ""}
                    `}
                    style={{
                      aspectRatio: "9/16",
                      height: "clamp(280px, 52vw, 480px)",
                    }}
                  >
                    <video
                      ref={(el) => { if (el) videoRefs.current[index] = el; }}
                      src={item.video_url}
                      poster={item.thumbnail_url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      loop
                      preload="metadata"
                    />

                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 pointer-events-none" />

                    {/* Mute button — active slide only */}
                    {isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGlobalMuted((m) => !m);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/70 transition z-10"
                      >
                        {globalMuted
                          ? <VolumeX size={13} className="text-white" />
                          : <Volume2 size={13} className="text-white" />
                        }
                      </button>
                    )}

                    {/* Product info */}
                    {/* <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <p className="text-white text-xs sm:text-sm font-semibold truncate">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-white text-xs sm:text-sm font-bold">{item.price}</span>
                        <span className="text-white/50 text-xs line-through">{item.original_price}</span>
                      </div>
                    </div> */}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev */}
          <button
            ref={prevRef}
            aria-label="Previous"
            className="absolute left-0 top-[42%] -translate-y-1/2 -translate-x-1 z-20
              w-8 h-8 sm:w-10 sm:h-10 bg-black/60 backdrop-blur-sm
              border border-white/20 rounded-full flex items-center justify-center
              hover:bg-black/80 active:scale-95 transition"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          {/* Next */}
          <button
            ref={nextRef}
            aria-label="Next"
            className="absolute right-0 top-[42%] -translate-y-1/2 translate-x-1 z-20
              w-8 h-8 sm:w-10 sm:h-10 bg-black/60 backdrop-blur-sm
              border border-white/20 rounded-full flex items-center justify-center
              hover:bg-black/80 active:scale-95 transition"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </motion.div>

        {/* Global Mute button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setGlobalMuted((m) => !m)}
            className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-95 transition"
          >
            {globalMuted
              ? <VolumeX size={14} className="text-white" />
              : <Volume2 size={14} className="text-white" />
            }
          </button>
        </div>

      </div>

    </section>
  );
}
