'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeadphonesIcon, Plus, MessageCircle, Ticket, Clock,
  CheckCircle, AlertCircle, XCircle, ChevronDown,
  Search, RotateCcw, AlertTriangle, RefreshCw
} from 'lucide-react';

import { getTickets } from '@/action/common';
import Pagination from '@/components/layout/components/Pagination';
import CreateTicketDialog from '../model/CreateTicket';
import SupportChatBox from '../model/SupportChatBox';

import {
  ticketStatus,
  categoryIcons,
  filterTabs,
} from './data';

export default function SupportPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    search: '',
    status: 'all',
  });
  const [searchInput, setSearchInput] = useState('');
  const [showCreateTicket, setShowCreate] = useState(false);
  const [chatTicket, setChatTicket] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });

  // Debounced search input to avoid hitting backend on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput, page: 1 };
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // TanStack Query to fetch tickets matching filters and pagination
  const {
    data: ticketsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tickets-query', filters],
    queryFn: () => getTickets(filters),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  // Sync tickets and pagination with query response
  useEffect(() => {
    if (!ticketsResponse) return;

    // Handles both ticketsResponse.data.tickets and ticketsResponse.tickets
    const resData =
      ticketsResponse?.data?.tickets !== undefined
        ? ticketsResponse.data
        : ticketsResponse?.tickets !== undefined
        ? ticketsResponse
        : null;

    if (resData?.tickets) {
      setTickets(resData.tickets || []);
    }
    if (resData?.pagination) {
      setPagination(resData.pagination || {});
    }
  }, [ticketsResponse]);

  const handleStatusChange = (status) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatLastReply = (conversations) => {
    if (conversations && conversations.length > 0) {
      const last = conversations[conversations.length - 1];
      const d = new Date(last.createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    return 'No replies yet';
  };

  const stats = [
    {
      label: 'Total Tickets',
      value: pagination?.total ?? tickets.length,
      icon: Ticket,
      color: 'from-indigo-500/90 to-indigo-700',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Created',
      value: tickets.filter((t) => t.status === 'created' || t.status === 'open').length,
      icon: AlertCircle,
      color: 'from-amber-400/90 to-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'In Progress',
      value: tickets.filter((t) => t.status === 'in_progress' || t.status === 'inprogress').length,
      icon: RotateCcw,
      color: 'from-sky-400/90 to-sky-600',
      bg: 'bg-sky-50',
    },
    {
      label: 'Closed',
      value: tickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length,
      icon: CheckCircle,
      color: 'from-emerald-400/90 to-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-5">
            <HeadphonesIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-600">My Account</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold text-gray-900">Support</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Help & Support</h1>
              <p className="text-sm text-gray-500">We're here to help. Create a ticket or track existing requests.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4" /> New Ticket
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 space-y-6">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`rounded-2xl shadow-md border border-gray-100 p-4 flex items-center gap-3 ${stat.bg}`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tickets Table / List Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm font-bold text-gray-900">Support Tickets</h2>
                {isFetching && !isLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin ml-1" />
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search tickets..."
                  className="pl-8 pr-4 py-2 border border-gray-200 focus:border-indigo-400 rounded-xl text-xs outline-none text-gray-900 placeholder:text-gray-400 w-48 sm:w-56 transition-all"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-50">
              {filterTabs.map((tab) => {
                const isActive = filters.status === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleStatusChange(tab.key)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${isActive
                      ? 'bg-black border-black text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Error State */}
            {isError ? (
              <div className="py-12 px-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Failed to Load Tickets</h3>
                <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                  {error?.message || 'An error occurred while fetching your tickets. Please try again.'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try Again
                </button>
              </div>
            ) : isLoading ? (
              /* Skeleton Loading State */
              <div className="divide-y divide-gray-50 p-4 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-start gap-3 animate-pulse pt-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3 w-28 bg-gray-100 rounded" />
                        <div className="h-4 w-16 bg-gray-100 rounded-full" />
                      </div>
                      <div className="h-4 w-3/4 bg-gray-100 rounded" />
                      <div className="h-3 w-40 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center px-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No Tickets Found</h3>
                <p className="text-xs text-gray-500 mb-4">
                  {filters.search
                    ? `No tickets matched "${filters.search}"`
                    : "You haven't raised any support tickets yet."}
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Create First Ticket
                </button>
              </motion.div>
            ) : (
              /* Tickets List */
              <div className="divide-y divide-gray-50">
                {tickets.map((ticket, i) => {
                  const ticketIdentifier = ticket.ticketId || ticket._id;
                  const st = ticketStatus[ticket.status] || ticketStatus.created;
                  const isOpen = expandedTicket === ticketIdentifier;
                  const catIcon = categoryIcons[ticket.category] || '🎫';
                  const messagesCount = ticket.conversations?.length || 0;
                  const formattedDate = formatDate(ticket.createdAt);
                  const lastReply = formatLastReply(ticket.conversations);
                  const ticketDescription = ticket.description || '';

                  return (
                    <motion.div
                      key={ticketIdentifier}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Ticket Row */}
                      <div
                        className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() =>
                          setExpandedTicket((p) => (p === ticketIdentifier ? null : ticketIdentifier))
                        }
                      >
                        <div className="flex items-start gap-3">
                          {/* Category Icon */}
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                            {catIcon}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Top Row: Ticket ID + Status */}
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                              <p className="text-xs font-mono text-gray-500 font-semibold">{ticketIdentifier}</p>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.color} ${st.border}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                  {st.label}
                                </span>
                              </div>
                            </div>

                            {/* Subject */}
                            <p className="text-sm font-bold text-gray-900 truncate">{ticket.subject}</p>

                            {/* Metadata Row */}
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {formattedDate}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" /> {messagesCount} messages
                              </span>
                              <span className="text-xs text-gray-400">Last reply: {lastReply}</span>
                            </div>
                          </div>

                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 pt-1 space-y-4 bg-gray-50 border-t border-gray-100">
                              {/* Description */}
                              <div className="bg-white border border-gray-100 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-500 mb-2">Description</p>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                  {ticketDescription}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => setChatTicket(ticket)}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" /> Open Chat
                                </motion.button>
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

            {/* Pagination Controls */}
            {pagination?.total > 0 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-xs text-gray-500">
                    Showing{' '}
                    <span className="font-semibold text-gray-800">
                      {(filters.page - 1) * filters.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-gray-800">
                      {Math.min(filters.page * filters.limit, pagination?.total || 0)}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold text-gray-800">{pagination?.total || 0}</span> tickets
                  </p>

                  {/* Rows per page selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Rows:</span>
                    <select
                      value={filters.limit}
                      onChange={(e) => {
                        const newLimit = parseInt(e.target.value, 10);
                        setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
                      }}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none bg-white text-gray-700 font-medium cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <Pagination
                  currentPage={filters.page}
                  totalPages={pagination?.totalPages || 1}
                  onPageChange={handlePageChange}
                  isLoading={isFetching}
                  showAlways={true}
                  className="flex items-center"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Dialogs */}
      <AnimatePresence>
        {showCreateTicket && (
          <CreateTicketDialog
            onClose={() => {
              setShowCreate(false);
              refetch();
            }}
          />
        )}

        {chatTicket && (
          <SupportChatBox
            ticket={chatTicket}
            onClose={() => setChatTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
