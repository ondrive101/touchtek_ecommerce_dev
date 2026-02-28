'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store';
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
  CheckCircle,
} from 'lucide-react';
import Header from '@/components/layout/components/Header';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, increaseById, decreaseById, removeItem, getSubtotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-slate-200 rounded"></div>
                <div className="h-4 w-24 bg-slate-300 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <section className="xl:col-span-2 space-y-4">
                <div className="h-24 bg-slate-200 rounded-2xl"></div>
                <div className="h-24 bg-slate-200 rounded-2xl"></div>
              </section>
              <aside className="xl:col-span-1">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="h-6 w-32 bg-slate-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-slate-300 rounded"></div>
                      <div className="h-4 w-20 bg-slate-300 rounded"></div>
                    </div>
                    <div className="h-12 bg-slate-200 rounded-xl"></div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const calculateShipping = (subtotal) => {
    return 0;
  };

  const subtotal = getSubtotal() || 0;
  const shipping = calculateShipping(subtotal) || 0;
  const total = subtotal + shipping;

  // Empty cart screen
  if (items?.length === 0) {
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
                  href="/en/products"
                  className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm font-semibold flex items-center gap-2 justify-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Browse Products
                </Link>
                <Link
                  href="/en/products"
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-semibold"
                >
                  Top Picks
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </>
    );
  }

  // Cart with items
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
              <p className="text-sm text-slate-600">{items?.length} items</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2">
              <AnimatePresence>
                {items?.map((item, index) => {
                  const originalPricePerItem = Math.round(item?.price / ((100 - (item?.discount || 0)) / 100));
                  const discountAmountPerItem = originalPricePerItem - Math.round(item?.price);
                  const totalOriginalPrice = originalPricePerItem * item?.quantity;
                  const totalDiscountAmount = discountAmountPerItem * item?.quantity;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all p-6 mb-4 last:mb-0 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-slate-50 shadow-sm group-hover:shadow-md transition-all">
                          <Image
                            src={item?.image}
                            alt={item?.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm text-slate-900 pr-2 line-clamp-2 leading-tight uppercase">
                              {item?.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item?.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg hover:text-red-600 transition-all -m-1.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 capitalize mb-3">{item?.category}-{item?.subCategory}</p>

                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-slate-900 tracking-tight">
                                  ₹{Math.round(item?.price * item?.quantity).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-base font-semibold text-slate-500 line-through">
                                    ₹{totalOriginalPrice.toLocaleString()}
                                  </span>
                                  <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-1 rounded-full font-bold shadow-md">
                                    Save ₹{totalDiscountAmount.toLocaleString()}
                                  </span>
                                </div>

                                <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                                  ₹{Math.round(item?.price).toLocaleString()} x {item?.quantity}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center bg-slate-100 rounded-lg p-1 ml-4">
                              <button
                                onClick={() => decreaseById(item?.id)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                                disabled={item?.quantity <= 1}
                              >
                                <Minus className="w-4 h-4 text-slate-600" />
                              </button>
                              <span className="w-10 text-center font-mono text-base font-bold px-2">
                                {item?.quantity}
                              </span>
                              <button
                                onClick={() => increaseById(item?.id)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                              >
                                <Plus className="w-4 h-4 text-slate-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
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
                    <span>Subtotal ({items?.length} items)</span>
                    <span>₹{Math.round(subtotal || 0).toLocaleString()}</span>
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
                  <p className="text-xs text-slate-500 text-right">Exclusive of all taxes</p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/en/checkout"
                    className="w-full block bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-px transition-all text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <CreditCard className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/en/products"
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
