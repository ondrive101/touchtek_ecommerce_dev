'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Gift, Clock, Package, Truck, MessageCircle,
  LogIn, Lock, Award, AlertCircle, X, Search, Archive
} from 'lucide-react';

const alertTypes = {
  announcement: { icon: Megaphone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  flashSale: { icon: Gift, color: 'text-orange-600', bg: 'bg-orange-50' },
  limitedTime: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  orderDelivered: { icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
  orderShipped: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
  supportReply: { icon: MessageCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  loginActivity: { icon: LogIn, color: 'text-gray-600', bg: 'bg-gray-50' },
  passwordChanged: { icon: Lock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  paymentSuccess: { icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  warning: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
};

const alerts = [
  // Announcements (Public)
  { id: 'ann-1', type: 'flashSale', title: '🔥 FLASH SALE: 50% OFF Everything!', content: 'Next 6 hours only!', date: '01-03-2026', time: '11:25 PM', isPublic: true },
  { id: 'ann-2', type: 'limitedTime', title: '⏰ Tech Week Ends Tonight!', content: '40% off electronics!', date: '28-02-2026', time: '09:15 AM', isPublic: true },
  { id: 'ann-3', type: 'announcement', title: '✨ Live Chat Support Now Live!', content: 'Chat instantly 24/7!', date: '01-03-2026', time: '10:30 AM', isPublic: true },

  // Personal Alerts
  { id: 'alert-1', type: 'orderDelivered', title: 'Order #ORD-20250301 Delivered', content: 'Earbuds delivered!', date: '01-03-2026', time: '11:20 PM', isPublic: false },
  { id: 'alert-2', type: 'orderShipped', title: 'Order #ORD-20250218 Shipped', content: 'PowerBank tracking: TRK9823741', date: '01-03-2026', time: '08:45 PM', isPublic: false },
  { id: 'alert-3', type: 'supportReply', title: 'Ticket #TKT-1042381 Replied', content: 'Support responded!', date: '28-02-2026', time: '04:32 PM', isPublic: false },
  { id: 'alert-4', type: 'paymentSuccess', title: '₹2,499 Payment Successful', content: 'ORD-20250301 via UPI', date: '01-03-2026', time: '10:15 AM', isPublic: false },
  { id: 'alert-5', type: 'loginActivity', title: 'New Login from Delhi', content: 'iPhone 15 • 11:24 PM', date: '01-03-2026', time: '11:24 PM', isPublic: false },
];

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [hiddenIds, setHiddenIds] = useState([]);

  const filtered = alerts
    .filter(a => !hiddenIds.includes(a.id))
    .filter(a => {
      const matchFilter = activeFilter === 'all' || 
        (activeFilter === 'announcements' ? a.isPublic : !a.isPublic);
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

  const hideAlert = (id) => setHiddenIds(prev => [...prev, id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-5">
            <Megaphone className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-600">Dashboard</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold text-gray-900">Alerts</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Alerts & Announcements</h1>
          <p className="text-sm text-gray-500">3 public • 5 personal</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search alerts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-indigo-400 rounded-xl text-sm focus:ring-1 focus:ring-indigo-400/20"
            />
          </div>

          {/* Filters - ONLY 2 main + counts */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'thin' }}>
            <style jsx>{`
              .thin-scroll::-webkit-scrollbar { height: 3px; }
              .thin-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
              .thin-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
              .thin-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('all')}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all thin-scroll ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                8
              </span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('announcements')}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all thin-scroll ${
                activeFilter === 'announcements'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Announcements
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeFilter === 'announcements' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                3
              </span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('alerts')}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all thin-scroll ${
                activeFilter === 'alerts'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Alerts
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeFilter === 'alerts' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                5
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* List - CLEAN no badges */}
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
              <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Alerts</h3>
              <p className="text-sm text-gray-500">Try different filters</p>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {filtered.map((alert, i) => {
                const TypeIcon = alertTypes[alert.type]?.icon || Megaphone;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white rounded-2xl shadow-lg border-gray-100 hover:shadow-xl hover:border-gray-200 p-6 transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${alertTypes[alert.type]?.bg || 'bg-gray-50'} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <TypeIcon className={`w-6 h-6 ${alertTypes[alert.type]?.color || 'text-gray-600'}`} />
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{alert.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{alert.content}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{alert.time} • {alert.date}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="p-2 ml-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
                        onClick={() => hideAlert(alert.id)}
                      >
                        <Archive className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
