// components/product/ProductInfo.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store';
import Image from 'next/image';
import { Star, MapPin, Minus, Plus } from 'lucide-react';

export default function ProductInfo({ product, variant,types }) {
  const {addItem, updateQuantity, removeItem, getItem } = useCartStore();
  // console.log('variant in product info', variant)
  // console.log('product in product info', product)
  // console.log('types in product info', types)
  const router = useRouter();
  const params = useParams();
  const { cat, subcat, slug, id } = params;
  const [selectedColor, setSelectedColor] = useState({
    value: variant?.attributes?.color,
    skuId: variant?.skuCode
  });
  const [pincode, setPincode] = useState('');
  const [showDelivery, setShowDelivery] = useState(false);

    const [localQuantity, setLocalQuantity] = useState(1);
  
    // Get current cart item quantity or use local state
    const cartItem = getItem(id);
    const currentQuantity = cartItem?.quantity || localQuantity;
    const isAddedToCart = !!cartItem;

  const handleColorSelect = (colorOption) => {
    setSelectedColor(colorOption);
    router.push(`/en/product/${cat}/${subcat}/${slug}/${colorOption?.skuId}`);
  };




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


  const handleBuyNow = () => {
    if (!isAddedToCart) {
      handleAddToCart();
    }
    router.push("/en/cart");
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setShowDelivery(true);
    }
  };

  return (
    <div className="space-y-6">
      <div id="product-info-sentinel" />
      {/* Category badges */}

      {variant?.is_hot_selling && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Hot Selling
          </span>
        </div>
      )}

      {/* Product name and description */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight uppercase">
          {product?.name || "Desire Pods TWS Earbuds"}
        </h1>
        {/* Product description */}
        <p className="text-sm font-light text-gray-400 mt-1 capitalize">
          {variant?.description || "Your product description goes here"}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < 4.5
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600 font-medium">(127 reviews)</span>
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl md:text-4xl font-black text-gray-900">
            ₹{variant?.consumer_price}
          </span>
          <span className="text-xl md:text-2xl text-gray-400 line-through">
            ₹{variant?.printed_price}
          </span>
          <span className="text-lg font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
            {Math.round(variant?.discount_percent)}% Off
          </span>
        </div>
        <span className="text-sm text-gray-500">
          MRP (inclusive of all taxes)
        </span>
      </div>

      {/* Color Selector */}
{types?.colors && (
  <div className="space-y-3">
    <label className="text-sm font-semibold text-gray-700 block">
      Choose your color : {selectedColor?.value}
    </label>
    <div className="flex gap-2 flex-wrap">
      {types?.colors?.map((color, idx) => {
        const isSelected = selectedColor?.skuId === color.skuId;

        return (
          <button
            key={idx}
            onClick={() => handleColorSelect(color)}
            title={color.value}
            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all ${
              isSelected
                ? " border-1 border-gray-700 ring-2 ring-gray-300"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <Image
              src={color.image}
              alt={color.value}
              fill
              className="object-cover"
              
            />
            {/* {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
              </div>
            )} */}
          </button>
        );
      })}
    </div>
  </div>
)}
  

      {/* Delivery Check - Delivery message BELOW input */}
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-100">
  <div className="space-y-3">

    {/* Top row: Icon + Label + Input + Button */}
    <div className="flex flex-col xs:flex-row sm:flex-row items-start sm:items-center gap-2 sm:gap-3">

      {/* Icon + Label */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
          Check delivery
        </span>
      </div>

      {/* Input + Button */}
      <div className="flex w-full gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
          maxLength={6}
          className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={checkDelivery}
          disabled={pincode.length !== 6}
          className="px-4 sm:px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all whitespace-nowrap flex-shrink-0"
        >
          Check
        </button>
      </div>
    </div>

    {/* Delivery Result Row */}
    {showDelivery && (
      <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        <span className="flex-1 text-sm text-green-700 font-medium bg-green-50 border border-green-200 px-3 sm:px-4 py-2 rounded-lg">
          🚚 Free delivery by Saturday, 21 Mar
        </span>
        <button
          onClick={() => setShowDelivery(false)}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 border border-gray-300 rounded-lg transition-colors whitespace-nowrap active:scale-95 sm:flex-shrink-0"
        >
          Change
        </button>
      </div>
    )}

  </div>
</div>

      {/* Buy Buttons */}
    <div className="space-y-3">
  <div className="grid grid-cols-2 gap-3 items-center">

    {isAddedToCart ? (
      <motion.div
        className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl p-2 flex items-center justify-center gap-2 sm:gap-3"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          onClick={decrementQuantity}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentQuantity <= 1}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:bg-blue-50 transition-all duration-200 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
        </motion.button>

        <span className="text-base sm:text-lg font-bold text-gray-900 min-w-[1.5rem] text-center">
          {currentQuantity}
        </span>

        <motion.button
          onClick={incrementQuantity}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:bg-blue-50 transition-all duration-200 border border-blue-200 flex-shrink-0"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
        </motion.button>

        <motion.button
          onClick={handleRemoveFromCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs sm:text-sm text-red-600 font-semibold hover:text-red-700 transition-colors ml-1 flex-shrink-0"
        >
          Remove
        </motion.button>
      </motion.div>
    ) : (
      <button
        onClick={handleAddToCart}
        className="bg-gray-900 text-white py-3 sm:py-4 px-4 sm:px-8 rounded-xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 h-12 sm:h-14 w-full"
      >
        Add to Cart
      </button>
    )}

    <button
      onClick={handleBuyNow}
      className="bg-green-500 text-white py-3 sm:py-4 px-4 sm:px-8 rounded-xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 h-12 sm:h-14 w-full"
    >
      Buy Now
    </button>

  </div>
</div>
    </div>
  );
}
