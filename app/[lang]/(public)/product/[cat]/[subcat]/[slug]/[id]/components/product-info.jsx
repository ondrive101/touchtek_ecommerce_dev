'use client';

import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store';
import Image from 'next/image';
import { Star, MapPin, Minus, Plus } from 'lucide-react';

export default function ProductInfo({
  product,
  colorOptions = [],
  selectedColor = '',
  onColorChange,
}) {
  const router = useRouter();
  const params = useParams();
  const { cat, subcat, slug, id } = params;

  const [pincode, setPincode] = useState('');
  const [showDelivery, setShowDelivery] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(1);

  const { addItem, updateQuantity, removeItem, getItem } = useCartStore();

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
      averageRating: count ? totalStars / count : 0,
    };
  }, [product?.reviews]);

  const activeColorOption =
    colorOptions.find((color) => color.value === selectedColor) ||
    colorOptions[0];

  const productImage = activeColorOption?.image || '';

  const handleColorSelect = (colorOption) => {
    onColorChange?.(colorOption.value);

    if (colorOption.skuId && colorOption.skuId !== product?.skuCode) {
      const baseCat = cat || product?.category?.id;
      const baseSub =
        subcat || product?.subCatgory?.id || product?.subCategory?.id;
      const baseSlug = slug || product?.slug;

      if (baseCat && baseSub && baseSlug) {
        router.push(
          `/en/product/${baseCat}/${baseSub}/${baseSlug}/${colorOption.skuId}`
        );
      }
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      id: cartItemId,
      name: productName,
      image: productImage,
      discount,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      category: product?.category?.id,
      subCategory: product?.subCatgory?.id || product?.subCategory?.id,
      slug: product?.slug || slug,
      quantity: currentQuantity,
      maxQuantity: 999,
      color: selectedColor,
      skuCode: product?.skuCode,
    });

    setLocalQuantity(1);
  };

  const handleQuantityChange = (newQuantity) => {
    if (!isAddedToCart) {
      setLocalQuantity(newQuantity);
      return;
    }

    updateQuantity(cartItemId, newQuantity);
  };

  const handleRemoveFromCart = () => {
    removeItem(cartItemId);
    setLocalQuantity(1);
  };

  const incrementQuantity = () => {
    handleQuantityChange(currentQuantity + 1);
  };

  const decrementQuantity = () => {
    const newQuantity = currentQuantity - 1;
    handleQuantityChange(newQuantity > 0 ? newQuantity : 1);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    if (!isAddedToCart) {
      handleAddToCart();
    }

    router.push('/en/cart');
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setShowDelivery(true);
    }
  };

  return (
    <div className="space-y-6">
      <div id="product-info-sentinel" />

      {product?.is_hot_selling && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 text-sm font-semibold text-white">
            <Star className="h-3 w-3 fill-current" />
            Hot Selling
          </span>
        </div>
      )}

      {/* Name */}
      <div>
        <h1 className="text-3xl font-bold uppercase leading-tight text-gray-900 md:text-4xl">
          {productName}
        </h1>

        {product?.description && (
          <p className="mt-1 text-sm font-light capitalize text-gray-400">
            {product.description}
          </p>
        )}
      </div>

      {/* Real rating and review count from product.reviews */}
      <div className="flex items-center gap-2">
        {reviewCount > 0 ? (
          <>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => {
                const starNumber = index + 1;
                const isFilled = starNumber <= Math.round(averageRating);

                return (
                  <Star
                    key={starNumber}
                    className={`h-5 w-5 ${
                      isFilled
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                );
              })}
            </div>

            <span className="font-semibold text-gray-800">
              {averageRating.toFixed(1)}
            </span>

            <span className="font-medium text-gray-600">
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="h-5 w-5 fill-gray-200 text-gray-200"
                />
              ))}
            </div>

            <span className="font-medium text-gray-500">No reviews yet</span>
          </>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900 md:text-4xl">
            ₹{price}
          </span>

          {Number(originalPrice) > Number(price) && (
            <span className="text-xl text-gray-400 line-through md:text-2xl">
              ₹{originalPrice}
            </span>
          )}

          {discount > 0 && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-lg font-bold text-green-600">
              {discount}% Off
            </span>
          )}
        </div>

        <span className="text-sm text-gray-500">
          MRP (inclusive of all taxes)
        </span>

        {isOutOfStock && (
          <p className="text-sm font-semibold text-red-600">Out of stock</p>
        )}
      </div>

      {/* Color selector */}
      {colorOptions.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Choose your color: {selectedColor || activeColorOption?.value}
          </label>

          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color, index) => {
              const isSelected = selectedColor === color.value;

              return (
                <button
                  key={color.id || color.value || index}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  title={color.value}
                  aria-label={`Select ${color.value} color`}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                    isSelected
                      ? 'border-gray-700 ring-2 ring-gray-300'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={color.image}
                    alt={color.value || 'Product color'}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery check */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5">
        <div className="space-y-3">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-shrink-0 items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                Check delivery
              </span>
            </div>

            <div className="flex w-full gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(event) =>
                  setPincode(event.target.value.replace(/[^0-9]/g, ''))
                }
                maxLength={6}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:px-4"
              />

              <button
                type="button"
                onClick={checkDelivery}
                disabled={pincode.length !== 6}
                className="flex-shrink-0 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 sm:px-6"
              >
                Check
              </button>
            </div>
          </div>

          {showDelivery && (
            <div className="flex flex-col items-stretch gap-2 pt-1 sm:flex-row sm:items-center">
              <span className="flex-1 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 sm:px-4">
                🚚 Free delivery available for this pincode
              </span>

              <button
                type="button"
                onClick={() => setShowDelivery(false)}
                className="whitespace-nowrap rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 active:scale-95 sm:flex-shrink-0"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Purchase controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 items-center gap-3">
          {isAddedToCart ? (
            <motion.div
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 p-2 sm:gap-3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                type="button"
                onClick={decrementQuantity}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentQuantity <= 1}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white shadow-md transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
              >
                <Minus className="h-3 w-3 text-blue-700 sm:h-4 sm:w-4" />
              </motion.button>

              <span className="min-w-[1.5rem] text-center text-base font-bold text-gray-900 sm:text-lg">
                {currentQuantity}
              </span>

              <motion.button
                type="button"
                onClick={incrementQuantity}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white shadow-md transition-all hover:bg-blue-50 sm:h-10 sm:w-10"
              >
                <Plus className="h-3 w-3 text-blue-700 sm:h-4 sm:w-4" />
              </motion.button>

              <motion.button
                type="button"
                onClick={handleRemoveFromCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-1 flex-shrink-0 text-xs font-semibold text-red-600 transition-colors hover:text-red-700 sm:text-sm"
              >
                Remove
              </motion.button>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none disabled:bg-gray-400 disabled:shadow-none sm:h-14 sm:px-8 sm:py-4 sm:text-lg"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none disabled:bg-gray-400 disabled:shadow-none sm:h-14 sm:px-8 sm:py-4 sm:text-lg"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}