'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Eye, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function NewArrivalsCarousel({ products }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Filter and prepare new arrival products (products added in last 30 days)
  const newArrivals = products
    .map((product) => {
      // Generate deterministic arrival date (within last 30 days based on product ID)
      const hash = product.id
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const daysAgo = (hash % 30) + 1; // 1-30 days ago
      const arrivalDate = new Date();
      arrivalDate.setDate(arrivalDate.getDate() - daysAgo);
      
      return {
        ...product,
        arrivalDate,
        daysAgo,
        isNew: daysAgo <= 7, // Products within 7 days get extra "NEW" emphasis
      };
    })
    .sort((a, b) => b.arrivalDate - a.arrivalDate) // Most recent first
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
              New Arrivals
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check out our latest products with cutting-edge technology and fresh designs
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
      <Sparkles className="w-5 h-5 text-green-500 animate-pulse" />
      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Fresh Collection
      </span>
      <Sparkles className="w-5 h-5 text-green-500 animate-pulse" />
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
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-green-600" />
      </div>
    </motion.div>
    
    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
      New Arrivals
    </h2>
    
    <motion.div
      initial={{ scale: 0, rotate: 180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
        <ShoppingCart className="w-5 h-5 text-green-600" />
      </div>
    </motion.div>
  </div>

  {/* Description with icon */}
  <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
    <div className="hidden sm:block">
      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </div>
    <p className="text-base md:text-lg text-gray-600">
      Check out our latest products with cutting-edge technology and fresh designs
    </p>
    <div className="hidden sm:block">
      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
              delay: 3500,
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
            className="new-arrivals-carousel"
          >
            {newArrivals.map((product, index) => (
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
            aria-label="Previous new arrival"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>

          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group"
            aria-label="Next new arrival"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAddedToCart(true);
    // Add your cart logic here
    console.log(`Added to cart: ${product.name}`);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  const formatArrivalDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Added today';
    if (diffDays === 2) return 'Added yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative">
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />

        {/* NEW Badge with pulse animation */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
          <Sparkles className="w-3 h-3" />
          NEW
        </div>

        {/* Arrival Date */}
        <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatArrivalDate(product.arrivalDate)}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link href={`/product/${product.productSlug}/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
              title="Quick View"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
            title="Quick Add to Cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
          {product.category}
        </span>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-base group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">(5.0)</span>
          <span className="text-xs text-green-600 font-semibold ml-2">• Fresh</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          {product.price && (
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
          )}
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
          {product.originalPrice &&
            product.price &&
            product.originalPrice > product.price && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                -
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                %
              </span>
            )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1.5">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.name}
                  className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-gray-500">
                  +{product.colors.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddedToCart}
          className={`w-full text-center py-3 px-4 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
            isAddedToCart
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-900 hover:to-gray-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>

      {/* Gradient hover outline */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-500 via-gray-800 to-gray-600 opacity-20" />
      </div>

      {/* "Just Arrived" ribbon for products less than 7 days old */}
      {product.isNew && (
        <div className="absolute top-8 -right-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold py-1 px-10 transform rotate-45 shadow-lg">
          JUST IN
        </div>
      )}
    </div>
  );
}
