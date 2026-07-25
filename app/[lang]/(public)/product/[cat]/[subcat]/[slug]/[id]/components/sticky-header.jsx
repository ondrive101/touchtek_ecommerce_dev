
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Star } from 'lucide-react';
import { useCartStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyHeader({
  product,
  colorOptions = [],
  selectedColor = '',
  onColorChange,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [localQuantity, setLocalQuantity] = useState(1);
  const { addItem, getItem } = useCartStore();

  const cartItemId = product?.skuCode || id;
  const cartItem = getItem(cartItemId);
  const currentQuantity = cartItem?.quantity || localQuantity;
  const isAddedToCart = !!cartItem;
  const isOutOfStock = product?.stockLevel === 'out_of_stock';

  const productName =
    product?.name || product?.productName || product?.skuCode || 'Product';

  const price = product?.price ?? 0;
  const originalPrice = product?.originalPrice ?? price;
  const discount = Math.round(product?.discount ?? 0);

  /*
    REVIEWS SCHEMA:
    product.reviews = [
      {
        id: '6a64ebd4c4',
        name: 'Vishal Kumar',
        review: 'Very Good Product',
        stars: 3,
        createdAt: '2026-07-25T17:01:08.274Z'
      }
    ]
  */
  const { reviewCount, averageRating } = useMemo(() => {
    const validReviews = Array.isArray(product?.reviews)
      ? product.reviews.filter((review) => {
          const stars = Number(review?.stars);
          return Number.isFinite(stars) && stars >= 1 && stars <= 5;
        })
      : [];

    const count = validReviews.length;

    const totalStars = validReviews.reduce(
      (sum, review) => sum + Number(review.stars),
      0
    );

    return {
      reviewCount: count,
      averageRating: count > 0 ? totalStars / count : 0,
    };
  }, [product?.reviews]);

  const activeColorOption =
    colorOptions.find((color) => color.value === selectedColor) ||
    colorOptions[0];

  const thumbnail =
    activeColorOption?.image ||
    product?.images?.[0]?.image ||
    product?.images?.[0]?.fileUrl ||
    null;

  const displayColor = selectedColor || activeColorOption?.value || '';

  useEffect(() => {
    const sentinel = document.getElementById('product-info-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      id: cartItemId,
      name: productName,
      image: thumbnail,
      discount,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      category: product?.category?.id,
      subCategory: product?.subCatgory?.id || product?.subCategory?.id,
      slug: product?.slug,
      quantity: currentQuantity,
      maxQuantity: 999,
      color: displayColor,
      skuCode: product?.skuCode,
    });

    setLocalQuantity(1);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    if (!isAddedToCart) {
      handleAddToCart();
    }

    router.push('/en/cart');
  };

  const handleColorSelect = (colorOption) => {
    onColorChange?.(colorOption.value);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white shadow-md"
        >
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* LEFT: image, name, dynamic rating */}
            <div className="flex min-w-0 items-center gap-3">
              {thumbnail && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                  <Image
                    src={thumbnail}
                    alt={productName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight text-gray-900">
                  {productName}
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  {reviewCount > 0 ? (
                    <>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-gray-700">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({reviewCount}{' '}
                        {reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">No reviews yet</span>
                  )}

                  {displayColor && (
                    <span className="hidden truncate text-xs text-gray-400 xs:inline">
                      · {displayColor}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: swatches, price, purchase */}
            <div className="flex shrink-0 items-center gap-3">
              {colorOptions.length > 0 && (
                <div className="hidden items-center gap-1.5 md:flex">
                  {colorOptions.map((color) => {
                    const isSelected = selectedColor === color.value;

                    return (
                      <button
                        key={color.id || color.value}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        title={color.value}
                        aria-label={`Select ${color.value} color`}
                        className={`relative h-7 w-7 overflow-hidden rounded-full border-2 transition-all ${
                          isSelected
                            ? 'scale-110 border-gray-900'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <Image
                          src={color.image}
                          alt={color.value}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="hidden h-8 w-px bg-gray-200 sm:block" />

              <div className="hidden flex-col items-end leading-tight sm:flex">
                <span className="whitespace-nowrap text-sm font-bold text-gray-900">
                  ₹{Number(price).toLocaleString('en-IN')}
                </span>

                {Number(originalPrice) > Number(price) && (
                  <span className="text-[11px] text-gray-400 line-through">
                    ₹{Number(originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="whitespace-nowrap rounded-lg bg-gray-900 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}