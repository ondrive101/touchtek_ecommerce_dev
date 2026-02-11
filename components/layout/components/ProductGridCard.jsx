'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';

export default function ProductCard({ id, name, image, slug, category, price, originalPrice, discount }) {
  return (
    <motion.div
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="aspect-square relative  overflow-hidden">
        {/* Product Image */}
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.style.display = 'none';
              e.target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback placeholder */}
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-white flex items-center justify-center ${image ? 'hidden' : ''}`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg className="w-10 h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">{category}</p>
          </div>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/product/${id}/${slug}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors"
            >
              <Eye className="w-5 h-5 text-white" />
            </motion.button>
          </Link>
        </div>

      </div>
      
      <div className="p-6 border-t border-gray-100">
        <div className="mb-4">
          {category && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
              {category}
            </span>
          )}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg group-hover:text-gray-700 transition-colors">
            {name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gray-700 text-gray-700" />
            ))}
            <span className="text-sm text-gray-500 ml-1">(4.8)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            {price && (
              <span className="text-lg font-bold text-gray-900">
                ₹{price}
              </span>
            )}
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{originalPrice}
              </span>
            )}
            {originalPrice && price && originalPrice > price && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </span>
            )}
          </div>
        </div>
        
        <div className="flex">
          <Link
            href={`/product/${id}/${slug}`}
            className="w-full bg-gradient-to-r from-gray-800 to-black text-white text-center py-3 px-4 rounded-xl hover:from-gray-900 hover:to-gray-900 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Link>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 opacity-20"></div>
      </div>
    </motion.div>
  );
}
