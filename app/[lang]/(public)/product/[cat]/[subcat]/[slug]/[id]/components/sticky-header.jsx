'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyHeader({ product, variant }) {
  const [isVisible, setIsVisible] = useState(false);
   // Get current cart item quantity or use local state
   const router = useRouter();
    const params = useParams();
   const { id } = params;
   const [localQuantity, setLocalQuantity] = useState(1);
   const { addItem, getItem } = useCartStore();
   const cartItem = getItem(id);
   const currentQuantity = cartItem?.quantity || localQuantity;
   const isAddedToCart = !!cartItem;

  useEffect(() => {
    const sentinel = document.getElementById('product-info-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' } // adjust to your Header height
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

   const handleAddToCart = () => {
      addItem({
      id,
      name: product?.name,
      image: variant?.image,
      discount: variant.discount_percent,
      price: parseFloat(variant.consumer_price),
      originalPrice: parseFloat(variant.printed_price || variant.consumer_price),
      category:product.category?.id,
      subCategory:product.subCategory?.id,
      slug: product.slug,
      quantity: currentQuantity,
      maxQuantity: 999
    });
    setLocalQuantity(1); 
  };

  const handleBuyNow = () => {
    if (!isAddedToCart) {
      handleAddToCart();
    }
    router.push("/en/cart");
  };

  // Mirror your hardcoded values as fallbacks
  const productName = product?.name || 'Desire Pods TWS Earbuds';
  const variantName = variant?.name || productName;
  const salePrice = variant?.consumer_price ?? 0;
  const thumbnail = variant?.images?.[0]?.url || null;
  const reviewCount = product?.reviewCount ?? 127;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md h-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

            {/* LEFT: Thumbnail + Name + Rating */}
            <div className="flex items-center gap-3 min-w-0">
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt={variantName}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover shrink-0 border border-gray-100"
                />
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate leading-tight">
                  {variantName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500">({reviewCount})</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Color swatch + Divider + Price + Buy Now */}
            <div className="flex items-center gap-3 shrink-0">

              {/* Color dot — shows active variant color */}
              <div
                className="w-7 h-7 rounded-full border-2 border-gray-300 shadow-sm hidden sm:block"
                style={{
                  backgroundColor: variant?.colorHex ?? '#1a1a1a',
                }}
                title={variant?.color ?? 'Black'}
              />

              <div className="h-8 w-px bg-gray-200 hidden sm:block" />

              {/* Sale price */}
              <span className="text-sm font-semibold text-gray-700 hidden sm:block whitespace-nowrap">
                Sale Price:{' '}
                <span className="text-gray-900 font-bold">
                  ₹{salePrice.toLocaleString('en-IN')}
                </span>
              </span>

              {/* Buy Now CTA */}
              <button
                onClick={handleBuyNow}
                className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Buy Now
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
