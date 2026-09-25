"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  VolumeX,
  Volume2,
  Play,
  Pause,
  ArrowRight,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const videoData = [
  {
    id: 0,
    video_url: "/videos/intro.mp4",
    thumbnail_url: "/images/touchtek/Airpod.jpeg",
    name: "20% OFF on First Order",
    tag: "🎉 Welcome Offer",
    category: "Offers",
    rating: 5.0,
    price: "20% OFF",
    original_price: "",
    discount: "WELCOME20",
    link: "/en/products",
  },
  {
    id: 1,
    video_url: "/videos/1.mp4",
    thumbnail_url: "/images/touchtek/Airpod.jpeg",
    name: "AirPod Pro Wireless",
    tag: "🔥 Best Seller",
    category: "Audio",
    rating: 4.9,
    price: "₹2,999",
    original_price: "₹5,999",
    discount: "50% OFF",
    link: "/en/products?category=tws",
  },
  {
    id: 2,
    video_url: "/videos/2.mp4",
    thumbnail_url: "/images/touchtek/Headphone.jpeg",
    name: "Studio X1 ANC Headphone",
    tag: "🎧 Hi-Res Audio",
    category: "Headphones",
    rating: 4.8,
    price: "₹1,999",
    original_price: "₹3,999",
    discount: "50% OFF",
    link: "/en/products?category=headphones",
  },
  {
    id: 3,
    video_url: "/videos/3.mp4",
    thumbnail_url: "/images/touchtek/Powerbank.jpeg",
    name: "Powerbank 20,000mAh",
    tag: "⚡ 22.5W Fast",
    category: "Power",
    rating: 4.7,
    price: "₹1,099",
    original_price: "₹3,499",
    discount: "68% OFF",
    link: "/en/products?category=powerbanks",
  },
  {
    id: 4,
    video_url: "/videos/4.mp4",
    thumbnail_url: "/images/touchtek/Charger.jpeg",
    name: "Turbo 45W Dual Charger",
    tag: "⚡ GaN Charge",
    category: "Chargers",
    rating: 4.9,
    price: "₹799",
    original_price: "₹1,499",
    discount: "46% OFF",
    link: "/en/products?category=chargers",
  },
  {
    id: 5,
    video_url: "/videos/5.mp4",
    thumbnail_url: "/images/touchtek/Neckband.jpeg",
    name: "BassBand N10 Wireless",
    tag: "🎵 40Hr Battery",
    category: "Neckbands",
    rating: 4.8,
    price: "₹999",
    original_price: "₹2,499",
    discount: "60% OFF",
    link: "/en/products?category=neckbands",
  },
  {
    id: 6,
    video_url: "/videos/6.mp4",
    thumbnail_url: "/images/touchtek/Speaker.jpeg",
    name: "SoundPulse Speaker",
    tag: "🔊 Deep Bass",
    category: "Speakers",
    rating: 4.8,
    price: "₹1,499",
    original_price: "₹3,299",
    discount: "54% OFF",
    link: "/en/products?category=speakers",
  },
  {
    id: 7,
    video_url: "/videos/7.mp4",
    thumbnail_url: "/images/touchtek/Earphone.jpeg",
    name: "Pro Bass Earphones",
    tag: "⚡ Pure Sound",
    category: "Earphones",
    rating: 4.6,
    price: "₹399",
    original_price: "₹999",
    discount: "60% OFF",
    link: "/en/products?category=earphones",
  },
  {
    id: 8,
    video_url: "/videos/8.mp4",
    thumbnail_url: "/images/touchtek/Cable.jpeg",
    name: "Braided 65W Cable",
    tag: "🛡️ Ultra Tough",
    category: "Cables",
    rating: 4.9,
    price: "₹299",
    original_price: "₹699",
    discount: "57% OFF",
    link: "/en/products?category=data-cable",
  },
  {
    id: 9,
    video_url: "/videos/9.mp4",
    thumbnail_url: "/images/touchtek/Airpod.jpeg",
    name: "TruePods Active ANC",
    tag: "✨ Crystal Mic",
    category: "Audio",
    rating: 4.8,
    price: "₹2,499",
    original_price: "₹4,999",
    discount: "50% OFF",
    link: "/en/products?category=tws",
  },
  {
    id: 10,
    video_url: "/videos/10.mp4",
    thumbnail_url: "/images/touchtek/Neckband.jpeg",
    name: "Magnetic Sport Neckband",
    tag: "🏃 IPX5 Proof",
    category: "Neckbands",
    rating: 4.7,
    price: "₹899",
    original_price: "₹1,999",
    discount: "55% OFF",
    link: "/en/products?category=neckbands",
  },
];

