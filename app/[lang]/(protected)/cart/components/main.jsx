'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  CreditCard,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/layout/components/Header';

const sampleCartItems = [
  {
    id: 1,
    name: 'Diamond TWS Earbuds',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
    quantity: 2,
    category: 'Audio',
    discount: 15
  },
  {
    id: 2,
    name: 'Li-Po Battery 5000mAh',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    quantity: 1,
    category: 'Battery',
    discount: 0  // Fixed: was missing
  },
  {
    id: 3,
    name: '65W Charger + Cable',
    price: 899,
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=300&h=300&fit=crop',
    quantity: 3,
    category: 'Accessories',
    discount: 0  // Fixed: was missing
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(sampleCartItems);
  const [isCartEmpty, setIsCartEmpty] = useState(false);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // ✅ FIXED: Proper calculation functions
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity * (item.discount || 0) / 100), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.18;
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 5000 ? 0 : 99;
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal - discount + tax + shipping;

  useEffect(() => {
    setIsCartEmpty(cartItems.length === 0);
  }, [cartItems]);

  // ✅ Debug: Log calculations (remove in production)
  console.log({ subtotal, discount, tax, shipping, total });

  if (isCartEmpty) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="max-w-5xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <ShoppingCart className="w-12 h-12 text-slate-500" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-slate-900 bg-clip-text text-transparent">
                Cart is Empty
              </h1>
              <p className="text-sm text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed">
                No items in your cart. Add some products to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/products" 
                  className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm font-semibold flex items-center gap-2 justify-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Browse Products
                </Link>
                <Link 
                  href="/products" 
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-semibold"
                >
                  Top Picks
                </Link>
              </div>
            </motion.div>

            <section className="mt-16">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 text-center">Quick Picks</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { img: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300', name: 'TWS Pro' },
                  { img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300', name: 'Battery' },
                  { img: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=300', name: 'Charger' }
                ].map((item, i) => (
                  <Link key={i} href="/products" className="group">
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all h-48 flex flex-col">
                      <div className="flex-1 bg-slate-50 rounded-lg overflow-hidden mb-3">
                        <Image src={item.img} alt="" fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="font-medium text-sm text-slate-900">{item.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
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
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link href="/products" className="p-2 -m-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
              <p className="text-sm text-slate-600">{cartItems.length} items</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all p-6 mb-4 last:mb-0 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shadow-sm group-hover:shadow-md transition-shadow">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {item.discount > 0 && (
                          <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                            -{item.discount}%
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm text-slate-900 pr-2 line-clamp-2 leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg hover:text-red-600 transition-all -m-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 capitalize mb-3">{item.category}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold text-slate-900">
                                ₹{Math.round(item.price * item.quantity).toLocaleString()}
                              </span>
                              {item.discount > 0 && (
                                <span className="text-xs text-slate-400 line-through">
                                  ₹{Math.round(item.price * item.quantity * 1.15).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">₹{item.price.toLocaleString()} each</p>
                          </div>

                          <div className="flex items-center bg-slate-100 rounded-lg p-1 ml-4">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                            <span className="w-8 text-center font-mono text-sm font-semibold px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
                <div className="flex flex-col items-center p-3 text-center text-xs">
                  <Truck className="w-6 h-6 text-blue-600 mb-1" />
                  <p className="font-medium text-slate-900">Free Shipping</p>
                  <p className="text-slate-500">Over ₹5,000</p>
                </div>
                <div className="flex flex-col items-center p-3 text-center text-xs">
                  <Shield className="w-6 h-6 text-green-600 mb-1" />
                  <p className="font-medium text-slate-900">2 Year Warranty</p>
                  <p className="text-slate-500">All Products</p>
                </div>
                <div className="flex flex-col items-center p-3 text-center text-xs">
                  <Package className="w-6 h-6 text-purple-600 mb-1" />
                  <p className="font-medium text-slate-900">Easy Returns</p>
                  <p className="text-slate-500">30 Days</p>
                </div>
                <div className="flex flex-col items-center p-3 text-center text-xs">
                  <CreditCard className="w-6 h-6 text-indigo-600 mb-1" />
                  <p className="font-medium text-slate-900">Secure Payment</p>
                  <p className="text-slate-500">SSL Encrypted</p>
                </div>
              </div>
            </section>

            <aside className="xl:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sticky top-24"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{Math.round(discount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>+₹{Math.round(tax).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-slate-900 mb-1">
                    <span>Total</span>
                    <span>₹{Math.round(total).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 text-right">Inclusive of all taxes</p>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/checkout"
                    className="w-full block bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-px transition-all text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <CreditCard className="w-4 h-4" />
                  </Link>
                  <Link 
                    href="/products"
                    className="w-full block text-center py-3 px-4 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-semibold"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Safe & Secure</span>
                  <span>•</span>
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>SSL Protected</span>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
