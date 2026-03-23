'use client';

import { ShieldCheck, RotateCcw, Truck, Receipt } from 'lucide-react';

const features = [
  { icon: ShieldCheck, label: '15-18 Month Warranty', color: 'text-blue-600' },
  { icon: RotateCcw, label: '7-Day Replacement', color: 'text-green-600' },
  { icon: Truck, label: 'Free Delivery', color: 'text-purple-600' },
  { icon: Receipt, label: 'GST Included', color: 'text-orange-600' },
];

export default function ProductFeatures() {
  return (
    <div className="w-full px-4 py-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center flex-1 p-2 text-xs text-center text-gray-700 sm:text-sm sm:p-3">
            <feature.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${feature.color} mb-1 sm:mb-2 flex-shrink-0`} strokeWidth={2} />
            <span className="font-medium leading-tight tracking-tight">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
