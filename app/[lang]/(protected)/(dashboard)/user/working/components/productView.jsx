'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Star, TrendingUp, ShoppingCart, Eye,
  Edit3, Trash2, Copy, Archive, RotateCcw, Box,
  Tag, Layers, List, Info, Plus, Check,
  ChevronRight, Package
} from 'lucide-react';
import Link from 'next/link';
import SpecModal  from '../model/Specification';
import AboutModal from '../model/About';

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const product = {
  id: 'PRD-00142',
  name: 'Diamond Pro Wireless Earbuds',
  category: 'Electronics',
  subCategory: 'Audio',
  brand: 'TechNova',
  sku: 'SKU-EP-001',
  description: 'Premium wireless earbuds with active noise cancellation, 30hr battery life, and IPX5 water resistance.',
  tags: ['wireless', 'earbuds', 'anc', 'bluetooth', 'audio'],
  createdAt: '12 Apr 2024',
  updatedAt: '28 Feb 2025',
  rating: 4.3,
  totalReviews: 128,
  totalOrders: 342,
  totalRevenue: 685458,
  totalViews: 12840,
  returnRate: 3.2,

  variants: [
    { id: 'VAR-001', name: 'Midnight Black', color: '#1a1a1a', price: 1999, mrp: 2499, stock: 48, sku: 'SKU-EP-001-BK', status: 'active',       image: '🎧' },
    { id: 'VAR-002', name: 'Pearl White',    color: '#d4d4d4', price: 1999, mrp: 2499, stock: 32, sku: 'SKU-EP-001-WH', status: 'active',       image: '🎧' },
    { id: 'VAR-003', name: 'Navy Blue',      color: '#1e3a5f', price: 1999, mrp: 2499, stock: 5,  sku: 'SKU-EP-001-NB', status: 'low_stock',    image: '🎧' },
    { id: 'VAR-004', name: 'Rose Gold',      color: '#b76e79', price: 2199, mrp: 2699, stock: 0,  sku: 'SKU-EP-001-RG', status: 'out_of_stock', image: '🎧' },
    { id: 'VAR-005', name: 'Forest Green',   color: '#2d6a4f', price: 1999, mrp: 2499, stock: 21, sku: 'SKU-EP-001-FG', status: 'active',       image: '🎧' },
  ],

  currentVariant: 'VAR-003',

  specifications: [
    { key: 'Driver Size',        value: '10mm Dynamic' },
    { key: 'Frequency Response', value: '20Hz – 20kHz' },
    { key: 'Battery Life',       value: '8hrs (30hrs with case)' },
    { key: 'Charging',           value: 'USB-C, 10min = 1hr' },
    { key: 'Connectivity',       value: 'Bluetooth 5.3' },
    { key: 'Water Resistance',   value: 'IPX5' },
    { key: 'Weight',             value: '5.6g per earbud' },
    { key: 'Warranty',           value: '1 Year' },
  ],

  about: [
    'Active Noise Cancellation with 3 microphones per earbud',
    '30-hour total battery life including charging case',
    'IPX5 water and sweat resistance for workouts',
    'Bluetooth 5.3 with 10m stable range',
    'Touch controls with customizable gestures',
    'Adaptive EQ that tunes to your ear shape',
    'USB-C fast charging — 10 min = 1 hour playtime',
  ],

  monthlyStats: [
    { month: 'Oct', orders: 28, revenue: 55972 },
    { month: 'Nov', orders: 41, revenue: 81959 },
    { month: 'Dec', orders: 67, revenue: 133933 },
    { month: 'Jan', orders: 52, revenue: 103948 },
    { month: 'Feb', orders: 38, revenue: 75962 },
    { month: 'Mar', orders: 22, revenue: 43978 },
  ],
};

