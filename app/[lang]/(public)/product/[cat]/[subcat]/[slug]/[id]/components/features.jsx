'use client';

import { ShieldCheck, Truck, Receipt, BadgeCheck } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    label: '15–18 Month Warranty',
    sublabel: 'Manufacturer backed',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: Truck,
    label: 'Free Delivery',
    sublabel: 'On all orders',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: Receipt,
    label: 'GST Included',
    sublabel: 'No hidden charges',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    icon: BadgeCheck,
    label: 'Genuine Product',
    sublabel: '100% authentic',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
];

export default function ProductFeatures() {
  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-center gap-2 p-3 sm:p-4 rounded-xl border ${feature.bg} ${feature.border}`}
          >
            <div className={`p-2 rounded-lg bg-white shadow-sm border ${feature.border}`}>
              <feature.icon
                className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`}
                strokeWidth={2}
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
                {feature.label}
              </p>
              <p className="text-xs text-gray-500 leading-tight hidden sm:block">
                {feature.sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}