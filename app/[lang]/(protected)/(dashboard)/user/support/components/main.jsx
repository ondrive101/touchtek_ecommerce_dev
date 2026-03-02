'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeadphonesIcon, Plus, MessageCircle, Ticket, Clock,
  CheckCircle, XCircle, AlertCircle, ChevronDown,
  ChevronRight, Search, RotateCcw, Package
} from 'lucide-react';

import CreateTicketDialog from '../model/CreateTicket';
import SupportChatBox     from '../model/SupportChatBox';

const ticketStatus = {
  open:        { label: 'Open',        icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  inprogress:  { label: 'In Progress', icon: RotateCcw,   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  resolved:    { label: 'Resolved',    icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
  closed:      { label: 'Closed',      icon: XCircle,     color: 'text-gray-500',   bg: 'bg-gray-50',   border: 'border-gray-200',   dot: 'bg-gray-400' },
};

const priorityConfig = {
  low:    { label: 'Low',    color: 'text-green-600  bg-green-50  border-green-200' },
  medium: { label: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  high:   { label: 'High',   color: 'text-red-600    bg-red-50    border-red-200' },
};

const categoryIcons = {
  order: '📦', payment: '💳', delivery: '🚚',
  product: '🛍️', account: '👤', other: '💬',
};

/* SAMPLE TICKETS – added unreadCount */
const initialTickets = [
  {
    id: 'TKT-1042381', date: '28 Feb 2025', category: 'order', priority: 'high',
    subject: 'Order not delivered after 10 days',
    desc: 'My order ORD-20250218 was supposed to be delivered on 22nd but has not arrived.',
    status: 'inprogress', orderId: 'ORD-20250218',
    messages: 3, lastReply: '2 hours ago', unreadCount: 2,
  },
  {
    id: 'TKT-1038842', date: '20 Feb 2025', category: 'payment', priority: 'high',
    subject: 'Refund not received for cancelled order',
    desc: 'I cancelled order ORD-20241215 two weeks ago but refund is still pending.',
    status: 'resolved', orderId: 'ORD-20241215',
    messages: 5, lastReply: '5 days ago', unreadCount: 0,
  },
  {
    id: 'TKT-1031129', date: '10 Jan 2025', category: 'product', priority: 'medium',
    subject: 'Product quality not as described',
    desc: 'The Bluetooth speaker sound quality is very poor compared to the description.',
    status: 'closed', orderId: 'ORD-20250110',
    messages: 2, lastReply: '15 days ago', unreadCount: 0,
  },
  {
    id: 'TKT-1025560', date: '01 Dec 2024', category: 'delivery', priority: 'low',
    subject: 'Package arrived damaged',
    desc: 'The outer packaging was torn and product had minor scratches.',
    status: 'resolved', orderId: 'ORD-20241105',
    messages: 4, lastReply: '1 month ago', unreadCount: 1,
  },
];

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

export default function SupportPage() {
  const [tickets, setTickets]             = useState(initialTickets);
  const [activeFilter, setActiveFilter]   = useState('all');
  const [search, setSearch]               = useState('');
  const [showCreateTicket, setShowCreate] = useState(false);
  const [chatTicket, setChatTicket]       = useState(undefined); // undefined = closed, null = general, object = specific
  const [expandedTicket, setExpandedTicket] = useState(null);

  const filtered = tickets.filter(t => {
    const matchFilter = activeFilter === 'all' || t.status === activeFilter;
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = [
    { label: 'Total Tickets', value: tickets.length,                                     icon: Ticket,      color: 'from-indigo-500/90 to-indigo-700',   bg: 'bg-indigo-50' },
    { label: 'Open',          value: tickets.filter(t => t.status === 'open').length,   icon: AlertCircle, color: 'from-amber-400/90 to-amber-600',   bg: 'bg-amber-50' },
    { label: 'In Progress',   value: tickets.filter(t => t.status === 'inprogress').length, icon: RotateCcw, color: 'from-sky-400/90 to-sky-600', bg: 'bg-sky-50' },
    { label: 'Resolved',      value: tickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: 'from-emerald-400/90 to-emerald-600', bg: 'bg-emerald-50' },
  ];

  const totalUnread = tickets.reduce((sum, t) => sum + (t.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Page Header */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-5 relative">
            <HeadphonesIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-600">My Account</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold text-gray-900">Support</span>

            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Help & Support</h1>
              <p className="text-sm text-gray-500">We're here to help. Create a ticket or chat with us.</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setChatTicket(null)} // general live chat
                className="relative flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Live Chat
                {totalUnread > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-red-500 text-white font-bold">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4" /> New Ticket
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 space-y-6">

        {/* Stats row with soft colored bg */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              className={`rounded-2xl shadow-md border border-gray-100 p-4 flex items-center gap-3 ${stat.bg}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ticket History (no quick-contact cards now) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Section Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm font-bold text-gray-900">Support Tickets</h2>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tickets..."
                  className="pl-8 pr-4 py-2 border border-gray-200 focus:border-indigo-400 rounded-xl text-xs outline-none text-gray-900 placeholder:text-gray-400 w-44"
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-50">
              {filterTabs.map(tab => {
                const count = tab.key === 'all' ? tickets.length : tickets.filter(t => t.status === tab.key).length;
                return (
                  <motion.button
                    key={tab.key} whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                      activeFilter === tab.key
                        ? 'bg-black border-black text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
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

            {/* Ticket List */}
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-16 text-center px-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">No Tickets Found</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {search ? `No tickets matched "${search}"` : "You haven't raised any support tickets yet."}
                  </p>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> Create First Ticket
                  </button>
                </motion.div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filtered.map((ticket, i) => {
                    const st     = ticketStatus[ticket.status];
                    const pr     = priorityConfig[ticket.priority];
                    const isOpen = expandedTicket === ticket.id;
                    const hasUnread = ticket.unreadCount > 0;

                    return (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      >
                        {/* Ticket Row */}
                        <div
                          className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setExpandedTicket(p => p === ticket.id ? null : ticket.id)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Category icon + unread dot */}
                            <div className="relative">
                              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                {categoryIcons[ticket.category]}
                              </div>
                              {hasUnread && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                                  {ticket.unreadCount > 9 ? '9+' : ticket.unreadCount}
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Top row */}
                              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                <p className="text-xs font-mono text-gray-500">{ticket.id}</p>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${pr.color}`}>
                                    {pr.label}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.color} ${st.border}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                    {st.label}
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm font-bold text-gray-900 truncate">{ticket.subject}</p>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {ticket.date}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" /> {ticket.messages} messages
                                </span>
                                <span className="text-xs text-gray-400">Last reply: {ticket.lastReply}</span>
                              </div>
                            </div>

                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}
                              className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"
                            >
                              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-4 pt-1 space-y-4 bg-gray-50 border-t border-gray-100">

                                {/* Description */}
                                <div className="bg-white border border-gray-100 rounded-xl p-4">
                                  <p className="text-xs font-bold text-gray-500 mb-2">Description</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{ticket.desc}</p>
                                  {ticket.orderId && (
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                      <Package className="w-3.5 h-3.5 text-gray-400" />
                                      <span className="text-xs text-gray-500">Related order:</span>
                                      <span className="text-xs font-bold font-mono text-indigo-600">{ticket.orderId}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => setChatTicket(ticket)}  // specific ticket chat
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" /> Open Chat
                                  </motion.button>

                                  {(ticket.status === 'open' || ticket.status === 'inprogress') && (
                                    <motion.button
                                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                      onClick={() => setTickets(p => p.map(t => t.id === ticket.id ? { ...t, status: 'closed' } : t))}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Close Ticket
                                    </motion.button>
                                  )}

                                  {ticket.status === 'closed' && (
                                    <motion.button
                                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                      onClick={() => setTickets(p => p.map(t => t.id === ticket.id ? { ...t, status: 'open' } : t))}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-xl text-xs font-bold transition-all"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" /> Reopen
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Dialogs */}
      <AnimatePresence>
        {showCreateTicket && (
          <CreateTicketDialog
            onClose={() => setShowCreate(false)}
            onCreated={ticket => {
              setTickets(p => [ticket, ...p]);
              setShowCreate(false);
            }}
          />
        )}

        {/* Chat:
           - chatTicket === undefined -> no chat
           - chatTicket === null      -> general live chat
           - chatTicket is object     -> ticket-specific chat
        */}
        {chatTicket !== undefined && (
          <SupportChatBox
            ticket={chatTicket || undefined}
            onClose={() => setChatTicket(undefined)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
