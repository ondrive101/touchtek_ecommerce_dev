'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  ChevronLeft,
  CheckCircle,
  Phone,
  Calendar,
  Truck,
  CreditCard,
  Package,
  User,
  Shield,
  Gift,
  Percent,
  X
} from 'lucide-react';
import Header from '@/components/layout/components/Header';

const sampleCartItems = [
  { id: 1, name: 'Diamond TWS Earbuds', price: 2999, quantity: 2 },
  { id: 2, name: 'Li-Po Battery 5000mAh', price: 1499, quantity: 1 },
  { id: 3, name: '65W Charger + Cable', price: 899, quantity: 3 }
];

const MAX_POINTS = 1250;
let baseSubtotal = 9296;
let baseDiscount = 899;
let baseTax = 1673;
let total = 10169;

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addresses = [
    {
      id: 1,
      name: 'Home (Default)',
      fullAddress: 'House No. 123, Sector 15, Rohini, Delhi - 110085',
      phone: '+91 98765 43210',
      type: 'home'
    },
    {
      id: 2,
      name: 'Office',
      fullAddress: '3rd Floor, Tech Park, Pitampura, Delhi - 110034',
      phone: '+91 98765 43211',
      type: 'work'
    }
  ];

  // ✅ Dynamic calculations
  const pointsDiscount = Math.min(rewardPoints, MAX_POINTS);
  const subtotal = baseSubtotal;
  const discount = hasCoupon ? baseDiscount : 0;
  const tax = baseTax;
  const finalTotal = subtotal - discount - pointsDiscount + tax;

  const handleApplyCoupon = useCallback(() => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setHasCoupon(true);
    } else {
      alert('Invalid coupon');
    }
  }, [couponCode]);

  const handleRemoveCoupon = useCallback(() => {
    setHasCoupon(false);
    setCouponCode('');
  }, []);

  const handlePlaceOrder = () => {
    setTimeout(() => setShowSuccess(true), 1200);
  };

  if (showSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 max-w-2xl mx-auto text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle className="w-16 h-16 text-emerald-600" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Order Placed!</h1>
              <p className="text-lg text-slate-600 mb-6">Order #TT-ORD-789456</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
                <p className="text-sm font-semibold text-emerald-800 flex items-center justify-center gap-2 mb-1">
                  <Truck className="w-5 h-5" />
                  <Calendar className="w-5 h-5" />
                  Tomorrow 10 AM - 1 PM
                </p>
                <p className="text-xs text-emerald-700">Free delivery • Track anytime</p>
              </div>
              <div className="space-y-3">
                <Link 
                  href="/orders" 
                  className="block w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3.5 px-6 rounded-xl hover:shadow-md transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  Track Orders
                </Link>
                <Link 
                  href="/products" 
                  className="block w-full border-2 border-slate-200 text-slate-700 py-3 px-6 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-8 pt-6 border-t border-slate-200 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Safe & Secure • SSL Protected</span>
              </p>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Link href="/cart" className="p-2 -m-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
                <p className="text-sm text-slate-600">Order summary</p>
              </div>
            </div>

          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <section className="xl:col-span-2 space-y-6">
              
              {/* Delivery Address */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h2>
                
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <motion.button
                      key={address.id}
                      onClick={() => setSelectedAddress(address.id)}
                      className={`w-full p-4 border-2 rounded-xl transition-all text-left hover:shadow-md ${
                        selectedAddress === address.id
                          ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-100'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      whileHover={{ y: -1 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          selectedAddress === address.id ? 'bg-blue-500' : 'bg-slate-300'
                        }`}></div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-slate-900">{address.name}</span>
                            <span className={`px-2 py-px text-xs font-medium rounded-full ${
                              address.type === 'home' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {address.type}
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-700 mb-1 leading-tight">{address.fullAddress}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {address.phone}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2 pb-3 border-b border-slate-200">
                  Order Items (3)
                </h2>
                
                <div 
                  className="space-y-3 max-h-72 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#e5e7eb #f3f4f6' }}
                >
                  {sampleCartItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0 relative">
                        <Image 
                          src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=64&h=64&fit=crop" 
                          alt={item.name}
                          fill 
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-slate-500">×{item.quantity}</p>
                      </div>
                      
                      <div className="text-right min-w-[70px]">
                        <p className="text-sm font-bold text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Est Delivery */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Est. Delivery</h3>
                <p className="text-xs font-medium text-emerald-700">Tomorrow 10 AM - 1 PM</p>
                <p className="text-xs text-slate-500">Free • Track order</p>
              </motion.div>
            </section>

            {/* ✅ Summary - REMOVED STICKY, COMPACT REWARD/COUPON */}
            <aside className="xl:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4"
              >
                {/* ✅ COMPACT Rewards & Coupon */}
                <div className="space-y-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                  {/* Rewards - Compact with available points */}
                  <div className="flex items-center justify-between h-12 rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold text-slate-900">Rewards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={rewardPoints}
                        onChange={(e) =>
                          setRewardPoints(Math.min(parseInt(e.target.value) || 0, MAX_POINTS))
                        }
                        className="w-16 text-sm text-slate-900 placeholder-slate-500 border-none outline-none bg-transparent text-center font-mono"
                        max={MAX_POINTS}
                      />
                      <span className="text-[11px] text-slate-500">/ {MAX_POINTS} pts</span>
                      <button
                        onClick={() => setRewardPoints(0)}
                        className="text-xs text-blue-600 hover:underline px-1"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Coupon - Compact */}
                  <div className="relative flex items-center justify-between h-12 rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-emerald-500" />
                      <input
                        type="text"
                        placeholder="WELCOME10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-20 md:w-28 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
                      />
                    </div>
                    {!hasCoupon ? (
                      <button
                        onClick={handleApplyCoupon}
                        className="text-xs font-semibold text-emerald-600 hover:underline px-1"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1 px-1"
                      >
                        Applied <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {hasCoupon && (
                    <p className="text-[11px] text-emerald-700 text-right">₹899 discount applied!</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-xl">
                  <div className="flex justify-between text-sm py-1 border-b border-slate-200 pb-2">
                    <span>Subtotal (3 items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-emerald-600 font-medium py-1 border-b border-slate-200 pb-2">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                  
                  {pointsDiscount > 0 && (
                    <div className="flex justify-between text-sm text-amber-600 font-medium py-1 border-b border-slate-200 pb-2">
                      <span>Reward Points ({pointsDiscount})</span>
                      <span>-₹{pointsDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm py-1 border-b border-slate-200 pb-2">
                    <span>GST (18%)</span>
                    <span>+₹{tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm font-semibold py-2 border-b border-slate-200">
                    <span>Delivery</span>
                    <span className="text-emerald-600">FREE</span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-xl font-bold text-slate-900 mb-1">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-500">Inclusive of taxes</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-3">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-px transition-all text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    Place Order Securely
                    <CreditCard className="w-4 h-4" />
                  </button>
                  
                  <Link 
                    href="/products"
                    className="block w-full text-center py-3 px-4 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-semibold"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <p className="text-xs text-slate-500 text-center pt-4 border-t border-slate-200 flex items-center justify-center gap-2 pb-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Safe & Secure • SSL Protected</span>
                </p>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
