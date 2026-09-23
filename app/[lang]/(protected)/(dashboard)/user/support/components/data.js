import {
  AlertCircle,
  RotateCcw,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const ticketStatus = {
  created: {
    label: 'Created',
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  open: {
    label: 'Open',
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  in_progress: {
    label: 'In Progress',
    icon: RotateCcw,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  inprogress: {
    label: 'In Progress',
    icon: RotateCcw,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  closed: {
    label: 'Closed',
    icon: XCircle,
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
};

export const categoryIcons = {
  order: '📦',
  payment: '💳',
  delivery: '🚚',
  product: '🛍️',
  account: '👤',
  other: '💬',
};

export const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'created', label: 'Created' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'closed', label: 'Closed' },
];

export const categories = [
  { id: 'order', label: 'Order Issue', icon: '📦', desc: 'Delays, missing, wrong items' },
  { id: 'payment', label: 'Payment Issue', icon: '💳', desc: 'Refunds, failed transactions' },
  { id: 'delivery', label: 'Delivery Problem', icon: '🚚', desc: 'Not delivered, damaged' },
  { id: 'product', label: 'Product Query', icon: '🛍️', desc: 'Quality, description mismatch' },
  { id: 'account', label: 'Account Help', icon: '👤', desc: 'Login, profile, security' },
  { id: 'other', label: 'Other', icon: '💬', desc: 'Something else' },
];
