'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, MapPin, Ticket, User, Wallet, TrendingUp,
  CheckCircle, Truck, Clock, XCircle, RotateCcw,
  Star, ArrowRight, Sparkles, Shield, Bell,
  ChevronRight, ShoppingBag, Heart, Gift,
  AlertCircle, Navigation, Phone, Calendar,
  MessageCircle, Plus, Settings
} from 'lucide-react';
import Link from 'next/link';

// ── STATIC DATA ──────────────────────────────────────────────────────────────

const profile = {
  username: 'vishal_singh',
  email: 'vishal@example.com',
  phone: '+91 98765 43210',
  avatar: null,
  memberSince: 'April 2024',
  totalOrders: 5,
  totalSpent: 14195,
  rewardPoints: 340,
};

const recentOrders = [
  { id: 'ORD-20250301', date: '01 Mar 2025', status: 'delivered', total: 2499, item: 'Diamond Pro Wireless Earbuds', image: '🎧' },
  { id: 'ORD-20250218', date: '18 Feb 2025', status: 'shipped',   total: 3999, item: 'PowerBank 20000mAh Ultra',    image: '🔋' },
  { id: 'ORD-20250110', date: '10 Jan 2025', status: 'processing',total: 1299, item: 'Bluetooth Speaker Mini',      image: '🔊' },
  { id: 'ORD-20241215', date: '15 Dec 2024', status: 'cancelled', total: 899,  item: 'Phone Stand Adjustable',     image: '📱' },
  { id: 'ORD-20241105', date: '05 Nov 2024', status: 'returned',  total: 5499, item: 'Smart Watch Series X',       image: '⌚' },
];

