'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Ticket } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createTicket } from '@/action/common';
import { categories } from '../components/data';

export default function CreateTicketDialog({ onClose }) {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!category) e.category = 'Please select a category';
    if (!subject.trim()) e.subject = 'Subject is required';
    if (!desc.trim()) {
      e.desc = 'Description is required';
    } else if (desc.trim().length < 10) {
      e.desc = 'Please describe your issue in at least 10 characters';
    }
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        category,
        subject: subject.trim(),
        description: desc.trim(),
      };

      const response = await createTicket(payload);

      if (response?.success) {
        toast.success(response?.message || "Ticket created successfully");
        onClose?.();
      } else {
        toast.error(response?.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-4"
      onClick={() => !loading && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Create Support Ticket</h3>
              <p className="text-xs text-gray-500">Tell us what issue you are facing</p>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Category *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    setErrors((p) => ({ ...p, category: '' }));
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${category === cat.id
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs truncate">{cat.label}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors((p) => ({ ...p, subject: '' }));
              }}
              placeholder="Brief summary of your issue"
              className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 ${errors.subject
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                }`}
            />
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Description *</label>
            <textarea
              rows={4}
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                setErrors((p) => ({ ...p, desc: '' }));
              }}
              placeholder="Describe your issue in detail..."
              className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none ${errors.desc
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.desc ? (
                <p className="text-xs text-red-500 font-medium">{errors.desc}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 ml-auto">{desc.length} chars</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <motion.button
              type="button"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
