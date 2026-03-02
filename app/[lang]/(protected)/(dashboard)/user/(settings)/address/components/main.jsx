'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Plus, Edit3, Trash2, Home, Briefcase,
  CheckCircle, X, ShieldCheck, Navigation, Phone,
  User, Building2, Hash, ChevronDown, Star
} from 'lucide-react';

const initialAddresses = [
  {
    id: 1,
    tag: 'Home',
    tagIcon: Home,
    isDefault: true,
    name: 'Vishal Singh',
    phone: '9876543210',
    line1: '42, Sector 15, Rohini',
    line2: 'Near Metro Station',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110085',
    country: 'India',
  },
  {
    id: 2,
    tag: 'Work',
    tagIcon: Briefcase,
    isDefault: false,
    name: 'Vishal Singh',
    phone: '9123456789',
    line1: 'Plot 7, Cyber City',
    line2: 'DLF Phase 2',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    country: 'India',
  },
];

const tagOptions = [
  { label: 'Home', icon: Home },
  { label: 'Work', icon: Briefcase },
  { label: 'Other', icon: MapPin },
];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const emptyForm = {
  tag: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
};

export default function DeliveryAddressPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (addr) => {
    setEditingId(addr.id);
    setForm({ ...addr });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm({ ...form, phone: val });
    setErrors({ ...errors, phone: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (form.phone.length !== 10) e.phone = 'Phone number must be exactly 10 digits';
    if (!form.line1.trim()) e.line1 = 'Address line 1 is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'Please select a state';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editingId) {
      setAddresses(addresses.map(a =>
        a.id === editingId
          ? { ...form, id: editingId, tagIcon: tagOptions.find(t => t.label === form.tag)?.icon || MapPin }
          : a
      ));
    } else {
      const newAddr = {
        ...form,
        id: Date.now(),
        isDefault: addresses.length === 0,
        tagIcon: tagOptions.find(t => t.label === form.tag)?.icon || MapPin,
      };
      setAddresses([...addresses, newAddr]);
    }
    closeModal();
  };

  const handleDelete = () => {
    const remaining = addresses.filter(a => a.id !== deleteId);
    if (remaining.length > 0 && addresses.find(a => a.id === deleteId)?.isDefault) {
      remaining[0].isDefault = true;
    }
    setAddresses(remaining);
    setDeleteId(null);
  };

  const setDefault = (id) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const inputBase = (field) =>
    `w-full pl-9 pr-3 py-2.5 border-2 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
      errors[field]
        ? 'border-red-400 bg-red-50'
        : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Page Header */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-5">
            <Navigation className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-600">My Account</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold text-gray-900">Delivery Addresses</span>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Delivery Addresses
              </h1>
              <p className="text-sm text-gray-500">
                Manage your saved delivery locations.
              </p>
            </div>
            {addresses.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openAdd}
                className="flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <AnimatePresence mode="wait">

          {/* EMPTY STATE */}
          {addresses.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-14 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
                className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <MapPin className="w-12 h-12 text-indigo-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-xl font-bold text-gray-900 mb-2"
              >
                No Addresses Saved
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-sm text-gray-500 mb-8 max-w-xs mx-auto"
              >
                You haven't added any delivery addresses yet. Add one to make checkout faster.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openAdd}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Your First Address
              </motion.button>
            </motion.div>
          )}

          {/* ADDRESS LIST */}
          {addresses.length > 0 && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <AnimatePresence>
                {addresses.map((addr, i) => {
                  const Icon = addr.tagIcon || MapPin;
                  return (
                    <motion.div
                      key={addr.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                      transition={{ delay: i * 0.07 }}
                      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all group ${
                        addr.isDefault
                          ? 'border-black shadow-xl'
                          : 'border-gray-100 hover:border-gray-300 hover:shadow-xl'
                      }`}
                    >
                      {addr.isDefault && (
                        <div className="absolute -top-3 left-4">
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-black to-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            Default
                          </span>
                        </div>
                      )}

                      <div className="p-5 pt-6">
                        {/* Tag row */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              addr.tag === 'Home' ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                              : addr.tag === 'Work' ? 'bg-gradient-to-br from-purple-100 to-purple-200'
                              : 'bg-gradient-to-br from-green-100 to-green-200'
                            }`}>
                              <Icon className={`w-4 h-4 ${
                                addr.tag === 'Home' ? 'text-blue-600'
                                : addr.tag === 'Work' ? 'text-purple-600'
                                : 'text-green-600'
                              }`} />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{addr.tag}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEdit(addr)}
                              className="w-8 h-8 bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-500 rounded-lg flex items-center justify-center transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteId(addr.id)}
                              className="w-8 h-8 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 rounded-lg flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5 mb-4">
                          <p className="text-sm font-bold text-gray-900">{addr.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 flex-shrink-0" /> {addr.phone}
                          </p>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                          </p>
                          <p className="text-xs text-gray-700">
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="text-xs text-gray-500">{addr.country}</p>
                        </div>

                        {!addr.isDefault ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDefault(addr.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-gray-200 hover:border-black text-gray-400 hover:text-black rounded-xl text-xs font-semibold transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Set as Default
                          </motion.button>
                        ) : (
                          <div className="w-full flex items-center justify-center gap-1.5 py-2 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Default Delivery Address
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                    {editingId ? <Edit3 className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {editingId ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <p className="text-xs text-gray-500">Fill in the delivery details below</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* Tag Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Address Tag</label>
                  <div className="flex gap-2">
                    {tagOptions.map(({ label, icon: Icon }) => (
                      <motion.button
                        key={label}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setForm({ ...form, tag: label })}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 rounded-xl text-xs font-bold transition-all ${
                          form.tag === label
                            ? 'border-black bg-black text-white shadow-md'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="name"
                        value={form.name}
                        maxLength={60}
                        onChange={handleChange}
                        placeholder="Vishal Singh"
                        className={inputBase('name')}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        placeholder="9876543210"
                        inputMode="numeric"
                        maxLength={10}
                        className={`w-full pl-9 pr-12 py-2.5 border-2 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                          errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white'
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400">
                        {form.phone.length}/10
                      </span>
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>}
                  </div>
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Address Line 1 *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="line1"
                      value={form.line1}
                      maxLength={100}
                      onChange={handleChange}
                      placeholder="House / Flat / Block No., Street"
                      className={inputBase('line1')}
                    />
                  </div>
                  {errors.line1 && <p className="text-xs text-red-500 mt-1 font-medium">{errors.line1}</p>}
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="line2"
                      value={form.line2}
                      onChange={handleChange}
                      placeholder="Landmark, Area, Colony"
                      className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-white"
                    />
                  </div>
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">City *</label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="city"
                        value={form.city}
                        maxLength={50}
                        onChange={handleChange}
                        placeholder="New Delhi"
                        className={inputBase('city')}
                      />
                    </div>
                    {errors.city && <p className="text-xs text-red-500 mt-1 font-medium">{errors.city}</p>}
                  </div>

                  {/* State Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">State *</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-8 py-2.5 border-2 rounded-xl text-sm outline-none transition-all appearance-none bg-white ${
                          errors.state
                            ? 'border-red-400 bg-red-50 text-gray-900'
                            : form.state
                            ? 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 text-gray-900'
                            : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 text-gray-400'
                        }`}
                      >
                        <option value="">Select state</option>
                        {indianStates.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.state && <p className="text-xs text-red-500 mt-1 font-medium">{errors.state}</p>}
                  </div>
                </div>

                {/* Pincode & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pincode */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Pincode *</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="pincode"
                        value={form.pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setForm({ ...form, pincode: val });
                          setErrors({ ...errors, pincode: '' });
                        }}
                        placeholder="110085"
                        inputMode="numeric"
                        maxLength={6}
                        className={inputBase('pincode')}
                      />
                    </div>
                    {errors.pincode && <p className="text-xs text-red-500 mt-1 font-medium">{errors.pincode}</p>}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Country</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full pl-9 pr-8 py-2.5 border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm outline-none transition-all text-gray-900 appearance-none bg-white"
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>UAE</option>
                        <option>Canada</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {editingId ? 'Save Changes' : 'Add Address'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM MODAL ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Address?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                This address will be permanently removed. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Yes, Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
