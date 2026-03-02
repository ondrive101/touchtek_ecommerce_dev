'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, User, Wifi, WifiOff, TrendingUp, ShoppingBag, MapPin,
  Filter, Search, Download, Eye, Trash2, Mail, Phone, Zap,
  Clock, CheckCircle, AlertCircle, ChevronDown, MoreVertical,
  BadgeCheck, Shield, Map
} from 'lucide-react';

const stats = [
  { label: 'Total Customers', value: '2,847', change: '+23', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Active Today', value: '156', change: '+12%', icon: Zap, color: 'text-blue-600 bg-blue-50' },
  { label: 'New This Month', value: '89', change: '+45%', icon: User, color: 'bg-white border-gray-200' },
  { label: 'Lifetime Value', value: '₹4.2M', change: null, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
];

const customers = [
  { 
    id: '#CUST-001', 
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    name: 'Vishal Singh', 
    email: 'vishal.singh@email.com', 
    phone: '+91 98765 43210', 
    state: 'Delhi',
    city: 'Delhi',
    country: 'India',
    address: '123 MG Road, Delhi, DL 110001',
    businessType: null,
    isEmailVerified: true, 
    isPhoneVerified: true,
    lifetimeSpend: '45200', 
    totalOrders: 12, 
    type: 'online', 
    status: 'Active',
    lastOrderDate: '01 Mar 2026', 
    lastActive: '01 Mar 2026 10:30 PM'
  },
  { 
    id: '#CUST-002', 
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    name: 'Priya Sharma Hardware', 
    email: 'priya@sharmahardware.com', 
    phone: '+91 98123 45678', 
    state: 'Maharashtra',
    city: 'Mumbai',
    country: 'India',
    address: '456 Market Street, Andheri West, Mumbai, MH 400058',
    businessType: 'Distributor',
    isEmailVerified: false, 
    isPhoneVerified: true,
    lifetimeSpend: '321500', 
    totalOrders: 89, 
    type: 'offline', 
    status: 'Active',
    lastOrderDate: '28 Feb 2026', 
    lastActive: '25 Feb 2026 2:15 PM'
  },
  { 
    id: '#CUST-003', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    name: 'Rahul Patel Retail', 
    email: 'rahul.patel@retail.in', 
    phone: '+91 94234 56789', 
    state: 'Gujarat',
    city: 'Ahmedabad',
    country: 'India',
    address: '789 Commercial Area, Navrangpura, Ahmedabad, GJ 380009',
    businessType: 'Retailer',
    isEmailVerified: true, 
    isPhoneVerified: true,
    lifetimeSpend: '893400', 
    totalOrders: 21, 
    type: 'offline', 
    status: 'Active',
    lastOrderDate: '01 Mar 2026', 
    lastActive: '01 Mar 2026 11:45 AM'
  },
  { 
    id: '#CUST-004', 
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    name: 'Anita Kaur', 
    email: 'anita.kaur@gmail.com', 
    phone: '+91 98765 12345', 
    state: 'Chandigarh',
    city: 'Chandigarh',
    country: 'India',
    address: 'Flat 321, Sector 17, Chandigarh, CH 160017',
    businessType: null,
    isEmailVerified: true, 
    isPhoneVerified: false,
    lifetimeSpend: '15670', 
    totalOrders: 5, 
    type: 'online', 
    status: 'Inactive',
    lastOrderDate: '25 Feb 2026', 
    lastActive: '28 Feb 2026'
  },
];

const typeColors = {
  online: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  offline: 'text-orange-600 bg-orange-50 border-orange-200',
};

const businessTypeColors = {
  Distributor: 'text-purple-600 bg-purple-50 border-purple-200',
  Retailer: 'text-blue-600 bg-blue-50 border-blue-200',
  Dealer: 'text-indigo-600 bg-indigo-50 border-indigo-200',
};

const statusColors = {
  Active: 'text-emerald-600 bg-emerald-50',
  Inactive: 'text-gray-500 bg-gray-50',
};

export default function CustomersAdminPage() {
  const [customersList, setCustomersList] = useState(customers);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = customersList.filter(customer => {
    const matchFilter = activeFilter === 'all' || customer.type === activeFilter;
    const matchSearch = customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search);
    return matchFilter && matchSearch;
  });

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const totalPages = Math.ceil(filteredCustomers.length / 10);

  const toggleCustomerType = (id) => {
    setCustomersList(prev => prev.map(c => 
      c.id === id ? { ...c, type: c.type === 'online' ? 'offline' : 'online' } : c
    ));
  };

  const bulkAction = (action) => {
    if (action === 'delete') {
      setCustomersList(prev => prev.filter(c => !selectedCustomers.includes(c.id)));
    }
    setSelectedCustomers([]);
  };

  const exportCSV = () => {
    const headers = ['ID,Name,Email,Phone,State,City,Country,Address,Business Type,IsEmailVerified,IsPhoneVerified,Lifetime Spend,Total Orders,Type,Status,Last Order Date,Last Active'];
    const rows = customersList.map(c => {
      const business = c.businessType ? `"${c.businessType}"` : '';
      return [
        c.id, `"${c.name}"`, c.email, c.phone, c.state, c.city, c.country, `"${c.address}"`, business,
        c.isEmailVerified, c.isPhoneVerified, c.lifetimeSpend, c.totalOrders,
        c.type, c.status, c.lastOrderDate, c.lastActive
      ].join(',');
    });
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const onlineCount = customersList.filter(c => c.type === 'online').length;
  const offlineCount = customersList.filter(c => c.type === 'offline').length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 3
    }).format(parseInt(amount));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-2">Manage online & offline customer database</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={exportCSV}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all ${stat.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-8 h-8" />
                  <span className="text-2xl font-black text-gray-900">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                {stat.change && (
                  <p className={`text-xs font-bold mt-1 ${stat.color.includes('emerald') ? 'text-emerald-600' : 'text-indigo-600'}`}>
                    {stat.change}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            {/* Bulk Actions */}
            {selectedCustomers.length > 0 && (
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <span>{selectedCustomers.length} selected</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => bulkAction('delete')}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, email, phone, GST..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-indigo-400 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === 'all' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </motion.button>
                <div className="w-px h-4 bg-gray-300" />
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter('online')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeFilter === 'online' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Wifi className="w-3 h-3" />
                  Online ({onlineCount})
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter('offline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeFilter === 'offline' 
                      ? 'bg-orange-600 text-white shadow-sm' 
                      : 'text-orange-700 hover:bg-orange-50'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  Offline ({offlineCount})
                </motion.button>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl border-2 border-gray-200">
                <Filter className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="p-4 text-left w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[340px]">Customer</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[200px]">Location</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[100px]">Type</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider hidden xl:table-cell min-w-[100px]">Address</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider hidden 2xl:table-cell min-w-[110px]">GST</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[110px]">Metrics</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Verifications</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[130px]">Last Order</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider hidden md:table-cell min-w-[150px]">Last Active</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCustomers.map((customer) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => {
                          setSelectedCustomers(prev => 
                            prev.includes(customer.id) 
                              ? prev.filter(id => id !== customer.id)
                              : [...prev, customer.id]
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                      />
                    </td>
                    <td className="px-4 py-4 min-w-[340px]">
                      <div className="flex items-start gap-3">
                        <img 
                          src={customer.image} 
                          alt={customer.name}
                          className="w-10 h-10 rounded-xl object-cover shadow-md flex-shrink-0 mt-1"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/40x40/6B7280/FFFFFF?text=${customer.name.charAt(0)}`;
                          }}
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="font-bold text-xs text-gray-500 tracking-wide">{customer.id}</div>
                          <div className="font-semibold text-gray-900 truncate text-sm">{customer.name}</div>
                          <div className="text-xs text-gray-600 truncate">{customer.email}</div>
                          <div className="font-mono text-xs font-medium text-gray-900">{customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-[200px]">
                      <div className="flex items-center gap-1 text-xs font-medium text-gray-900">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{customer.city}, {customer.state}</span>
                      </div>
                      <div className="text-xs text-gray-500">{customer.country}</div>
                    </td>
                    <td className="px-4 py-4 min-w-[100px]">
                      {customer.type === 'offline' && customer.businessType ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${businessTypeColors[customer.businessType] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                          {customer.businessType}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <div className="text-xs text-gray-500 truncate max-w-[100px] hover:text-gray-900 hover:font-medium cursor-pointer group-hover/address:block" title={customer.address}>
                        {customer.address.split(',')[0]}
                      </div>
                      {customer.address.split(',').slice(1).join(',')}
                    </td>
                    <td className="px-4 py-4 hidden 2xl:table-cell">
                      {customer.gstNumber ? (
                        <div className="text-xs font-mono bg-gray-50 px-2 py-1 rounded text-gray-800">
                          {customer.gstNumber}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-emerald-600">{customer.totalOrders} orders</div>
                        <div className="text-xs font-medium text-gray-900">
                          {formatCurrency(customer.lifetimeSpend)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-0.5">
                        <div className={`w-6 h-6 p-1 rounded-md flex items-center justify-center ${
                          customer.isEmailVerified 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {customer.isEmailVerified ? <BadgeCheck className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                        </div>
                        <div className={`w-6 h-6 p-1 rounded-md flex items-center justify-center ${
                          customer.isPhoneVerified 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {customer.isPhoneVerified ? <Phone className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${statusColors[customer.status]}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 min-w-[130px]">
                      <div className="text-xs font-medium text-gray-900">{customer.lastOrderDate}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell min-w-[150px]">
                      <div className="text-xs font-medium text-gray-900">{customer.lastActive}</div>
                    </td>
                    <td className="px-4 py-4 w-32">
                      <div className="flex items-center gap-1 p-1">
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex-1"
                          title="View details"
                        >
                          <Eye className="w-3 h-3 mx-auto" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex-1"
                          title="Contact"
                        >
                          <Mail className="w-3 h-3 mx-auto" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex-1"
                          title="Call"
                        >
                          <Phone className="w-3 h-3 mx-auto" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all flex-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3 mx-auto" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-500 mb-8">Try adjusting your search or customer type filters</p>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-sm text-gray-700">
              Showing {paginatedCustomers.length} of {filteredCustomers.length} customers 
              ({Math.min(currentPage * 10, filteredCustomers.length)} of {customersList.length} total)
            </div>
            <div className="flex items-center gap-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹
              </motion.button>
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
                {currentPage}
              </span>
              <span className="text-sm text-gray-500">of {totalPages}</span>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ›
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f7fafc;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .scrollbar-thin::-webkit-scrollbar-corner {
          background: #f7fafc;
        }
      `}</style>
    </div>
  );
}
