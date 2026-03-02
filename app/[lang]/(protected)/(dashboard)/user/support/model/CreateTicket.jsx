'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Ticket, AlertCircle, CheckCircle, Package,
  ChevronDown, Paperclip, Upload, Tag
} from 'lucide-react';

const categories = [
  { id: 'order',    label: 'Order Issue',       icon: '📦', desc: 'Delays, missing, wrong items' },
  { id: 'payment',  label: 'Payment Issue',      icon: '💳', desc: 'Refunds, failed transactions' },
  { id: 'delivery', label: 'Delivery Problem',   icon: '🚚', desc: 'Not delivered, damaged' },
  { id: 'product',  label: 'Product Query',      icon: '🛍️', desc: 'Quality, description mismatch' },
  { id: 'account',  label: 'Account Help',       icon: '👤', desc: 'Login, profile, security' },
  { id: 'other',    label: 'Other',              icon: '💬', desc: 'Something else' },
];

const priorities = [
  { id: 'low',    label: 'Low',    color: 'text-green-600  bg-green-50  border-green-200' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { id: 'high',   label: 'High',   color: 'text-red-600    bg-red-50    border-red-200' },
];

const sampleOrders = [
  { id: 'ORD-20250301', label: 'ORD-20250301 — Wireless Earbuds' },
  { id: 'ORD-20250218', label: 'ORD-20250218 — PowerBank 20000mAh' },
  { id: 'ORD-20250110', label: 'ORD-20250110 — Bluetooth Speaker' },
];

const STEPS = { CATEGORY: 1, DETAILS: 2, SUCCESS: 3 };

export default function CreateTicketDialog({ onClose, onCreated }) {
  const [step, setStep]           = useState(STEPS.CATEGORY);
  const [category, setCategory]   = useState('');
  const [priority, setPriority]   = useState('medium');
  const [subject, setSubject]     = useState('');
  const [desc, setDesc]           = useState('');
  const [orderId, setOrderId]     = useState('');
  const [files, setFiles]         = useState([]);
  const [ticketId, setTicketId]   = useState('');
  const [errors, setErrors]       = useState({});

  const validate = () => {
    const e = {};
    if (!subject.trim()) e.subject = 'Subject is required';
    if (desc.trim().length < 20) e.desc = 'Please describe your issue in at least 20 characters';
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const id = 'TKT-' + Date.now().toString().slice(-7);
    setTicketId(id);
    onCreated?.({ id, category, priority, subject, desc, orderId, status: 'open', date: 'Just now' });
    setStep(STEPS.SUCCESS);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-4"
      onClick={() => step !== STEPS.SUCCESS && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        <AnimatePresence mode="wait">

          {/* SUCCESS */}
          {step === STEPS.SUCCESS ? (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              className="p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h3 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-900 mb-2">Ticket Created!</motion.h3>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 mb-4">
                Your support ticket has been submitted. Our team will respond within 24 hours.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 mb-6 text-left space-y-2"
              >
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Ticket ID</span>
                  <span className="font-bold font-mono text-gray-900">{ticketId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-gray-800 capitalize">{category}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Priority</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorities.find(p => p.id === priority)?.color}`}>
                    {priorities.find(p => p.id === priority)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Est. Response</span>
                  <span className="font-semibold text-gray-800">Within 24 hours</span>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-bold text-sm shadow-lg"
              >
                Done
              </motion.button>
            </motion.div>

          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl sm:rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
                    <Ticket className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Create Support Ticket</h3>
                    <p className="text-xs text-gray-500">Step {step} of 2 — {step === STEPS.CATEGORY ? 'Choose category' : 'Fill details'}</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Progress */}
              <div className="px-6 pt-4">
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: step === STEPS.CATEGORY ? '50%' : '100%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <div className="p-6 space-y-5">
                <AnimatePresence mode="wait">

                  {/* STEP 1: CATEGORY */}
                  {step === STEPS.CATEGORY && (
                    <motion.div key="s1"
                      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                      className="space-y-4"
                    >
                      <p className="text-sm font-bold text-gray-900">What do you need help with?</p>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map(cat => (
                          <motion.button
                            key={cat.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setCategory(cat.id)}
                            className={`flex flex-col items-start gap-1 p-4 border-2 rounded-xl text-left transition-all ${
                              category === cat.id
                                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                : 'border-gray-100 hover:border-gray-200 bg-white'
                            }`}
                          >
                            <span className="text-2xl">{cat.icon}</span>
                            <span className={`text-xs font-bold ${category === cat.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                              {cat.label}
                            </span>
                            <span className="text-xs text-gray-400">{cat.desc}</span>
                          </motion.button>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: category ? 1.02 : 1 }} whileTap={{ scale: category ? 0.98 : 1 }}
                        disabled={!category}
                        onClick={() => setStep(STEPS.DETAILS)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue →
                      </motion.button>
                    </motion.div>
                  )}

                  {/* STEP 2: DETAILS */}
                  {step === STEPS.DETAILS && (
                    <motion.div key="s2"
                      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                      className="space-y-4"
                    >
                      {/* Category badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{categories.find(c => c.id === category)?.icon}</span>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                          {categories.find(c => c.id === category)?.label}
                        </span>
                        <button onClick={() => setStep(STEPS.CATEGORY)} className="text-xs text-gray-400 hover:text-gray-700 underline ml-auto">
                          Change
                        </button>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Priority</label>
                        <div className="flex gap-2">
                          {priorities.map(p => (
                            <motion.button
                              key={p.id} whileTap={{ scale: 0.96 }}
                              onClick={() => setPriority(p.id)}
                              className={`flex-1 py-2 border-2 rounded-xl text-xs font-bold transition-all ${
                                priority === p.id ? p.color + ' shadow-sm' : 'border-gray-200 text-gray-500 bg-white hover:border-gray-300'
                              }`}
                            >
                              {p.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Related Order */}
                      {(category === 'order' || category === 'delivery') && (
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Related Order <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select value={orderId} onChange={e => setOrderId(e.target.value)}
                              className="w-full pl-9 pr-8 py-2.5 border-2 border-gray-200 focus:border-indigo-400 rounded-xl text-sm outline-none text-gray-900 appearance-none bg-white">
                              <option value="">Select an order</option>
                              {sampleOrders.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Subject *</label>
                        <input
                          value={subject} onChange={e => { setSubject(e.target.value); setErrors(p => ({ ...p, subject: '' })); }}
                          placeholder="Brief summary of your issue"
                          className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                            errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10'
                          }`}
                        />
                        {errors.subject && <p className="text-xs text-red-500 mt-1 font-medium">{errors.subject}</p>}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Description *</label>
                        <textarea
                          rows={4} value={desc}
                          onChange={e => { setDesc(e.target.value); setErrors(p => ({ ...p, desc: '' })); }}
                          placeholder="Describe your issue in detail..."
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none ${
                            errors.desc ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10'
                          }`}
                        />
                        <div className="flex items-center justify-between mt-1">
                          {errors.desc
                            ? <p className="text-xs text-red-500 font-medium">{errors.desc}</p>
                            : <span />
                          }
                          <span className="text-xs text-gray-400 ml-auto">{desc.length} chars</span>
                        </div>
                      </div>

                      {/* Attachment */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Attachments <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl cursor-pointer transition-all">
                          <input type="file" multiple className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))} />
                          <Upload className="w-4 h-4 text-gray-400" />
                          {files.length > 0
                            ? <span className="text-xs font-semibold text-indigo-600">{files.length} file(s) selected</span>
                            : <span className="text-xs text-gray-500">Click to attach screenshots or documents</span>
                          }
                        </label>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-1">
                        <button onClick={() => setStep(STEPS.CATEGORY)}
                          className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50">
                          ← Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg"
                        >
                          <Ticket className="w-4 h-4" /> Submit Ticket
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
