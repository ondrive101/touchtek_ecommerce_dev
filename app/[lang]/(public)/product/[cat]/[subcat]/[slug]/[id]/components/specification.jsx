'use client';

import { ClipboardList } from 'lucide-react';

const formatLabel = (value = '') => {
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';

  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'object') {
    return Object.values(value).filter(Boolean).join(', ') || '—';
  }

  return String(value);
};

export default function Specifications({ specifications = {} }) {
  const specificationGroups =
    specifications &&
    typeof specifications === 'object' &&
    !Array.isArray(specifications)
      ? Object.entries(specifications).filter(
          ([, values]) =>
            values &&
            typeof values === 'object' &&
            !Array.isArray(values) &&
            Object.keys(values).length > 0
        )
      : [];

  if (!specificationGroups.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
          <ClipboardList className="h-5 w-5 text-gray-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Specifications
          </h2>
          <p className="text-sm text-gray-500">
            Product technical details
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {specificationGroups.map(([groupName, values]) => {
          const entries = Object.entries(values);

          return (
            <div key={groupName}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">
                {formatLabel(groupName)}
              </h3>

              <div className="overflow-hidden rounded-xl border border-gray-100">
                {entries.map(([label, value], index) => (
                  <div
                    key={label}
                    className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm sm:px-5 ${
                      index !== entries.length - 1
                        ? 'border-b border-gray-100'
                        : ''
                    }`}
                  >
                    <span className="font-medium text-gray-500">
                      {formatLabel(label)}
                    </span>

                    <span className="break-words text-right font-semibold text-gray-900">
                      {formatValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}