const statusConfig = {
  delivered:  { label: 'Delivered',  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500',  icon: CheckCircle },
  shipped:    { label: 'Shipped',    color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500',   icon: Truck },
  processing: { label: 'Processing', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500', icon: Clock },
  cancelled:  { label: 'Cancelled',  color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-400',    icon: XCircle },
  returned:   { label: 'Returned',   color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-400', icon: RotateCcw },
};

const activeTickets = [
  { id: 'TKT-1042381', subject: 'Order not delivered after 10 days', status: 'inprogress', priority: 'high', lastReply: '2 hours ago', unread: 2 },
  { id: 'TKT-1025560', subject: 'Package arrived damaged',           status: 'resolved',   priority: 'low',  lastReply: '1 month ago', unread: 1 },
];

const savedAddresses = [
  { tag: 'Home', icon: '🏠', line: '42, Sector 15, Rohini', city: 'New Delhi — 110085', isDefault: true },
  { tag: 'Work', icon: '💼', line: 'Plot 7, Cyber City, DLF Phase 2', city: 'Gurugram — 122002', isDefault: false },
];

const quickActions = [
  { label: 'My Orders',     icon: Package,        href: '/orders',   color: 'from-blue-500 to-blue-600',    light: 'bg-blue-50 text-blue-700',   desc: '5 orders placed' },
  { label: 'Addresses',     icon: MapPin,         href: '/address',  color: 'from-green-500 to-green-600',  light: 'bg-green-50 text-green-700', desc: '2 locations saved' },
  { label: 'Support',       icon: Ticket,         href: '/support',  color: 'from-purple-500 to-purple-600',light: 'bg-purple-50 text-purple-700',desc: '1 active ticket' },
  { label: 'Change Password',icon: Shield,        href: '/password', color: 'from-orange-500 to-orange-600',light: 'bg-orange-50 text-orange-700',desc: 'Last changed: Never' },
  { label: 'Profile',       icon: Settings,       href: '/profile',  color: 'from-gray-700 to-gray-900',    light: 'bg-gray-100 text-gray-700',  desc: 'Edit your info' },
  { label: 'Shop Now',      icon: ShoppingBag,    href: '/shop',     color: 'from-rose-500 to-rose-600',    light: 'bg-rose-50 text-rose-700',   desc: 'Browse products' },
];

const ticketStatusConfig = {
  open:       { label: 'Open',        color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  inprogress: { label: 'In Progress', color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  resolved:   { label: 'Resolved',    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
  closed:     { label: 'Closed',      color: 'text-gray-500',   bg: 'bg-gray-50',   border: 'border-gray-200',   dot: 'bg-gray-400' },
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex items-center gap-4 hover:shadow-xl transition-shadow"
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  });

  const orderStats = {
    delivered:  recentOrders.filter(o => o.status === 'delivered').length,
    shipped:    recentOrders.filter(o => o.status === 'shipped').length,
    processing: recentOrders.filter(o => o.status === 'processing').length,
    cancelled:  recentOrders.filter(o => o.status === 'cancelled').length,
    returned:   recentOrders.filter(o => o.status === 'returned').length,
  };

  const totalUnread = activeTickets.reduce((s, t) => s + t.unread, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* ── HERO HEADER ── */}
      <section
        className="relative overflow-hidden text-white pt-14 pb-28"
        style={{ background: 'linear-gradient(135deg, #111827 0%, #000000 50%, #1f2937 100%)' }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 0%, #6366f1 0%, transparent 55%)' }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            {/* Left: greeting */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-medium">Customer Dashboard</span>
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                {greeting},{' '}
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Vishal
                </span>
              </h1>
              <p className="text-gray-400 text-sm">
                Member since {profile.memberSince} · Here's your account overview
              </p>
            </div>

            {/* Right: avatar block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">V</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{profile.username}</p>
                <p className="text-xs text-gray-400">{profile.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400 font-semibold">Active Account</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-20 relative z-10 space-y-6">

        {/* ── STAT CARDS ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={profile.totalOrders}
            sub="All time"
            gradient="from-blue-500 to-blue-700"
            delay={0.1}
          />
          <StatCard
            icon={Wallet}
            label="Total Spent"
            value={`₹${profile.totalSpent.toLocaleString()}`}
            sub="Across all orders"
            gradient="from-gray-800 to-black"
            delay={0.15}
          />
          <StatCard
            icon={Star}
            label="Reward Points"
            value={profile.rewardPoints}
            sub="Worth ₹340"
            gradient="from-yellow-400 to-orange-500"
            delay={0.2}
          />
          <StatCard
            icon={Ticket}
            label="Open Tickets"
            value={totalUnread}
            sub={`${activeTickets.length} tickets total`}
            gradient="from-purple-500 to-purple-700"
            delay={0.25}
          />
        </div>

        {/* ── ORDER STATUS STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" /> Order Status Overview
            </h2>
            <Link href="/orders" className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(orderStats).map(([status, count]) => {
              const cfg = statusConfig[status];
              const Icon = cfg.icon;
              return (
                <div key={status} className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border} flex flex-col items-center gap-1.5`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                  <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
                  <p className="text-xs font-semibold text-gray-600 text-center">{cfg.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── TWO COLUMN: Recent Orders + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Orders — takes 2/3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-500" /> Recent Orders
              </h2>
              <Link href="/orders" className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                All Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {recentOrders.map((order, i) => {
                const cfg = statusConfig[order.status];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Emoji icon */}
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {order.image}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{order.item}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs font-mono text-gray-400">{order.id}</p>
                        <span className="text-gray-200">·</span>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ₹{order.total.toLocaleString()}
                    </p>

                    {/* Status badge */}
                    <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions — takes 1/3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" /> Quick Actions
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                  >
                    <Link
                      href={action.href}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group text-center"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-gray-800 leading-tight">{action.label}</p>
                      <p className="text-[10px] text-gray-400 leading-tight">{action.desc}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── THREE COLUMN: Addresses + Tickets + Spending Highlights ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Saved Addresses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" /> Saved Addresses
              </h2>
              <Link href="/address" className="text-xs font-semibold text-gray-400 hover:text-black transition-colors">
                Manage
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {savedAddresses.map((addr, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${addr.isDefault ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
                  <span className="text-xl mt-0.5">{addr.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold text-gray-900">{addr.tag}</p>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{addr.line}</p>
                    <p className="text-xs text-gray-400">{addr.city}</p>
                  </div>
                </div>
              ))}
         <Link
  href="/address"
  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-black hover:bg-gray-50 transition-all border border-gray-100"
>
  Manage All Addresses <ChevronRight className="w-3.5 h-3.5" />
</Link>
            </div>
          </motion.div>

          {/* Active Support Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-purple-500" /> Support Tickets
                {totalUnread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalUnread}
                  </span>
                )}
              </h2>
              <Link href="/support" className="text-xs font-semibold text-gray-400 hover:text-black transition-colors">
                View All
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {activeTickets.map((ticket, i) => {
                const cfg = ticketStatusConfig[ticket.status];
                return (
                  <div key={i} className={`p-3 rounded-xl border ${cfg.bg} ${cfg.border} relative`}>
                    {ticket.unread > 0 && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                        {ticket.unread}
                      </span>
                    )}
                    <p className="text-xs font-bold text-gray-900 pr-6 leading-snug mb-1.5">{ticket.subject}</p>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-gray-400">{ticket.lastReply}</span>
                    </div>
                  </div>
                );
              })}
             <Link
  href="/support"
  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-black hover:bg-gray-50 transition-all border border-gray-100"
>
  View All Tickets <ChevronRight className="w-3.5 h-3.5" />
</Link>
            </div>
          </motion.div>

          {/* Spending Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Spending Highlights
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Electronics',  amount: 7498, pct: 53, color: 'bg-gray-900' },
                { label: 'Wearables',    amount: 5499, pct: 39, color: 'bg-gray-600' },
                { label: 'Accessories',  amount: 2699, pct: 19, color: 'bg-gray-400' },
                { label: 'Home & Misc',  amount: 899,  pct: 6,  color: 'bg-gray-200' },
              ].map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{cat.label}</span>
                    <span className="text-xs font-bold text-gray-900">₹{cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ delay: 0.65 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Total Spent</span>
                <span className="text-base font-bold text-gray-900">₹{profile.totalSpent.toLocaleString()}</span>
              </div>

              {/* Reward Points Banner */}
              <div className="mt-1 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">{profile.rewardPoints} Points Earned</p>
                  <p className="text-[10px] text-gray-500">Redeem on your next order</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── ACCOUNT SECURITY BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-gradient-to-r from-gray-900 via-black to-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Secure Your Account</p>
              <p className="text-xs text-gray-400 mt-0.5">
                You have <span className="text-yellow-400 font-semibold">3 active sessions</span>. Last password change: <span className="text-gray-300">Never</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/password"
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all shadow-md"
            >
              <Shield className="w-3.5 h-3.5" /> Change Password
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
            >
              <Settings className="w-3.5 h-3.5" /> Manage Sessions
            </Link>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