export default function ProductVideoSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [globalMuted, setGlobalMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playFeedback, setPlayFeedback] = useState(null); // 'play' | 'pause' | null
  const [videoProgress, setVideoProgress] = useState(0);

  // Safely control video elements in current Swiper DOM (works seamlessly with loop clones)
  const syncVideos = useCallback(
    (swiper, playActive = true) => {
      if (!swiper?.el) return;
      const allVideos = swiper.el.querySelectorAll("video");
      allVideos.forEach((v) => {
        v.pause();
      });

      const activeSlide = swiper.slides[swiper.activeIndex];
      if (activeSlide && playActive) {
        const activeVideo = activeSlide.querySelector("video");
        if (activeVideo) {
          activeVideo.muted = globalMuted;
          activeVideo.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    },
    [globalMuted]
  );

  // Sync mute state across all active videos
  useEffect(() => {
    if (swiperRef.current?.el) {
      const allVideos = swiperRef.current.el.querySelectorAll("video");
      allVideos.forEach((v) => {
        v.muted = globalMuted;
      });
    }
  }, [globalMuted]);

  // Handle slide change
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
    setVideoProgress(0);
    syncVideos(swiper, true);
  };

  const router = useRouter();

  // On desktop (screen >= 640px), clicking the card navigates directly to the product
  // On mobile, tapping toggles play/pause
  const handleCardClick = (item) => {
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      router.push(item.link);
    } else {
      togglePlayPause();
    }
  };

  // Toggle play/pause for active slide
  const togglePlayPause = () => {
    if (!swiperRef.current?.el) return;
    const activeSlide = swiperRef.current.slides[swiperRef.current.activeIndex];
    if (!activeSlide) return;
    const activeVideo = activeSlide.querySelector("video");
    if (!activeVideo) return;

    if (activeVideo.paused) {
      activeVideo.play().catch(() => {});
      setIsPlaying(true);
      setPlayFeedback("play");
    } else {
      activeVideo.pause();
      setIsPlaying(false);
      setPlayFeedback("pause");
    }

    setTimeout(() => {
      setPlayFeedback(null);
    }, 700);
  };

  // Toggle global mute
  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    setGlobalMuted((prev) => !prev);
  };

  // Track progress on the active video
  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      setVideoProgress(pct);
    }
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-[#090a10] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[800px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 right-0 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 backdrop-blur-md mb-3 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="tracking-wider uppercase text-[11px]">Touchtek in Motion</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 tracking-tight">
              See It In Action
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-2 max-w-xl">
              Experience the build, design, and performance through hands-on short-form video reels.
            </p>
          </div>

          {/* Header Controls (Sound toggle & desktop nav buttons) */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Audio Toggle Button */}
            <button
              onClick={toggleMute}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 backdrop-blur-md text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              title={globalMuted ? "Unmute Audio" : "Mute Audio"}
              aria-label={globalMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {globalMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <span className="hidden xs:inline">Sound Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="hidden xs:inline text-emerald-400">Sound On</span>
                </>
              )}
            </button>

            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <button
                ref={prevRef}
                aria-label="Previous Video"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                ref={nextRef}
                aria-label="Next Video"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Reel Swiper Container */}
        <div className="relative -mx-4 sm:mx-0">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            centeredSlides={true}
            slidesPerView={1.35}
            spaceBetween={12}
            loop={true}
            autoplay={{
              delay: 7000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setTimeout(() => {
                if (swiper.params?.navigation) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
                syncVideos(swiper, true);
              }, 300);
            }}
            onSlideChange={handleSlideChange}
            breakpoints={{
              480: {
                slidesPerView: 1.6,
                spaceBetween: 14,
              },
              640: {
                slidesPerView: 2.3,
                spaceBetween: 16,
                centeredSlides: false,
              },
              768: {
                slidesPerView: 2.8,
                spaceBetween: 16,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3.6,
                spaceBetween: 18,
                centeredSlides: false,
              },
              1280: {
                slidesPerView: 4.4,
                spaceBetween: 20,
                centeredSlides: false,
              },
            }}
            className="video-reel-swiper !px-4 sm:!px-0 !pb-6"
          >
            {videoData.map((item, index) => (
              <SwiperSlide key={item.id} className="h-auto">
                {({ isActive }) => (
                  <div
                    onClick={() => handleCardClick(item)}
                    className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none transition-all duration-500 bg-gray-900 border ${
                      isActive
                        ? "ring-2 ring-white/30 border-white/25 shadow-[0_12px_32px_rgba(0,0,0,0.6)] scale-[1.02] sm:scale-100"
                        : "border-white/10 opacity-75 hover:opacity-100 hover:border-white/20 scale-[0.98] sm:scale-100"
                    }`}
                    style={{
                      aspectRatio: "9/16",
                      height: "clamp(420px, 68vw, 530px)",
                    }}
                  >
                    {/* HTML5 Video Element */}
                    <video
                      src={item.video_url}
                      poster={item.thumbnail_url}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      muted={globalMuted}
                      playsInline
                      loop
                      preload="metadata"
                      onTimeUpdate={isActive ? handleTimeUpdate : undefined}
                    />

                    {/* Progress Bar on Active Slide */}
                    {isActive && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-20 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-100"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                    )}

                    {/* Gradient Vignette Overlays (Full vignette on mobile for text legibility, subtle on desktop) */}
                    <div className="sm:hidden absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none z-10" />
                    <div className="sm:hidden absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />
                    <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none z-10 group-hover:from-black/20 transition-all duration-300" />

                    {/* Top Row: Category Tag & Audio Indicator (Mobile only) */}
                    <div className="sm:hidden absolute top-3 inset-x-3 z-20 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/90 shadow-sm">
                        {item.tag}
                      </span>

                      {/* Card Audio Toggle (active card only on mobile) */}
                      {isActive && (
                        <button
                          onClick={toggleMute}
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-90 transition-all shadow-md cursor-pointer ml-auto"
                          title={globalMuted ? "Unmute" : "Mute"}
                          aria-label={globalMuted ? "Unmute" : "Mute"}
                        >
                          {globalMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-gray-300" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Center Animated Play/Pause Feedback Icon */}
                    <AnimatePresence>
                      {playFeedback && isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25 }}
                          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white z-20 pointer-events-none shadow-2xl"
                        >
                          {playFeedback === "play" ? (
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          ) : (
                            <Pause className="w-6 h-6 fill-white" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom Frosted Glass Product Card (Mobile only - hidden on desktop for clean video-only view) */}
                    <div className="sm:hidden absolute bottom-3 inset-x-3 z-20">
                      <div className="bg-black/65 backdrop-blur-md border border-white/15 rounded-xl p-2.5 shadow-2xl transition-all duration-300 group-hover:bg-black/80">
                        <div className="flex items-center gap-2.5">
                          {/* Product Thumbnail */}
                          <div className="relative w-11 h-11 rounded-xl bg-white/10 p-1 shrink-0 border border-white/10 overflow-hidden flex items-center justify-center">
                            <img
                              src={item.thumbnail_url}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                                ★ {item.rating}
                              </span>
                              <span className="text-white/40 text-[10px]">•</span>
                              <span className="text-white/70 text-[10px] uppercase tracking-wider font-semibold truncate">
                                {item.category}
                              </span>
                            </div>

                            <p className="text-white font-bold text-xs truncate leading-snug">
                              {item.name}
                            </p>

                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-white font-extrabold text-xs">
                                {item.price}
                              </span>
                              <span className="text-white/40 text-[10px] line-through">
                                {item.original_price}
                              </span>
                              <span className="text-emerald-400 font-bold text-[10px]">
                                {item.discount}
                              </span>
                            </div>
                          </div>

                          {/* Shop Action Button */}
                          <Link
                            href={item.link}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs px-2.5 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-sm active:scale-95 group/btn"
                            title={`Shop ${item.name}`}
                          >
                            <span>Shop</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
