'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, X, AlertCircle, Package } from 'lucide-react';

const cancelReasons = [
  'I want to change the delivery address',
  'I want to change / add items in order',
  'I found a better price elsewhere',
  'Order placed by mistake',
  'Expected delivery time is too long',
  'Payment issue / want to pay differently',
  'Product no longer needed',
  'Other reason',
];

export default function CancelOrderDialog({ order, onClose }) {
  const [reason, setReason]     = useState('');
  const [otherText, setOther]   = useState('');
  const [done, setDone]         = useState(false);

  if (!order) return null;

  const canSubmit = reason && (reason !== 'Other reason' || otherText.trim());

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-4"
      onClick={() => !done && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        <AnimatePresence mode="wait">

          {/* ── FORM ── */}
          {!done ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl sm:rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Cancel Order</h3>
                    <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Warning */}
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 font-medium">
                    Once cancelled, this cannot be undone. Refund (if applicable) will be processed within 5–7 business days.
                  </p>
                </div>

                {/* Order brief */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-bold text-gray-700">Order: <span className="font-mono">{order.id}</span></p>
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1.5 border-t border-gray-100 first:border-0">
                      <span className="text-lg">{item.image}</span>
                      <p className="text-xs font-medium text-gray-700 truncate flex-1">{item.name}</p>
                      <p className="text-xs font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-3">Why are you cancelling? *</p>
                  <div className="space-y-2">
                    {cancelReasons.map(r => (
                      <motion.label
                        key={r} whileHover={{ x: 2 }}
                        className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          reason === r ? 'border-red-400 bg-red-50' : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          reason === r ? 'border-red-500 bg-red-500' : 'border-gray-300'
                        }`}>
                          {reason === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <input type="radio" className="sr-only" name="cancelReason"
                          value={r} onChange={() => setReason(r)} />
                        <span className={`text-xs font-medium ${reason === r ? 'text-red-700' : 'text-gray-700'}`}>{r}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Other textarea */}
                <AnimatePresence>
                  {reason === 'Other reason' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <textarea
                        rows={3}
                        value={otherText}
                        onChange={e => setOther(e.target.value)}
                        placeholder="Please describe your reason..."
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-400/10 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button onClick={onClose}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">
                    Keep Order
                  </button>
                  <motion.button
                    whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                    whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                    disabled={!canSubmit}
                    onClick={() => setDone(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" /> Confirm Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>

          ) : (
            /* ── SUCCESS ── */
            <motion.div key="success" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-5"
              >
                <XCircle className="w-10 h-10 text-red-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Order Cancelled</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                Your order <span className="font-bold font-mono text-gray-800">{order.id}</span> has been successfully cancelled.
              </p>
              <p className="text-xs text-green-600 font-semibold bg-green-50 border border-green-200 rounded-xl px-4 py-2 inline-block mb-7">
                Refund of ₹{order.total.toLocaleString()} will be credited in 5–7 business days
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-bold text-sm shadow-lg"
              >
                Done
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
