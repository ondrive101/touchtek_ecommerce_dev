"use client";

import { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { VolumeX, Volume2, ChevronLeft, ChevronRight } from "lucide-react";

const videoData = [
  { id: 1, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Airpod.jpeg", name: "AirPod Pro", price: "₹2,999", original_price: "₹5,999" },
  { id: 2, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Headphone.jpeg", name: "Headphone X1", price: "₹1,999", original_price: "₹3,999" },
  { id: 3, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Powerbank.jpeg", name: "Powerbank 20K", price: "₹1,099", original_price: "₹3,499" },
  { id: 4, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Charger.jpeg", name: "Fast Charger", price: "₹799", original_price: "₹1,499" },
  { id: 5, video_url: "/videos/test.mp4", thumbnail_url: "/images/touchtek/Neckband.jpeg", name: "Neckband N10", price: "₹999", original_price: "₹2,499" },
];

// ✅ Triple slides so Embla always has clones for infinite loop
const loopedData = [...videoData, ...videoData, ...videoData];

const autoplayPlugin = Autoplay({
  delay: 2000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
});

export default function ProductVideoSection() {
  const videoRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [globalMuted, setGlobalMuted] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      startIndex: videoData.length, // ✅ start at middle set so both sides have clones
      slidesToScroll: 1,
      duration: 30,
    },
    [autoplayPlugin]
  );

  const setVideoRef = (el, index) => {
    if (el) videoRefs.current[index] = el;
  };

  // ✅ Play ALL videos on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      Object.values(videoRefs.current).forEach((video) => {
        if (!video) return;
        video.muted = true;
        video.play().catch(() => {});
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Sync mute across all videos
  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) video.muted = globalMuted;
    });
  }, [globalMuted]);

  // ✅ Track active index mapped back to 0–4
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const raw = emblaApi.selectedScrollSnap();
      setActiveIndex(raw % videoData.length);
    };
    emblaApi.on("select", onSelect);
    emblaApi.reInit();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

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
          {/* Embla viewport */}
          <div className="overflow-hidden w-full px-10 sm:px-14" ref={emblaRef}>
            <div className="flex items-centergap-10 sm:gap-12 lg:gap-14">
              {loopedData.map((item, index) => {
                const isActive = activeIndex === index % videoData.length;
                return (
                  <div
                    key={`slide-${index}`}
                    className="
                      flex-none
                      w-[62%]
                      min-[480px]:w-[50%]
                      sm:w-[40%]
                      md:w-[32%]
                      lg:w-[26%]
                      xl:w-[21%]
                      transition-opacity duration-500
                    "
                    onClick={() => emblaApi?.scrollTo(index)}
                  >
                    {/* Video Card */}
                    <div
                      className={`
                        relative rounded-2xl overflow-hidden cursor-pointer
                        transition-opacity duration-500
                        ${isActive
                          ? "opacity-100 ring-2 ring-white/20"
                          : "opacity-60 hover:opacity-80"
                        }
                      `}
                      style={{
                        aspectRatio: "9/16",
                        height: "clamp(320px, 50vh, 480px)",
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
                        autoPlay
                        preload="auto"
                      />

                      {/* Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                      {/* Mute button — active slide only */}
                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setGlobalMuted((m) => !m);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/70 transition"
                          aria-label={globalMuted ? "Unmute" : "Mute"}
                        >
                          {globalMuted
                            ? <VolumeX size={13} className="text-white" />
                            : <Volume2 size={13} className="text-white" />
                          }
                        </button>
                      )}
                    </div>

                 
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prev */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous"
            className="absolute left-0 top-[42%] -translate-y-1/2 z-20
              w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm
              border border-white/20 rounded-full flex items-center justify-center
              hover:bg-white/25 active:scale-95 transition"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          {/* Next */}
          <button
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next"
            className="absolute right-0 top-[42%] -translate-y-1/2 z-20
              w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm
              border border-white/20 rounded-full flex items-center justify-center
              hover:bg-white/25 active:scale-95 transition"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </motion.div>

        {/* Dots + Global Mute */}
        <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {videoData.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index + videoData.length)}
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
