
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import AccordionSection from './accordian-section';

export default function About({ about = [] }) {
  const [isOpen, setIsOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const VISIBLE_COUNT = 5;
  const hasMore = about.length > VISIBLE_COUNT;
  const visibleItems = expanded ? about : about.slice(0, VISIBLE_COUNT);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            About This Item
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      <AccordionSection isOpen={isOpen}>
        <ul className="divide-y divide-gray-100">
          {visibleItems.map((point, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex-shrink-0 mt-2">
                <div className="w-2 h-2 rounded-full bg-gray-800" />
              </div>
              <p className="text-sm text-gray-800 leading-relaxed flex-1">{point}</p>
            </motion.li>
          ))}
        </ul>

        {hasMore && (
          <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-center">
            <button
              onClick={() => setExpanded((p) => !p)}
              className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              {expanded ? 'See less' : `See all ${about.length} features`}
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </AccordionSection>
    </motion.div>
  );
}
