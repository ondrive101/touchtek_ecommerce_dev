"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { VolumeX, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

const videoData = [
  { id: 1, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Airpod.jpeg" },
  { id: 2, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Headphone.jpeg" },
  { id: 3, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Powerbank.jpeg" },
  { id: 4, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Charger.jpeg" },
  { id: 5, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Neckband.jpeg" },
];

export default function ProductVideoSection() {
  const swiperRef = useRef(null);
  const videoRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [globalMuted, setGlobalMuted] = useState(true);

  const setVideoRef = (el, index) => {
    if (el) videoRefs.current[index] = el;
  };

  const syncVideos = useCallback((currentIndex) => {
    Object.entries(videoRefs.current).forEach(([i, video]) => {
      if (!video) return;
      if (Number(i) === currentIndex) {
        video.muted = globalMuted;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [globalMuted]);

  useEffect(() => { syncVideos(activeIndex); }, [activeIndex, syncVideos]);

  useEffect(() => {
    const video = videoRefs.current[activeIndex];
    if (video) video.muted = globalMuted;
  }, [globalMuted, activeIndex]);

  const handleSlideChange = (swiper) => setActiveIndex(swiper.realIndex);

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-black">
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
          {/* ✅ FIX 1 & 2: overflow-hidden wrapper + buttons outside it */}
          <div className="overflow-hidden w-full px-8 sm:px-12">
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
              onSlideChangeTransitionEnd={(swiper) => syncVideos(swiper.realIndex)}
              modules={[Autoplay]}
              centeredSlides={true}
              loop={true}
              autoplay={{ delay: 8000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{
                0:    { slidesPerView: 1,   spaceBetween: 12 },
                480:  { slidesPerView: 1.2, spaceBetween: 12 },
                640:  { slidesPerView: 1.5, spaceBetween: 16 },
                768:  { slidesPerView: 2,   spaceBetween: 20 },
                1024: { slidesPerView: 2.5, spaceBetween: 20 },
                1280: { slidesPerView: 3,   spaceBetween: 24 },
              }}
              className="!overflow-visible"
            >
              {videoData.map((item, index) => (
                <SwiperSlide key={item.id}>
                  {({ isActive }) => (
                    <div
                      className={`
                        relative rounded-xl sm:rounded-2xl overflow-hidden
                        transition-all duration-500 cursor-pointer mx-auto
                        ${isActive
                          ? "opacity-100 ring-2 ring-white/20 shadow-[0_0_35px_rgba(140,0,255,0.4)]"
                          : "opacity-40 hover:opacity-60"
                        }
                      `}
                      // ✅ FIX 3: explicit different heights for active vs inactive
                      style={{
                        aspectRatio: "9/16",
                        height: isActive ? "clamp(340px, 55vh, 520px)" : "clamp(280px, 44vh, 430px)",
                        marginTop: isActive ? "0px" : "auto",
                        alignSelf: "center",
                      }}
                      onClick={() => {
                        if (!isActive) swiperRef.current?.slideToLoop(index);
                      }}
                    >
                      <video
                        ref={(el) => setVideoRef(el, index)}
                        src={item.video_url}
                        poster={item.thumbnail_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop
                        preload="metadata"
                      />

                      {/* Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                      {/* ✅ FIX 4: mute badge only on active, better padding */}
                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setGlobalMuted((m) => !m);
                          }}
                          className="absolute top-4 right-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/70 transition"
                          aria-label={globalMuted ? "Unmute" : "Mute"}
                        >
                          {globalMuted
                            ? <VolumeX size={15} className="text-white" />
                            : <Volume2 size={15} className="text-white" />
                          }
                        </button>
                      )}
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ✅ FIX 2: Buttons outside overflow-hidden, always visible */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20
              w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm
              border border-white/20 rounded-full flex items-center justify-center
              hover:bg-white/25 active:scale-95 transition"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20
              w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm
              border border-white/20 rounded-full flex items-center justify-center
              hover:bg-white/25 active:scale-95 transition"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </motion.div>

        {/* Dots + Mute */}
        <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {videoData.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full
                  ${activeIndex === index
                    ? "w-5 sm:w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>

          <button
            onClick={() => setGlobalMuted((m) => !m)}
            className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-95 transition"
            aria-label={globalMuted ? "Unmute" : "Mute"}
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
