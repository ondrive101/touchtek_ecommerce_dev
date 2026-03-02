'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ChevronDown, Search, CheckCircle, Clock,
  Truck, XCircle, RotateCcw, Star, Download, MessageCircle,
  MapPin, Calendar, ShoppingBag, ArrowRight,
  RefreshCw, Filter, Tag, Coins, FileText, Navigation
} from 'lucide-react';

import TrackOrderDialog  from '../model/TrackOrder';
import CancelOrderDialog from '../model/CancelOrder';
import ReturnOrderDialog from '../model/ReturnOrder';

const statusConfig = {
  delivered:  { label: 'Delivered',  icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
  shipped:    { label: 'Shipped',    icon: Truck,       color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  processing: { label: 'Processing', icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,     color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-400' },
  returned:   { label: 'Returned',   icon: RotateCcw,   color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-400' },
};

const orders = [
  {
    id: 'ORD-20250301', date: '01 Mar 2025', month: 'Mar', year: '2025',
    status: 'delivered', total: 2499, subtotal: 2200, gst: 299, couponDiscount: 150, rewardDiscount: 50,
    paymentMethod: 'UPI', deliveredOn: '04 Mar 2025',
    address: '42, Sector 15, Rohini, New Delhi — 110085',
    items: [
      { name: 'Diamond Pro Wireless Earbuds', qty: 1, price: 1999, image: '🎧' },
      { name: 'Type-C Charging Cable',        qty: 2, price: 250,  image: '🔌' },
    ],
  },
  {
    id: 'ORD-20250218', date: '18 Feb 2025', month: 'Feb', year: '2025',
    status: 'shipped', total: 3999, subtotal: 3600, gst: 399, couponDiscount: 0, rewardDiscount: 0,
    paymentMethod: 'Credit Card', estimatedDelivery: '22 Feb 2025',
    address: 'Plot 7, Cyber City, DLF Phase 2, Gurugram — 122002',
    trackingId: 'TRK9823741',
    items: [{ name: 'PowerBank 20000mAh Ultra', qty: 1, price: 3999, image: '🔋' }],
  },
  {
    id: 'ORD-20250110', date: '10 Jan 2025', month: 'Jan', year: '2025',
    status: 'processing', total: 1299, subtotal: 1150, gst: 149, couponDiscount: 0, rewardDiscount: 0,
    paymentMethod: 'Net Banking',
    address: '42, Sector 15, Rohini, New Delhi — 110085',
    items: [{ name: 'Bluetooth Speaker Mini', qty: 1, price: 1299, image: '🔊' }],
  },
  {
    id: 'ORD-20241215', date: '15 Dec 2024', month: 'Dec', year: '2024',
    status: 'cancelled', total: 899, subtotal: 800, gst: 99, couponDiscount: 0, rewardDiscount: 0,
    paymentMethod: 'COD', cancelReason: 'Cancelled by customer',
    address: '42, Sector 15, Rohini, New Delhi — 110085',
    items: [
      { name: 'Phone Stand Adjustable', qty: 1, price: 599, image: '📱' },
      { name: 'Screen Cleaning Kit',    qty: 1, price: 300, image: '🧹' },
    ],
  },
  {
    id: 'ORD-20241105', date: '05 Nov 2024', month: 'Nov', year: '2024',
    status: 'returned', total: 5499, subtotal: 4999, gst: 500, couponDiscount: 200, rewardDiscount: 100,
    paymentMethod: 'Debit Card', returnReason: 'Product defective', refundStatus: 'Refund Processed',
    address: '42, Sector 15, Rohini, New Delhi — 110085',
    items: [{ name: 'Smart Watch Series X', qty: 1, price: 5499, image: '⌚' }],
  },
];

const filterTabs  = [
  { key: 'all', label: 'All Orders' },
  { key: 'delivered',  label: 'Delivered' },
  { key: 'shipped',    label: 'Shipped' },
  { key: 'processing', label: 'Processing' },
  { key: 'cancelled',  label: 'Cancelled' },
  { key: 'returned',   label: 'Returned' },
];
const months = ['All Months','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const years  = ['All Years','2025','2024','2023'];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter]   = useState('all');
  const [search, setSearch]               = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [selectedYear, setSelectedYear]   = useState('All Years');
  const [expandedId, setExpandedId]       = useState(null);
  const [ratingMap, setRatingMap]         = useState({});
  const [trackOrder, setTrackOrder]       = useState(null);
  const [cancelOrder, setCancelOrder]     = useState(null);
  const [returnOrder, setReturnOrder]     = useState(null);

  const filtered = orders.filter(o => {
    const matchFilter = activeFilter === 'all' || o.status === activeFilter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchMonth = selectedMonth === 'All Months' || o.month === selectedMonth;
    const matchYear  = selectedYear  === 'All Years'  || o.year  === selectedYear;
    return matchFilter && matchSearch && matchMonth && matchYear;
  });

  const toggleExpand = id => setExpandedId(p => p === id ? null : id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Header */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-5">
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-600">My Account</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold text-gray-900">Order History</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">My Orders</h1>
          <p className="text-sm text-gray-500">{orders.length} orders placed · Track, return or reorder</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 space-y-5">

        {/* Filters card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 space-y-4">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID or product name..."
              className="w-full pl-9 pr-9 py-2.5 border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Month + Year */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border-2 border-gray-200 focus:border-black rounded-xl text-sm outline-none text-gray-900 appearance-none bg-white">
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border-2 border-gray-200 focus:border-black rounded-xl text-sm outline-none text-gray-900 appearance-none bg-white">
                {years.map(y => <option key={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map(tab => {
              const count = tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length;
              return (
                <motion.button key={tab.key} whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                    activeFilter === tab.key ? 'bg-black border-black text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{count}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Orders */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-14 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
                {search ? `No orders matched "${search}".` : 'No orders in this filter.'}
              </p>
              <a href="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg">
                <ShoppingBag className="w-4 h-4" /> Start Shopping <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {filtered.map((order, i) => {
                const status = statusConfig[order.status];
                const isExpanded = expandedId === order.id;

                return (
                  <motion.div key={order.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="p-5 cursor-pointer select-none" onClick={() => toggleExpand(order.id)}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 font-mono">{order.id}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-auto">
                          <div className="text-right">
                            <p className="text-base font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.color} ${status.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${order.status === 'processing' ? 'animate-pulse' : ''}`} />
                            {status.label}
                          </span>
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}
                            className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          </motion.div>
                        </div>
                      </div>
                      {!isExpanded && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-xs text-gray-600 font-medium">
                              {item.image} {item.name}{item.qty > 1 && <span className="text-gray-400">×{item.qty}</span>}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Expanded */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-5">

                            {/* Status Strip */}
                            {order.status === 'delivered' && (
                              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <p className="text-xs font-semibold text-green-700">Delivered on <span className="font-bold">{order.deliveredOn}</span></p>
                              </div>
                            )}
                            {order.status === 'shipped' && (
                              <div className="flex items-center justify-between gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4 text-blue-600" />
                                  <p className="text-xs font-semibold text-blue-700">Est. delivery: <span className="font-bold">{order.estimatedDelivery}</span></p>
                                </div>
                                <span className="text-xs font-mono text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded-lg">{order.trackingId}</span>
                              </div>
                            )}
                            {order.status === 'processing' && (
                              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5">
                                <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />
                                <p className="text-xs font-semibold text-yellow-700">Your order is being prepared. Tracking ID will be shared soon.</p>
                              </div>
                            )}
                            {order.status === 'cancelled' && (
                              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <p className="text-xs font-semibold text-red-600">{order.cancelReason}</p>
                              </div>
                            )}
                            {order.status === 'returned' && (
                              <div className="flex items-center justify-between gap-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <RotateCcw className="w-4 h-4 text-purple-600" />
                                  <p className="text-xs font-semibold text-purple-700">{order.returnReason}</p>
                                </div>
                                <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-lg">{order.refundStatus}</span>
                              </div>
                            )}

                            {/* Items */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Items in this order</p>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                      {item.image}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.qty} · ₹{item.price.toLocaleString()} each</p>
                                      {order.status === 'delivered' && (
                                        <div className="flex items-center gap-0.5 mt-1.5">
                                          {[1,2,3,4,5].map(star => (
                                            <motion.button key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                              onClick={() => setRatingMap(p => ({ ...p, [`${order.id}-${idx}`]: star }))}>
                                              <Star className={`w-3.5 h-3.5 transition-colors ${star <= (ratingMap[`${order.id}-${idx}`] || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            </motion.button>
                                          ))}
                                          <span className="text-xs text-gray-400 ml-1">
                                            {ratingMap[`${order.id}-${idx}`] ? 'Rated!' : 'Rate product'}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">₹{(item.price * item.qty).toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4 space-y-2">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Order Summary</p>
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-600">
                                <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-gray-400" /> GST (18%)</span>
                                <span>₹{order.gst.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>Shipping</span><span className="text-green-600 font-semibold">Free</span>
                              </div>
                              {order.couponDiscount > 0 && (
                                <div className="flex justify-between text-xs text-green-600 font-semibold">
                                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Coupon Discount</span>
                                  <span>− ₹{order.couponDiscount.toLocaleString()}</span>
                                </div>
                              )}
                              {order.rewardDiscount > 0 && (
                                <div className="flex justify-between text-xs text-yellow-600 font-semibold">
                                  <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> Reward Points</span>
                                  <span>− ₹{order.rewardDiscount.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="border-t border-gray-200 pt-2.5 flex justify-between text-sm font-bold text-gray-900">
                                <span>Total Paid</span><span>₹{order.total.toLocaleString()}</span>
                              </div>
                              <div className="flex items-start gap-1.5 pt-1">
                                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-500">{order.address}</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              {order.status === 'delivered' && (<>
                                <Btn icon={RefreshCw} label="Reorder"      className="bg-gradient-to-r from-black to-gray-800 text-white shadow-md" />
                                <Btn icon={RotateCcw} label="Return"       className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                                  onClick={() => setReturnOrder(order)} />
                                <Btn icon={Download}  label="Invoice"      className="bg-gray-100 hover:bg-gray-200 text-gray-700" />
                                <Btn icon={Navigation} label="View Journey" className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                                  onClick={() => setTrackOrder(order)} />
                              </>)}
                              {order.status === 'shipped' && (
                                <Btn icon={Truck} label="Track Order" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                  onClick={() => setTrackOrder(order)} />
                              )}
                              {order.status === 'processing' && (
                                <Btn icon={XCircle} label="Cancel Order" className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                                  onClick={() => setCancelOrder(order)} />
                              )}
                              {order.status === 'cancelled' && (
                                <Btn icon={RefreshCw} label="Reorder" className="bg-gradient-to-r from-black to-gray-800 text-white shadow-md" />
                              )}
                              <Btn icon={MessageCircle} label="Support" className="bg-gray-100 hover:bg-gray-200 text-gray-700" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Dialogs ── */}
      <AnimatePresence>
        {trackOrder  && <TrackOrderDialog  order={trackOrder}  onClose={() => setTrackOrder(null)}  />}
        {cancelOrder && <CancelOrderDialog order={cancelOrder} onClose={() => setCancelOrder(null)} />}
        {returnOrder && <ReturnOrderDialog order={returnOrder} onClose={() => setReturnOrder(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Btn({ icon: Icon, label, className = '', onClick }) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${className}`}>
      <Icon className="w-3.5 h-3.5" />{label}
    </motion.button>
  );
}
