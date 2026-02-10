'use client';

import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bell, Calendar, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function UpcomingProductsCarousel({ products }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Filter and prepare upcoming products with launch dates
  const upcomingProducts = products
    .map((product) => {
      // Generate deterministic launch date (future date based on product ID)
      const hash = product.id
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const daysUntilLaunch = (hash % 30) + 1; // 1-30 days from now
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + daysUntilLaunch);
      
      return {
        ...product,
        launchDate,
        daysUntilLaunch,
        notifyCount: (hash % 1000) + 200, // Number of people waiting
      };
    })
    .sort((a, b) => a.launchDate - b.launchDate)
    .slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {/* <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-4">
              Upcoming Products
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Be the first to discover our upcoming innovative products launching soon
          </p>
        </motion.div> */}
        <motion.div
  className="text-center mb-12"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  {/* Decorative top element */}
  <div className="flex items-center justify-center gap-3 mb-3">
    <motion.div
      className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300"
      initial={{ width: 0 }}
      whileInView={{ width: 48 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    />
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5 text-gray-500 animate-pulse" />
      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Coming Soon
      </span>
      <Clock className="w-5 h-5 text-gray-500 animate-pulse" />
    </div>
    <motion.div
      className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300"
      initial={{ width: 0 }}
      whileInView={{ width: 48 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    />
  </div>

  {/* Main heading with icons */}
  <div className="flex items-center justify-center gap-3 mb-4">
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-gray-700" />
      </div>
    </motion.div>
    
    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
      Upcoming Products
    </h2>
    
    <motion.div
      initial={{ scale: 0, rotate: 180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <Calendar className="w-5 h-5 text-gray-700" />
      </div>
    </motion.div>
  </div>

  {/* Description with icon */}
  <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
    <div className="hidden sm:block">
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />
      </div>
    </div>
    <p className="text-base md:text-lg text-gray-600">
      Be the first to discover our upcoming innovative products launching soon
    </p>
    <div className="hidden sm:block">
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />
      </div>
    </div>
  </div>
</motion.div>


        {/* Carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="upcoming-carousel"
          >
            {upcomingProducts.map((product, index) => (
              <SwiperSlide key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group"
            aria-label="Previous upcoming product"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>

          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group"
            aria-label="Next upcoming product"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// Separate Product Card Component with Countdown Timer
function ProductCard({ product }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = product.launchDate - new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [product.launchDate]);

  const handleNotifyMe = () => {
    setIsNotified(true);
    // Add your notification logic here (e.g., API call, email subscription)
    console.log(`Notify me for product: ${product.name}`);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative">
      {/* Product Image with Overlay */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />

        {/* Upcoming Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-gray-800 to-black text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          UPCOMING
        </div>

        {/* Launch Date */}
        <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {product.launchDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>

        {/* Notify Count */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Bell className="w-3 h-3" />
          {product.notifyCount}+ waiting
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-5">
        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
          {product.category}
        </span>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-base group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Countdown Timer */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-1 mb-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span className="font-medium">Launching in:</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <CountdownUnit value={timeLeft.hours} label="Hrs" />
            <CountdownUnit value={timeLeft.minutes} label="Min" />
            <CountdownUnit value={timeLeft.seconds} label="Sec" />
          </div>
        </div>

        {/* Notify Me Button */}
        <button
          onClick={handleNotifyMe}
          disabled={isNotified}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
            isNotified
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-900 hover:to-gray-900 hover:shadow-xl'
          }`}
        >
          <Bell className={`w-4 h-4 ${isNotified ? '' : 'animate-pulse'}`} />
          {isNotified ? 'You\'ll be notified!' : 'Notify Me at Launch'}
        </button>
      </div>

      {/* Gradient hover outline */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-500 via-gray-800 to-gray-600 opacity-20" />
      </div>
    </div>
  );
}

// Countdown Unit Component
function CountdownUnit({ value, label }) {
  return (
    <div className="text-center">
      <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
        <span className="text-lg font-bold text-gray-800">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-gray-500 mt-1 block">{label}</span>
    </div>
  );
}
