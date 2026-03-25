// components/product/ProductInfo.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Shield, Truck, Award, MapPin } from 'lucide-react';

export default function ProductInfo({ product, variant }) {
  console.log('variant in product info', variant)
  const [selectedColor, setSelectedColor] = useState('Metallic Grey');
  const [pincode, setPincode] = useState('');
  const [showDelivery, setShowDelivery] = useState(false);

  const colors = [
    { name: 'Metallic Grey', image: 'https://via.placeholder.com/60x60/8A8A8A/FFFFFF?text=MG', code: 'MG' },
    { name: 'Black', image: 'https://via.placeholder.com/60x60/000000/FFFFFF?text=BLK', code: 'BLK' },
    { name: 'Sky Blue', image: 'https://via.placeholder.com/60x60/87CEEB/000000?text=SB', code: 'SB' },
    { name: 'White Green', image: 'https://via.placeholder.com/60x60/FFFFFF/00FF00?text=WG', code: 'WG' },
    { name: 'Mint Green', image: 'https://via.placeholder.com/60x60/98FF98/000000?text=MG', code: 'MG2' },
  ];

  const handleAddToCart = () => {
    console.log('Add to cart:', { productId: variant.id, color: selectedColor });
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { productId: variant.id, color: selectedColor });
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
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
          {product?.category?.name || 'TWS Earbuds'}
        </span>
        {variant?.is_hot_selling && (
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Hot Selling
          </span>
        )}
      </div>

      {/* Product name */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {product?.name || 'Desire Pods TWS Earbuds'}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < 4.5 ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600 font-medium">(127 reviews)</span>
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl md:text-4xl font-black text-gray-900">₹{variant?.consumer_price}</span>
          <span className="text-xl md:text-2xl text-gray-400 line-through">₹{variant?.printed_price}</span>
          <span className="text-lg font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{Math.round(variant?.discount_percent)}% Off</span>
        </div>
        <span className="text-sm text-gray-500">MRP (inclusive of all taxes)</span>
      </div>

      {/* Color Selector */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 block">Choose your color : {selectedColor}</label>
        <div className="flex gap-2 flex-wrap">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColor(color.name)}
              className={`relative p-1 rounded-full border-2 transition-all w-10 h-10 flex-shrink-0 ${
                selectedColor === color.name
                  ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image
                src={color.image}
                alt={color.name}
                width={60}
                height={60}
                className="w-6 h-6 rounded-md object-cover mx-auto"
              />
              {selectedColor === color.name && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-lg text-gray-700 leading-relaxed">
        {variant?.description || 'Premium quality TWS earbuds with advanced features and sleek design.'}
      </p>

      {/* Delivery Check - Delivery message BELOW input */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <div className="space-y-3">
          {/* Top row: Icon + Input + Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900 text-sm">Check delivery</span>
            </div>
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={checkDelivery}
                disabled={pincode.length !== 6}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex-shrink-0"
              >
                Check
              </button>
            </div>
          </div>
          
          {/* Delivery message - SHOWS BELOW input box */}
          {showDelivery && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-green-700 font-medium bg-green-50 px-4 py-2 rounded-lg flex-1">
                Free delivery by Saturday, 21 Mar
              </span>
              <button 
                onClick={() => setShowDelivery(false)} 
                className="ml-3 text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 border border-gray-300 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Buy Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 h-14 w-full"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-green-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 h-14 w-full"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
