'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import AccordionSection from './accordian-section';

const SPEC_ICON_MAP = {
  processor: 'Cpu', cpu: 'Cpu',
  power: 'Zap', watt: 'Zap', voltage: 'Zap',
  material: 'Layers', build: 'Layers',
  dimension: 'Ruler', size: 'Ruler', length: 'Ruler', width: 'Ruler', height: 'Ruler',
  weight: 'Wifi',
  wireless: 'Wifi', wifi: 'Wifi', bluetooth: 'Wifi',
  battery: 'Battery',
  display: 'MonitorSmartphone', screen: 'MonitorSmartphone',
  temperature: 'Thermometer', heat: 'Thermometer',
  package: 'Box', box: 'Box', contents: 'Box',
};

function getSpecIcon(type = '') {
  const key = type.toLowerCase();
  for (const [keyword, iconName] of Object.entries(SPEC_ICON_MAP)) {
    if (key.includes(keyword)) {
      // Map string to actual component - simplified for JSX
      const icons = {
        Cpu: () => <div className="w-3.5 h-3.5 bg-blue-500 rounded" />,
        Zap: () => <div className="w-3.5 h-3.5 bg-yellow-500 rounded rotate-45" />,
        Layers: () => <div className="w-3.5 h-3.5 bg-purple-500 rounded" />,
        Ruler: () => <div className="w-3.5 h-3.5 bg-green-500 rounded-[3px]" />,
        Wifi: () => <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full" />,
        Battery: () => <div className="w-3.5 h-3.5 bg-gray-500 rounded-[2px]" />,
        MonitorSmartphone: () => <div className="w-3.5 h-3.5 bg-pink-500 rounded" />,
        Thermometer: () => <div className="w-3.5 h-2 h-3.5 bg-red-500 rounded" />,
        Box: () => <div className="w-3.5 h-3.5 bg-brown-500 rounded" />,
      };
      return icons[iconName] || (() => <div className="w-3.5 h-3.5 bg-gray-500 rounded" />);
    }
  }
  return () => <div className="w-3.5 h-3.5 bg-gray-500 rounded" />;
}

export default function Specifications({ specifications = [] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (specifications.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            Product Specifications ({specifications.length})
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      <AccordionSection isOpen={isOpen}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {specifications.map((spec, index) => {
                const IconComponent = getSpecIcon(spec.type);
                return (
                  <motion.tr
                    key={index}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {/* Label cell */}
                    <td className="w-[38%] px-5 py-4 bg-gray-50 align-top">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <IconComponent />
                        </div>
                        <span className="font-semibold text-gray-700 leading-snug uppercase tracking-wide">
                          {spec.type}
                        </span>
                      </div>
                    </td>

                    {/* Divider */}
                    <td className="w-px bg-gray-200" />

                    {/* Value cell */}
                    <td className="px-5 py-4 bg-white align-top">
                      <span className="text-gray-800 leading-snug font-medium text-base">
                        {spec.description}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AccordionSection>
    </motion.div>
  );
}