// ── VARIANT STATUS CONFIG ─────────────────────────────────────────────────────
const variantStatus = {
  active:        { label: 'Active',        bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  low_stock:     { label: 'Low Stock',     bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  out_of_stock:  { label: 'Out of Stock',  bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    dot: 'bg-red-400' },
  inactive:      { label: 'Inactive',      bg: 'bg-gray-100',  text: 'text-gray-500',   border: 'border-gray-200',   dot: 'bg-gray-400' },
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

// ── REVENUE BAR CHART ─────────────────────────────────────────────────────────
function RevenueChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <p className="text-[9px] font-bold text-gray-500">₹{(d.revenue / 1000).toFixed(0)}K</p>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.revenue / max) * 100}%` }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
            className="w-full rounded-t-xl bg-gradient-to-t from-gray-900 to-gray-600 hover:from-indigo-600 hover:to-indigo-400 transition-colors cursor-default shadow-sm"
            title={`${d.month}: ₹${d.revenue.toLocaleString()}`}
          />
          <p className="text-[10px] text-gray-400 font-medium">{d.month}</p>
          <p className="text-[9px] text-gray-400">{d.orders} orders</p>
        </div>
      ))}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ProductDashboardPage() {
  const [specs,        setSpecs]        = useState(product.specifications);
  const [about,        setAbout]        = useState(product.about);
  const [activeVariant,setActiveVariant]= useState(
    product.variants.find(v => v.id === product.currentVariant)
  );
  const [showSpecModal,  setShowSpecModal]  = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const vst           = variantStatus[activeVariant.status];
  const otherVariants = product.variants.filter(v => v.id !== activeVariant.id);
  const discount      = Math.round((1 - activeVariant.price / activeVariant.mrp) * 100);
  const maxRevMonth   = Math.max(...product.monthlyStats.map(m => m.revenue));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* ── HERO HEADER ── */}
      <section
        className="relative overflow-hidden text-white pt-14 pb-28"
        style={{ background: 'linear-gradient(135deg, #111827 0%, #000000 50%, #1f2937 100%)' }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 0%, #818cf8 0%, transparent 55%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/admin/products"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-400 text-xs truncate max-w-[160px]">{product.name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-white text-xs font-bold">{activeVariant.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">

            {/* Left — Product Identity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-5"
            >
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 shadow-xl">
                {activeVariant.image}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-bold bg-white/10 border border-white/20 px-2 py-0.5 rounded-full text-gray-300">
                    {product.category} · {product.subCategory}
                  </span>
                  <span className="text-[10px] font-bold bg-white/10 border border-white/20 px-2 py-0.5 rounded-full text-gray-300 font-mono">
                    {product.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${vst.bg} ${vst.text} ${vst.border}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${vst.dot} mr-1`} />
                    {vst.label}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{product.name}</h1>
                <p className="text-gray-400 text-sm mb-2 max-w-xl">{product.description}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                    ))}
                    <span className="text-xs text-gray-300 ml-1">{product.rating} ({product.totalReviews} reviews)</span>
                  </div>
                  <span className="text-gray-600">·</span>
                  <span className="text-xs text-gray-400">Brand: <span className="text-white font-semibold">{product.brand}</span></span>
                  <span className="text-gray-600">·</span>
                  <span className="text-xs text-gray-400">Updated: <span className="text-gray-300">{product.updatedAt}</span></span>
                </div>
              </div>
            </motion.div>

            {/* Right — Action Buttons */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="flex items-center gap-2 flex-wrap flex-shrink-0"
            >
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all">
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all">
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
              <button className="flex items-center gap-2 bg-white text-black px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all">
                <Edit3 className="w-3.5 h-3.5" /> Edit Product
              </button>
              <button className="w-9 h-9 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-400 rounded-xl flex items-center justify-center transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-20 relative z-10 space-y-6">

        {/* ── VARIANT CARD ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Current Variant Info Row */}
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Variant color preview */}
              <div className="w-14 h-14 rounded-2xl border-4 border-gray-100 flex items-center justify-center text-3xl shadow-inner"
                style={{ backgroundColor: activeVariant.color + '22' }}>
                {activeVariant.image}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-bold text-gray-900">
                    Viewing: <span className="text-indigo-600">{activeVariant.name}</span>
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${vst.bg} ${vst.text} ${vst.border}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${vst.dot} mr-1`} />
                    {vst.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs text-gray-400 font-mono">{activeVariant.sku}</p>
                  <span className="text-gray-300">·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: activeVariant.color }} />
                    <span className="text-xs text-gray-600">{activeVariant.name}</span>
                  </div>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-bold text-gray-900">₹{activeVariant.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">₹{activeVariant.mrp.toLocaleString()}</span>
                  <span className="text-xs font-bold text-green-600">{discount}% off</span>
                  <span className="text-gray-300">·</span>
                  <span className={`text-xs font-bold ${
                    activeVariant.stock === 0 ? 'text-red-500' :
                    activeVariant.stock <= 10 ? 'text-yellow-600' : 'text-gray-700'
                  }`}>
                    {activeVariant.stock === 0 ? 'Out of stock' : `${activeVariant.stock} in stock`}
                  </span>
                </div>
              </div>
            </div>

            {/* Other variants switcher */}
            <div className="flex-shrink-0">
              <p className="text-[10px] text-gray-400 font-semibold mb-1.5 text-right">
                {otherVariants.length} other variant{otherVariants.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-1.5">
                {otherVariants.map(v => (
                  <button key={v.id} onClick={() => setActiveVariant(v)} title={v.name}
                    className="w-7 h-7 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform relative"
                    style={{ backgroundColor: v.color }}
                  >
                    {v.status === 'out_of_stock' && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border border-white" />
                    )}
                    {v.status === 'low_stock' && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full border border-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* All Variants Strip */}
          <div className="border-t border-gray-50 px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {product.variants.map(v => {
              const vs = variantStatus[v.status];
              const isActive = v.id === activeVariant.id;
              return (
                <button key={v.id} onClick={() => setActiveVariant(v)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-gray-900 bg-gray-50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: v.color }} />
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900 whitespace-nowrap">{v.name}</p>
                    <p className={`text-[10px] font-semibold ${vs.text}`}>
                      {v.stock === 0 ? 'OOS' : `${v.stock} left`}
                    </p>
                  </div>
                  {isActive && <Check className="w-3 h-3 text-gray-900 ml-1" />}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={TrendingUp}   label="Total Revenue"         value={`₹${(product.totalRevenue / 1000).toFixed(0)}K`}      sub={`₹${product.totalRevenue.toLocaleString()} lifetime`}  gradient="from-indigo-500 to-indigo-700" delay={0.1} />
          <StatCard icon={ShoppingCart} label="Total Orders"          value={product.totalOrders}                                    sub="All variants combined"                                  gradient="from-gray-800 to-black"        delay={0.15} />
          <StatCard icon={Eye}          label="Product Views"         value={`${(product.totalViews / 1000).toFixed(1)}K`}          sub="All time page views"                                    gradient="from-blue-500 to-blue-700"     delay={0.2} />
          <StatCard icon={RotateCcw}    label="Return Rate"           value={`${product.returnRate}%`}                               sub="Across all variants"                                    gradient="from-pink-500 to-pink-700"     delay={0.25} />
          <StatCard
            icon={Box}
            label="Variant Stock"
            value={activeVariant.stock}
            sub={activeVariant.name}
            gradient={activeVariant.stock === 0 ? 'from-red-500 to-red-700' : activeVariant.stock <= 10 ? 'from-yellow-400 to-orange-500' : 'from-green-500 to-green-700'}
            delay={0.3}
          />
          <StatCard icon={Tag}    label="Selling Price"    value={`₹${activeVariant.price.toLocaleString()}`}  sub={`MRP ₹${activeVariant.mrp.toLocaleString()}`}  gradient="from-gray-700 to-gray-900"     delay={0.35} />
          <StatCard icon={Star}   label="Avg Rating"       value={product.rating}                               sub={`${product.totalReviews} reviews`}              gradient="from-yellow-400 to-orange-500" delay={0.4} />
          <StatCard icon={Layers} label="Total Variants"   value={product.variants.length}                      sub={`${product.variants.filter(v => v.status === 'active').length} active`} gradient="from-purple-500 to-purple-700" delay={0.45} />
        </div>

        {/* ── REVENUE CHART + VARIANT STOCK SIDE BY SIDE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Monthly Revenue</h3>
                <p className="text-xs text-gray-500 mt-0.5">Last 6 months · All variants</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  ₹{product.monthlyStats.reduce((s, m) => s + m.revenue, 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-green-600 font-semibold">6-month total</p>
              </div>
            </div>
            <RevenueChart data={product.monthlyStats} />
          </motion.div>

          {/* Variant Stock */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Variant Stock</h3>
              <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg font-semibold">
                {product.variants.reduce((s, v) => s + v.stock, 0)} total
              </span>
            </div>
            <div className="space-y-3">
              {product.variants.map(v => {
                const vs = variantStatus[v.status];
                const maxStock = Math.max(...product.variants.map(v => v.stock), 1);
                return (
                  <div key={v.id}
                    onClick={() => setActiveVariant(v)}
                    className={`cursor-pointer rounded-xl p-3 border-2 transition-all ${
                      activeVariant.id === v.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: v.color }} />
                        <span className="text-xs font-bold text-gray-800">{v.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${vs.bg} ${vs.text}`}>
                        {v.stock === 0 ? 'OOS' : v.stock}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(v.stock / maxStock) * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          v.stock === 0 ? 'bg-red-400' :
                          v.stock <= 10 ? 'bg-yellow-400' : 'bg-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── SPECIFICATIONS + ABOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Specifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
                  <List className="w-3.5 h-3.5 text-white" />
                </div>
                Specifications
                <span className="text-[10px] text-gray-400 font-normal bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {specs.length} fields
                </span>
              </h3>
              <button
                onClick={() => setShowSpecModal(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-0 divide-y divide-gray-50">
              {specs.map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.04 }}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-xs text-gray-500 font-medium">{spec.key}</span>
                  <span className="text-xs font-bold text-gray-900 text-right max-w-[55%] bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    {spec.value}
                  </span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setShowSpecModal(true)}
              className="w-full mt-4 py-2.5 border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Specification
            </button>
          </motion.div>

          {/* About */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
                About this Product
                <span className="text-[10px] text-gray-400 font-normal bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {about.length} points
                </span>
              </h3>
              <button
                onClick={() => setShowAboutModal(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>

            <ul className="space-y-2.5">
              {about.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="w-5 h-5 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
                    {i + 1}
                  </span>
                  <span className="text-xs text-gray-600 leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>

            <button
              onClick={() => setShowAboutModal(true)}
              className="w-full mt-4 py-2.5 border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Point
            </button>
          </motion.div>
        </div>

        {/* ── PRODUCT META ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
        >
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <Tag className="w-3.5 h-3.5 text-white" />
            </div>
            Product Meta
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Product ID',   value: product.id },
              { label: 'Brand',        value: product.brand },
              { label: 'Category',     value: `${product.category} › ${product.subCategory}` },
              { label: 'Created',      value: product.createdAt },
              { label: 'Last Updated', value: product.updatedAt },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-xs font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 cursor-default transition-colors">
                  #{tag}
                </span>
              ))}
              <button className="text-[10px] font-bold text-gray-400 hover:text-black px-2.5 py-1 rounded-full border border-dashed border-gray-300 hover:border-gray-500 transition-colors flex items-center gap-1">
                <Plus className="w-2.5 h-2.5" /> Add tag
              </button>
            </div>
          </div>
        </motion.div>

      </main>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showSpecModal && (
          <SpecModal
            specs={specs}
            onClose={() => setShowSpecModal(false)}
            onSave={newSpecs => { setSpecs(newSpecs); setShowSpecModal(false); }}
          />
        )}
        {showAboutModal && (
          <AboutModal
            about={about}
            onClose={() => setShowAboutModal(false)}
            onSave={newAbout => { setAbout(newAbout); setShowAboutModal(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
