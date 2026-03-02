'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X, AlertCircle, Package, Camera, Upload, CheckCircle } from 'lucide-react';

const returnReasons = [
  'Product is defective / not working',
  'Wrong product delivered',
  'Product damaged during delivery',
  'Product does not match description',
  'Missing parts or accessories',
  'Changed my mind',
  'Duplicate order placed',
  'Other reason',
];

const resolutionOptions = [
  { id: 'refund',      label: 'Refund',      desc: 'Get money back to original payment',  icon: '💰', color: 'from-green-400 to-green-600' },
  { id: 'replacement', label: 'Replacement', desc: 'Get a brand new replacement product',  icon: '🔄', color: 'from-blue-400 to-blue-600' },
  { id: 'exchange',    label: 'Exchange',    desc: 'Exchange for a different variant',      icon: '🔃', color: 'from-purple-400 to-purple-600' },
];

const STEPS = { REASON: 1, RESOLUTION: 2, UPLOAD: 3, SUCCESS: 4 };

export default function ReturnOrderDialog({ order, onClose }) {
  const [step, setStep]           = useState(STEPS.REASON);
  const [reason, setReason]       = useState('');
  const [otherText, setOther]     = useState('');
  const [resolution, setRes]      = useState('');
  const [images, setImages]       = useState([]);
  const [description, setDesc]    = useState('');

  if (!order) return null;

  const canNext1 = reason && (reason !== 'Other reason' || otherText.trim());
  const canNext2 = !!resolution;
  const canSubmit = images.length > 0 || description.trim().length > 0;

  const stepLabels = ['Reason', 'Resolution', 'Evidence'];

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
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        <AnimatePresence mode="wait">

          {/* ── SUCCESS ── */}
          {step === STEPS.SUCCESS ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h3 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-900 mb-2">Return Requested!</motion.h3>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                Your return request for order <span className="font-bold font-mono text-gray-800">{order.id}</span> has been submitted successfully.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Return Initiated', color: 'bg-green-50 border-green-100 text-green-600', icon: '✅' },
                  { label: resolution === 'refund' ? 'Refund in 5–7 days' : 'Replacement soon', color: 'bg-blue-50 border-blue-100 text-blue-600', icon: '💳' },
                  { label: 'Pickup Scheduled', color: 'bg-purple-50 border-purple-100 text-purple-600', icon: '🚚' },
                ].map((item, i) => (
                  <div key={i} className={`rounded-xl p-3 border ${item.color} text-center`}>
                    <p className="text-lg mb-1">{item.icon}</p>
                    <p className="text-xs font-semibold">{item.label}</p>
                  </div>
                ))}
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
            /* ── FORM STEPS ── */
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl sm:rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Return Order</h3>
                    <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="px-6 pt-5 pb-2">
                <div className="flex items-center justify-between">
                  {stepLabels.map((label, i) => {
                    const stepNum = i + 1;
                    const isDone = step > stepNum;
                    const isCurrent = step === stepNum;
                    return (
                      <div key={i} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                            isDone ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                            : isCurrent ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white ring-4 ring-purple-100'
                            : 'bg-gray-100 text-gray-400'
                          }`}>
                            {isDone ? <CheckCircle className="w-4 h-4" /> : stepNum}
                          </div>
                          <span className={`text-xs font-medium mt-1 ${isCurrent || isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                            {label}
                          </span>
                        </div>
                        {i < stepLabels.length - 1 && (
                          <div className="flex-1 relative" style={{ marginTop: '-18px' }}>
                            <div className="h-1.5 bg-gray-100 rounded-full mx-2">
                              <motion.div
                                className={`h-full rounded-full ${isDone ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-100'}`}
                                initial={{ width: '0%' }}
                                animate={{ width: isDone ? '100%' : '0%' }}
                                transition={{ duration: 0.4 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 space-y-5">

                {/* ── STEP 1: REASON ── */}
                <AnimatePresence mode="wait">
                  {step === STEPS.REASON && (
                    <motion.div key="s1"
                      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                      className="space-y-4"
                    >
                      {/* Order brief */}
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <p className="text-xs font-bold text-gray-700 font-mono">{order.id}</p>
                        </div>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 py-1.5 border-t border-gray-100 first:border-0">
                            <span className="text-lg">{item.image}</span>
                            <p className="text-xs font-medium text-gray-700 truncate flex-1">{item.name}</p>
                            <p className="text-xs font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      {/* Warning */}
                      <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-orange-600 font-medium">
                          Returns are accepted within 7 days of delivery. Item must be in original condition.
                        </p>
                      </div>

                      {/* Reasons */}
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-3">Reason for return *</p>
                        <div className="space-y-2">
                          {returnReasons.map(r => (
                            <motion.label
                              key={r} whileHover={{ x: 2 }}
                              className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                                reason === r ? 'border-purple-400 bg-purple-50' : 'border-gray-100 hover:border-gray-200 bg-white'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                reason === r ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                              }`}>
                                {reason === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <input type="radio" className="sr-only" name="returnReason" value={r} onChange={() => setReason(r)} />
                              <span className={`text-xs font-medium ${reason === r ? 'text-purple-700' : 'text-gray-700'}`}>{r}</span>
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence>
                        {reason === 'Other reason' && (
                          <motion.textarea
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            rows={3} value={otherText} onChange={e => setOther(e.target.value)}
                            placeholder="Describe your issue..."
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-400 rounded-xl text-sm outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                          />
                        )}
                      </AnimatePresence>

                      <div className="flex gap-3 pt-1">
                        <button onClick={onClose}
                          className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50">
                          Cancel
                        </button>
                        <motion.button
                          whileHover={{ scale: canNext1 ? 1.02 : 1 }} whileTap={{ scale: canNext1 ? 0.98 : 1 }}
                          disabled={!canNext1}
                          onClick={() => setStep(STEPS.RESOLUTION)}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next →
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 2: RESOLUTION ── */}
                  {step === STEPS.RESOLUTION && (
                    <motion.div key="s2"
                      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Preferred Resolution *</p>
                        <p className="text-xs text-gray-500 mb-4">How would you like us to resolve this?</p>
                        <div className="space-y-3">
                          {resolutionOptions.map(opt => (
                            <motion.label
                              key={opt.id} whileHover={{ x: 2 }}
                              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                resolution === opt.id
                                  ? 'border-black bg-gradient-to-r from-gray-900 to-black'
                                  : 'border-gray-100 hover:border-gray-200 bg-white'
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                                {opt.icon}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-bold ${resolution === opt.id ? 'text-white' : 'text-gray-900'}`}>
                                  {opt.label}
                                </p>
                                <p className={`text-xs mt-0.5 ${resolution === opt.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {opt.desc}
                                </p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                resolution === opt.id ? 'border-white bg-white' : 'border-gray-300'
                              }`}>
                                {resolution === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                              </div>
                              <input type="radio" className="sr-only" name="resolution" value={opt.id} onChange={() => setRes(opt.id)} />
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-1">
                        <button onClick={() => setStep(STEPS.REASON)}
                          className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50">
                          ← Back
                        </button>
                        <motion.button
                          whileHover={{ scale: canNext2 ? 1.02 : 1 }} whileTap={{ scale: canNext2 ? 0.98 : 1 }}
                          disabled={!canNext2}
                          onClick={() => setStep(STEPS.UPLOAD)}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next →
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: EVIDENCE ── */}
                  {step === STEPS.UPLOAD && (
                    <motion.div key="s3"
                      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Upload Evidence</p>
                        <p className="text-xs text-gray-500 mb-4">
                          Photos help us process your return faster. Attach at least 1 image.
                        </p>

                        {/* Upload box */}
                        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all group">
                          <input type="file" multiple accept="image/*" className="hidden"
                            onChange={e => setImages(Array.from(e.target.files || []))} />
                          {images.length > 0 ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                              </div>
                              <p className="text-sm font-bold text-gray-900 mb-1">{images.length} image(s) selected</p>
                              {images.map((f, i) => (
                                <p key={i} className="text-xs text-gray-500">✓ {f.name}</p>
                              ))}
                              <p className="text-xs text-gray-400 mt-2">Click to change</p>
                            </motion.div>
                          ) : (
                            <>
                              <Camera className="w-10 h-10 text-gray-300 group-hover:text-purple-400 mb-3 transition-colors" />
                              <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload photos</p>
                              <p className="text-xs text-gray-400">JPG, PNG up to 5MB each (max 5 images)</p>
                            </>
                          )}
                        </label>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          Additional Description <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                          rows={3} value={description} onChange={e => setDesc(e.target.value)}
                          placeholder="Describe the issue in more detail..."
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/10 rounded-xl text-sm outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                        />
                      </div>

                      {/* Tips */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-700 mb-2">📸 Tips for better photos:</p>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {['Clear well-lit photos of the defect', 'Show product from multiple angles', 'Include packaging if damaged', 'Capture serial number if visible'].map((tip, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" /> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-3 pt-1">
                        <button onClick={() => setStep(STEPS.RESOLUTION)}
                          className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50">
                          ← Back
                        </button>
                        <motion.button
                          whileHover={{ scale: canSubmit ? 1.02 : 1 }} whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                          disabled={!canSubmit}
                          onClick={() => setStep(STEPS.SUCCESS)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Upload className="w-4 h-4" /> Submit Return
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
