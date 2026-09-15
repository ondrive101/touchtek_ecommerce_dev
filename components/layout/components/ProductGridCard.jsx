'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store'; // Update path
import { useState } from 'react';

export default function ProductCard({ id, name, image, category, productSlug, cat, subcat, price, originalPrice, discount, maxQuantity = 999 }) {
  const {addItem, updateQuantity, removeItem, getItem } = useCartStore();
  const [localQuantity, setLocalQuantity] = useState(1);

  // Get current cart item quantity or use local state
  const cartItem = getItem(id);
  const currentQuantity = cartItem?.quantity || localQuantity;
  const isAddedToCart = !!cartItem;

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      image,
      discount,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice || price),
      category:cat,
      subCategory:subcat,
      slug: productSlug,
      quantity: currentQuantity,
      maxQuantity
    });
    setLocalQuantity(1); // Reset local quantity after adding
  };

  const handleQuantityChange = (newQuantity) => {
    if (!isAddedToCart) {
      setLocalQuantity(newQuantity);
      return;
    }
    
    updateQuantity(id, newQuantity);
  };

  const handleRemoveFromCart = () => {
    removeItem(id);
    setLocalQuantity(1);
  };

  const incrementQuantity = () => {
    const newQty = currentQuantity + 1;
    handleQuantityChange(newQty);
  };

  const decrementQuantity = () => {
    const newQty = currentQuantity - 1;
    handleQuantityChange(newQty > 0 ? newQty : 1);
  };

  return (
    <motion.div
      className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 relative flex flex-col justify-between overflow-hidden border border-gray-100"
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/en/product/${cat}/${subcat}/${productSlug}/${id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-gray-50/60">
          {/* Product Image */}
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Fallback placeholder */}
          <div className={`absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-white flex items-center justify-center ${image ? 'hidden' : ''}`}>
            <div className="text-center p-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 font-medium line-clamp-1">{category}</p>
            </div>
          </div>

          {/* Floating discount badge on image */}
          {originalPrice && price && originalPrice > price && (
            <div className="absolute top-2 left-2 z-10">
              <span className="text-[10px] sm:text-xs font-bold text-white bg-red-600 px-1.5 py-0.5 rounded shadow-sm">
                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-1 justify-between border-t border-gray-100">
        <Link href={`/en/product/${cat}/${subcat}/${productSlug}/${id}`} className="block">
          <div className="mb-2 sm:mb-3">
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-xs sm:text-sm md:text-[15px] group-hover:text-gray-700 transition-colors uppercase leading-snug sm:leading-normal min-h-[2rem] sm:min-h-[2.5rem]">
              {name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[11px] sm:text-xs text-gray-500 ml-0.5 sm:ml-1">(4.8)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline flex-wrap gap-1 sm:gap-2">
              {price && (
                <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                  ₹{price}
                </span>
              )}
              {originalPrice && (
                <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className="pt-1">
          {/* Add to Cart / Quantity Controls */}
          {isAddedToCart ? (
            <motion.div 
              className="w-full bg-blue-50/90 border border-blue-200 rounded-lg sm:rounded-xl p-1 sm:p-1.5 flex items-center justify-between gap-1 sm:gap-2"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <motion.button
                  onClick={decrementQuantity}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={currentQuantity <= 1}
                  className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md flex items-center justify-center shadow-xs hover:bg-blue-50 transition-all border border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-700" />
                </motion.button>
                
                <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[1.25rem] text-center">
                  {currentQuantity}
                </span>
                
                <motion.button
                  onClick={incrementQuantity}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md flex items-center justify-center shadow-xs hover:bg-blue-50 transition-all border border-blue-200"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-700" />
                </motion.button>
              </div>
              
              <motion.button
                onClick={handleRemoveFromCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 sm:px-2 text-red-500 hover:text-red-700 flex items-center justify-center rounded transition-colors"
                title="Remove from cart"
                aria-label="Remove from cart"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs ml-1 font-medium">Remove</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-black text-white text-center py-2 sm:py-2.5 md:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Add to Cart</span>
            </motion.button>
          )}
        </div>
      </div>
      

      {/* Animated Border */}
      {/* <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 opacity-20"></div>
      </div> */}
    </motion.div>
  );
}
