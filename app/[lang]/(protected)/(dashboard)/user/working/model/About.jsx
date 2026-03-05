'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, X, Plus, Save } from 'lucide-react';

export default function AboutModal({ about, onClose, onSave }) {
  const [list, setList] = useState([...about]);
  const [newPoint, setNewPoint] = useState('');

  const addPoint = () => {
    if (!newPoint.trim()) return;
    setList(p => [...p, newPoint.trim()]);
    setNewPoint('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
              <Info className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Manage About Points</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Existing Points */}
          <div className="space-y-2">
            {list.map((point, i) => (
              <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <input
                  value={point}
                  onChange={e => setList(p => p.map((pt, idx) => idx === i ? e.target.value : pt))}
                  className="flex-1 text-xs text-gray-700 bg-transparent outline-none border-b border-dashed border-gray-300 pb-0.5 leading-relaxed"
                />
                <button
                  onClick={() => setList(p => p.filter((_, idx) => idx !== i))}
                  className="w-6 h-6 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 space-y-2">
            <p className="text-xs font-bold text-gray-500">Add New Point</p>
            <div className="flex gap-2">
              <input
                value={newPoint}
                onChange={e => setNewPoint(e.target.value)}
                placeholder="e.g. Active Noise Cancellation..."
                onKeyDown={e => e.key === 'Enter' && addPoint()}
                className="flex-1 px-3 py-2 border-2 border-gray-200 focus:border-black rounded-lg text-xs outline-none text-gray-900 transition-all"
              />
              <button
                onClick={addPoint}
                className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(list)}
              className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
