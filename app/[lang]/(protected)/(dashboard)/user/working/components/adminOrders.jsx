'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, Filter, ChevronDown, Eye,
  Truck, CheckCircle, Clock, XCircle, RotateCcw,
  Calendar, Download, RefreshCw, MoreVertical,
  MapPin, Phone, User, Tag, AlertTriangle,
  TrendingUp, ShoppingBag, X, ChevronLeft,
  ChevronRight, Edit3, Check, Circle
} from 'lucide-react';

// ── STATUS CONFIG ─────────────────────────────────────────────────────────────
const statusConfig = {
  delivered:       { label: 'Delivered',      icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-200',  dot: 'bg-green-500' },
  shipped:         { label: 'Shipped',         icon: Truck,         color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200',   dot: 'bg-blue-500' },
  processing:      { label: 'Processing',      icon: Clock,         color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-200', dot: 'bg-yellow-500' },
  pending_payment: { label: 'Pending Payment', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-200', dot: 'bg-orange-400' },
  cancelled:       { label: 'Cancelled',       icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200',    dot: 'bg-red-400' },
  returned:        { label: 'Returned',        icon: RotateCcw,     color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-200', dot: 'bg-purple-400' },
  partial_return:  { label: 'Partial Return',  icon: RotateCcw,     color: 'text-pink-600',   bg: 'bg-pink-50',    border: 'border-pink-200',   dot: 'bg-pink-400' },
};

const allStatuses = ['delivered','shipped','processing','pending_payment','cancelled','returned','partial_return'];

const paymentBadge = {
  paid:           'bg-green-50 text-green-700 border-green-200',
  pending:        'bg-orange-50 text-orange-600 border-orange-200',
  unpaid:         'bg-red-50 text-red-600 border-red-200',
  refunded:       'bg-purple-50 text-purple-700 border-purple-200',
  partial_refund: 'bg-pink-50 text-pink-700 border-pink-200',
};

const filterTabs = [
  { key: 'all',            label: 'All',     dot: null },
  { key: 'pending_payment',label: 'Pending',dot: 'bg-orange-400' },
  { key: 'processing',     label: 'Processing',     dot: 'bg-yellow-400' },
  { key: 'shipped',        label: 'Shipped',        dot: 'bg-blue-500' },
  { key: 'delivered',      label: 'Delivered',      dot: 'bg-green-500' },
  { key: 'partial_return', label: 'Partial Return', dot: 'bg-pink-400' },
  { key: 'returned',       label: 'Returned',       dot: 'bg-purple-400' },
  { key: 'cancelled',      label: 'Cancelled',      dot: 'bg-red-400' },
];

const months = [
  'All Months','Jan','Feb','Mar','Apr','May',
  'Jun','Jul','Aug','Sep','Oct','Nov','Dec',
];

const ITEMS_PER_PAGE = 6;

// ── TRACKING HISTORY GENERATOR ────────────────────────────────────────────────
const trackingHistory = {
  delivered: [
    { status: 'Order Placed',       desc: 'Your order has been placed successfully',         time: '10:32 AM', date: '01 Mar 2025', done: true  },
    { status: 'Payment Confirmed',  desc: 'Payment received via UPI',                        time: '10:33 AM', date: '01 Mar 2025', done: true  },
    { status: 'Processing',         desc: 'Seller is preparing your order',                  time: '02:00 PM', date: '01 Mar 2025', done: true  },
    { status: 'Shipped',            desc: 'Order picked up by courier partner',              time: '09:15 AM', date: '02 Mar 2025', done: true  },
    { status: 'Out for Delivery',   desc: 'Your order is out for delivery',                  time: '08:45 AM', date: '03 Mar 2025', done: true  },
    { status: 'Delivered',          desc: 'Order delivered successfully',                    time: '01:20 PM', date: '03 Mar 2025', done: true  },
  ],
  shipped: [
    { status: 'Order Placed',       desc: 'Your order has been placed successfully',         time: '03:15 PM', date: '18 Feb 2025', done: true  },
    { status: 'Payment Confirmed',  desc: 'Payment received via Credit Card',                time: '03:16 PM', date: '18 Feb 2025', done: true  },
    { status: 'Processing',         desc: 'Seller is preparing your order',                  time: '10:00 AM', date: '19 Feb 2025', done: true  },
    { status: 'Shipped',            desc: 'Order dispatched · TRK9823741',                   time: '04:30 PM', date: '19 Feb 2025', done: true  },
    { status: 'Out for Delivery',   desc: 'Arriving soon',                                   time: '',         date: 'Expected today', done: false },
    { status: 'Delivered',          desc: 'Pending delivery',                                time: '',         date: '—',             done: false },
  ],
  processing: [
    { status: 'Order Placed',       desc: 'Your order has been placed successfully',         time: '11:55 AM', date: '10 Jan 2025', done: true  },
    { status: 'Payment Confirmed',  desc: 'Payment received via UPI',                        time: '11:56 AM', date: '10 Jan 2025', done: true  },
    { status: 'Processing',         desc: 'Seller is preparing your order',                  time: '09:00 AM', date: '11 Jan 2025', done: true  },
    { status: 'Shipped',            desc: 'Awaiting dispatch',                               time: '',         date: '—',            done: false },
    { status: 'Out for Delivery',   desc: 'Pending',                                         time: '',         date: '—',            done: false },
    { status: 'Delivered',          desc: 'Pending',                                         time: '',         date: '—',            done: false },
  ],
  pending_payment: [
    { status: 'Order Initiated',    desc: 'Order created, awaiting payment',                 time: '02:10 PM', date: '15 Mar 2025', done: true  },
    { status: 'Payment Pending',    desc: 'Customer redirected to payment gateway',          time: '02:11 PM', date: '15 Mar 2025', done: true  },
    { status: 'Payment Confirmed',  desc: 'Waiting for payment confirmation',                time: '',         date: '—',            done: false },
    { status: 'Processing',         desc: 'Pending',                                         time: '',         date: '—',            done: false },
    { status: 'Shipped',            desc: 'Pending',                                         time: '',         date: '—',            done: false },
    { status: 'Delivered',          desc: 'Pending',                                         time: '',         date: '—',            done: false },
  ],
  cancelled: [
    { status: 'Order Placed',       desc: 'Order was placed',                                time: '09:10 AM', date: '15 Dec 2024', done: true  },
    { status: 'Payment Confirmed',  desc: 'Payment received',                                time: '09:11 AM', date: '15 Dec 2024', done: true  },
    { status: 'Cancelled',          desc: 'Order cancelled by customer',                     time: '11:30 AM', date: '15 Dec 2024', done: true, isCancelled: true },
  ],
  returned: [
    { status: 'Order Placed',       desc: 'Order was placed',                                time: '02:45 PM', date: '05 Nov 2024', done: true  },
    { status: 'Payment Confirmed',  desc: 'Payment received via Debit Card',                 time: '02:46 PM', date: '05 Nov 2024', done: true  },
    { status: 'Processing',         desc: 'Order prepared and packed',                       time: '10:00 AM', date: '06 Nov 2024', done: true  },
    { status: 'Shipped',            desc: 'Dispatched to customer',                          time: '03:00 PM', date: '06 Nov 2024', done: true  },
    { status: 'Delivered',          desc: 'Delivered to customer',                           time: '01:00 PM', date: '08 Nov 2024', done: true  },
    { status: 'Return Requested',   desc: 'Customer raised return request — Product defective', time: '05:00 PM', date: '09 Nov 2024', done: true },
    { status: 'Return Picked Up',   desc: 'Reverse pickup completed',                        time: '11:00 AM', date: '11 Nov 2024', done: true  },
    { status: 'Refund Processed',   desc: 'Full refund credited to original payment method', time: '04:00 PM', date: '12 Nov 2024', done: true  },
  ],
  partial_return: [
    { status: 'Order Placed',       desc: 'Order was placed',                                time: '09:30 AM', date: '18 Jan 2025', done: true  },
    { status: 'Payment Confirmed',  desc: 'Payment received via Card (POS)',                 time: '09:30 AM', date: '18 Jan 2025', done: true  },
    { status: 'Processing',         desc: 'Order prepared and packed',                       time: '11:00 AM', date: '18 Jan 2025', done: true  },
    { status: 'Delivered',          desc: 'All items delivered to customer',                 time: '03:00 PM', date: '18 Jan 2025', done: true  },
    { status: 'Partial Return',     desc: '1 item returned — Defective item in bundle',      time: '10:00 AM', date: '20 Jan 2025', done: true  },
    { status: 'Partial Refund',     desc: 'Refund of ₹2,199 credited',                       time: '06:00 PM', date: '21 Jan 2025', done: true  },
  ],
};

// ── ORDERS DATA ───────────────────────────────────────────────────────────────
const initialOrders = [
  {
    id: 'ORD-20250301', date: '01 Mar 2025', month: 'Mar', year: '2025', time: '10:32 AM',
    orderType: 'online',
    customer: { name: 'Vishal Singh',  email: 'vishal@example.com',  phone: '9876543210' },
    status: 'delivered', paymentMethod: 'UPI', paymentStatus: 'paid',
    total: 2499, subtotal: 2200, gst: 299, shipping: 0, discount: 150,
    address: '42, Sector 15, Rohini, New Delhi — 110085',
    items: [
      { name: 'Diamond Pro Wireless Earbuds', qty: 1, price: 1999, sku: 'SKU-EP-001', image: '🎧', returned: false },
      { name: 'Type-C Charging Cable',        qty: 2, price: 250,  sku: 'SKU-CB-012', image: '🔌', returned: false },
    ],
  },
  {
    id: 'ORD-20250315', date: '15 Mar 2025', month: 'Mar', year: '2025', time: '02:10 PM',
    orderType: 'online',
    customer: { name: 'Sneha Patel',   email: 'sneha@example.com',   phone: '9765432100' },
    status: 'pending_payment', paymentMethod: 'Credit Card', paymentStatus: 'pending',
    total: 3299, subtotal: 2999, gst: 300, shipping: 0, discount: 0,
    address: '5, Navrangpura, Ahmedabad — 380009',
    items: [
      { name: 'Mechanical Keyboard RGB', qty: 1, price: 2799, sku: 'SKU-KB-021', image: '⌨️', returned: false },
      { name: 'Mouse Pad XL',            qty: 1, price: 500,  sku: 'SKU-MP-004', image: '🖱️', returned: false },
    ],
  },
  {
    id: 'ORD-20250218', date: '18 Feb 2025', month: 'Feb', year: '2025', time: '03:15 PM',
    orderType: 'online',
    customer: { name: 'Vishal Singh',  email: 'vishal@example.com',  phone: '9876543210' },
    status: 'shipped', paymentMethod: 'Credit Card', paymentStatus: 'paid',
    total: 3999, subtotal: 3600, gst: 399, shipping: 0, discount: 0,
    address: 'Plot 7, Cyber City, DLF Phase 2, Gurugram — 122002',
    trackingId: 'TRK9823741',
    items: [
      { name: 'PowerBank 20000mAh Ultra', qty: 1, price: 3999, sku: 'SKU-PB-007', image: '🔋', returned: false },
    ],
  },
  {
    id: 'ORD-20250205', date: '05 Feb 2025', month: 'Feb', year: '2025', time: '11:00 AM',
    orderType: 'offline',
    customer: { name: 'Ravi Kumar',    email: 'ravi@example.com',    phone: '9900112233' },
    status: 'delivered', paymentMethod: 'Card (POS)', paymentStatus: 'paid',
    total: 1599, subtotal: 1450, gst: 149, shipping: 0, discount: 0,
    address: 'Store Pickup — Connaught Place, New Delhi',
    items: [
      { name: 'Wireless Mouse',   qty: 1, price: 999, sku: 'SKU-MS-018', image: '🖱️', returned: false },
      { name: 'Mousepad Premium', qty: 1, price: 600, sku: 'SKU-MP-003', image: '🟫', returned: false },
    ],
  },
  {
    id: 'ORD-20250222', date: '22 Feb 2025', month: 'Feb', year: '2025', time: '04:45 PM',
    orderType: 'online',
    customer: { name: 'Priya Sharma',  email: 'priya@example.com',   phone: '9123456780' },
    status: 'pending_payment', paymentMethod: 'Net Banking', paymentStatus: 'pending',
    total: 5999, subtotal: 5400, gst: 599, shipping: 0, discount: 0,
    address: '12, MG Road, Pune — 411001',
    items: [
      { name: '4K Monitor 27"', qty: 1, price: 5999, sku: 'SKU-MN-030', image: '🖥️', returned: false },
    ],
  },
  {
    id: 'ORD-20250110', date: '10 Jan 2025', month: 'Jan', year: '2025', time: '11:55 AM',
    orderType: 'online',
    customer: { name: 'Priya Sharma',  email: 'priya@example.com',   phone: '9123456780' },
    status: 'processing', paymentMethod: 'UPI', paymentStatus: 'paid',
    total: 1299, subtotal: 1150, gst: 149, shipping: 0, discount: 0,
    address: '12, MG Road, Pune — 411001',
    items: [
      { name: 'Bluetooth Speaker Mini', qty: 1, price: 1299, sku: 'SKU-SP-003', image: '🔊', returned: false },
    ],
  },
  {
    id: 'ORD-20250118', date: '18 Jan 2025', month: 'Jan', year: '2025', time: '09:30 AM',
    orderType: 'offline',
    customer: { name: 'Meera Nair',    email: 'meera@example.com',   phone: '9654000123' },
    status: 'partial_return', paymentMethod: 'Card (POS)', paymentStatus: 'partial_refund',
    total: 6797, subtotal: 6200, gst: 597, shipping: 0, discount: 0,
    address: 'Store Pickup — Brigade Road, Bengaluru',
    returnReason: 'Defective item in bundle',
    refundStatus: 'Partial Refund ₹2,199',
    items: [
      { name: 'Noise Cancelling Headphones', qty: 1, price: 3499, sku: 'SKU-HP-015', image: '🎵', returned: false },
      { name: 'USB Hub 7-in-1',              qty: 1, price: 1099, sku: 'SKU-UH-008', image: '🖥️', returned: false },
      { name: 'Laptop Stand Foldable',       qty: 1, price: 799,  sku: 'SKU-LS-011', image: '💻', returned: false },
      { name: 'Webcam HD 1080p',             qty: 1, price: 1400, sku: 'SKU-WC-019', image: '📷', returned: true  },
    ],
  },
  {
    id: 'ORD-20241215', date: '15 Dec 2024', month: 'Dec', year: '2024', time: '09:10 AM',
    orderType: 'online',
    customer: { name: 'Rahul Mehta',   email: 'rahul@example.com',   phone: '9988776655' },
    status: 'cancelled', paymentMethod: 'Debit Card', paymentStatus: 'unpaid',
    total: 899, subtotal: 800, gst: 99, shipping: 0, discount: 0,
    address: '7, Anna Nagar, Chennai — 600040',
    cancelReason: 'Cancelled by customer',
    items: [
      { name: 'Phone Stand Adjustable', qty: 1, price: 599, sku: 'SKU-ST-010', image: '📱', returned: false },
      { name: 'Screen Cleaning Kit',    qty: 1, price: 300, sku: 'SKU-CK-005', image: '🧹', returned: false },
    ],
  },
  {
    id: 'ORD-20241228', date: '28 Dec 2024', month: 'Dec', year: '2024', time: '06:00 PM',
    orderType: 'online',
    customer: { name: 'Arjun Kapoor',  email: 'arjun@example.com',   phone: '9012345678' },
    status: 'partial_return', paymentMethod: 'UPI', paymentStatus: 'partial_refund',
    total: 8596, subtotal: 7800, gst: 796, shipping: 0, discount: 500,
    address: '23, Salt Lake, Kolkata — 700091',
    returnReason: 'Wrong size delivered for one item',
    refundStatus: 'Partial Refund ₹3,999',
    items: [
      { name: 'Smart Watch Series X', qty: 1, price: 5499, sku: 'SKU-WC-002', image: '⌚', returned: false },
      { name: 'Watch Charging Dock',  qty: 1, price: 999,  sku: 'SKU-WD-007', image: '🔋', returned: false },
      { name: 'Sport Watch Strap',    qty: 1, price: 499,  sku: 'SKU-WS-003', image: '⌚', returned: false },
      { name: 'Fitness Tracker Band', qty: 1, price: 3999, sku: 'SKU-FT-011', image: '💪', returned: true  },
    ],
  },
  {
    id: 'ORD-20241105', date: '05 Nov 2024', month: 'Nov', year: '2024', time: '02:45 PM',
    orderType: 'online',
    customer: { name: 'Ananya Joshi',  email: 'ananya@example.com',  phone: '9845123670' },
    status: 'returned', paymentMethod: 'Debit Card', paymentStatus: 'refunded',
    total: 5499, subtotal: 4999, gst: 500, shipping: 0, discount: 300,
    address: '88, Indiranagar, Bengaluru — 560038',
    returnReason: 'Product defective',
    refundStatus: 'Full Refund Processed',
    items: [
      { name: 'Smart Watch Series X', qty: 1, price: 5499, sku: 'SKU-WC-002', image: '⌚', returned: true },
    ],
  },
  {
    id: 'ORD-20241120', date: '20 Nov 2024', month: 'Nov', year: '2024', time: '01:15 PM',
    orderType: 'offline',
    customer: { name: 'Dev Malhotra',  email: 'dev@example.com',     phone: '9654321098' },
    status: 'delivered', paymentMethod: 'Card (POS)', paymentStatus: 'paid',
    total: 2799, subtotal: 2550, gst: 249, shipping: 0, discount: 0,
    address: 'Store Pickup — Banjara Hills, Hyderabad',
    items: [
      { name: 'Noise Cancelling Earbuds', qty: 1, price: 1999, sku: 'SKU-EB-022', image: '🎧', returned: false },
      { name: 'Carry Case',               qty: 1, price: 800,  sku: 'SKU-CC-006', image: '👜', returned: false },
    ],
  },
  {
    id: 'ORD-20241010', date: '10 Oct 2024', month: 'Oct', year: '2024', time: '12:00 PM',
    orderType: 'online',
    customer: { name: 'Sneha Patel',   email: 'sneha@example.com',   phone: '9765432100' },
    status: 'shipped', paymentMethod: 'Credit Card', paymentStatus: 'paid',
    total: 2199, subtotal: 1999, gst: 200, shipping: 0, discount: 0,
    address: '5, Navrangpura, Ahmedabad — 380009',
    trackingId: 'TRK1122334',
    items: [
      { name: 'Mechanical Keyboard', qty: 1, price: 2199, sku: 'SKU-KB-020', image: '⌨️', returned: false },
    ],
  },
  {
    id: 'ORD-20241025', date: '25 Oct 2024', month: 'Oct', year: '2024', time: '03:50 PM',
    orderType: 'online',
    customer: { name: 'Karan Verma',   email: 'karan@example.com',   phone: '9871234560' },
    status: 'pending_payment', paymentMethod: 'UPI', paymentStatus: 'pending',
    total: 1099, subtotal: 999, gst: 100, shipping: 0, discount: 0,
    address: '14, Civil Lines, Jaipur — 302006',
    items: [
      { name: 'USB Hub 7-in-1', qty: 1, price: 1099, sku: 'SKU-UH-008', image: '🖥️', returned: false },
    ],
  },
];

// ── ORDER TRACKING TIMELINE ───────────────────────────────────────────────────
function OrderTracking({ order }) {
  const history = trackingHistory[order.status] || trackingHistory.processing;
  const doneCount = history.filter(h => h.done).length;

  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Truck className="w-3.5 h-3.5" /> Order Tracking
        <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full normal-case tracking-normal">
          {doneCount}/{history.length} steps
        </span>
      </p>

      <div className="relative">
        {history.map((step, i) => {
          const isLast    = i === history.length - 1;
          const isDone    = step.done;
          const isActive  = isDone && (isLast || !history[i + 1]?.done);
          const isCancelled = step.isCancelled;

          return (
            <div key={i} className="flex gap-3 relative">
              {/* Line */}
              {!isLast && (
                <div className={`absolute left-[13px] top-7 w-0.5 h-full -mb-1 ${
                  isDone && history[i + 1]?.done ? 'bg-gray-900' : 'bg-gray-200'
                }`} style={{ height: 'calc(100% - 4px)' }} />
              )}

              {/* Dot */}
              <div className="flex-shrink-0 mt-0.5 z-10">
                {isCancelled ? (
                  <div className="w-7 h-7 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center">
                    <XCircle className="w-3.5 h-3.5 text-red-500" />
                  </div>
                ) : isDone ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-gray-900 border-2 border-gray-900 shadow-md'
                      : 'bg-gray-900 border-2 border-gray-900'
                  }`}>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    <Circle className="w-3 h-3 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`pb-5 flex-1 ${isLast ? 'pb-0' : ''}`}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className={`text-xs font-bold ${
                      isCancelled ? 'text-red-600' : isDone ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.status}
                      {isActive && !isCancelled && (
                        <span className="ml-2 text-[10px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </p>
                    <p className={`text-xs mt-0.5 ${isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                      {step.desc}
                    </p>
                  </div>
                  {(step.time || step.date) && isDone && (
                    <div className="text-right flex-shrink-0">
                      {step.time && <p className="text-[10px] font-semibold text-gray-500">{step.time}</p>}
                      {step.date && <p className="text-[10px] text-gray-400">{step.date}</p>}
                    </div>
                  )}
                  {!isDone && step.date === '—' && (
                    <span className="text-[10px] text-gray-300 flex-shrink-0">Pending</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ORDER DETAIL MODAL ────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onStatusChange }) {
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'tracking'
  const status        = statusConfig[order.status];
  const returnedItems = order.items.filter(i => i.returned);

  const handleStatusSave = () => {
    onStatusChange(order.id, selectedStatus);
    setEditingStatus(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10 rounded-t-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900 font-mono">{order.id}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    order.orderType === 'online'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {order.orderType === 'online' ? '🌐 Online' : '🏪 Offline'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{order.date} · {order.time}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {[
              { key: 'details',  label: 'Order Details', icon: Package },
              { key: 'tracking', label: 'Tracking',      icon: Truck   },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* ── DETAILS TAB ── */}
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                {/* Pending Payment Alert */}
                {order.status === 'pending_payment' && (
                  <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-orange-700">Payment Pending</p>
                      <p className="text-xs text-orange-600 mt-0.5">
                        Customer is on the payment screen. Order auto-cancels if payment is not completed within 15 minutes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Status + Payment */}
                <div className="flex items-center gap-3 flex-wrap">
                  {editingStatus ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                        className="pl-3 pr-8 py-1.5 border-2 border-black rounded-lg text-xs font-bold outline-none text-gray-900 appearance-none"
                      >
                        {allStatuses.map(s => (
                          <option key={s} value={s}>{statusConfig[s].label}</option>
                        ))}
                      </select>
                      <button onClick={handleStatusSave} className="w-7 h-7 bg-green-500 text-white rounded-lg flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingStatus(false)} className="w-7 h-7 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.color} ${status.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                      <button onClick={() => setEditingStatus(true)} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                        <Edit3 className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${paymentBadge[order.paymentStatus]}`}>
                    {order.paymentStatus.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full font-medium">
                    {order.paymentMethod}
                  </span>
                </div>

                {/* Customer */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-900">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {order.customer.phone}
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    {order.address}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Items · {order.items.length} total
                    {returnedItems.length > 0 && (
                      <span className="ml-2 text-pink-600 font-bold">({returnedItems.length} returned)</span>
                    )}
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
                        item.returned ? 'bg-pink-50 border-pink-200 opacity-75' : 'bg-gray-50 border-gray-100'
                      }`}>
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-xl flex-shrink-0 shadow-sm relative">
                          {item.image}
                          {item.returned && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                              <RotateCcw className="w-2.5 h-2.5 text-white" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                            {item.returned && (
                              <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full border border-pink-200 flex-shrink-0">
                                Returned
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">{item.sku} · Qty: {item.qty}</p>
                        </div>
                        <p className={`text-sm font-bold flex-shrink-0 ${item.returned ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partial Return Summary */}
                {order.status === 'partial_return' && (
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-pink-700 mb-2 flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" /> Partial Return Summary
                    </p>
                    <div className="space-y-1 text-xs text-pink-700">
                      <div className="flex justify-between"><span>Items returned</span><span className="font-bold">{returnedItems.length} of {order.items.length}</span></div>
                      <div className="flex justify-between"><span>Return reason</span><span className="font-bold">{order.returnReason}</span></div>
                      <div className="flex justify-between"><span>Refund status</span><span className="font-bold text-green-700">{order.refundStatus}</span></div>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Summary</p>
                  <div className="flex justify-between text-xs text-gray-600"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-gray-600"><span>GST</span><span>₹{order.gst.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-gray-600"><span>Shipping</span><span className="text-green-600 font-semibold">Free</span></div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-xs text-green-600 font-semibold">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount</span>
                      <span>− ₹{order.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-gray-900">
                    <span>Total</span><span>₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Extra Strips */}
                {order.trackingId && (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-semibold text-blue-700">Tracking ID: <span className="font-mono font-bold">{order.trackingId}</span></p>
                  </div>
                )}
                {order.cancelReason && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <p className="text-xs font-semibold text-red-600">{order.cancelReason}</p>
                  </div>
                )}
                {order.status === 'returned' && order.refundStatus && (
                  <div className="flex items-center justify-between gap-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-purple-600" />
                      <p className="text-xs font-semibold text-purple-700">{order.returnReason}</p>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-lg">{order.refundStatus}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── TRACKING TAB ── */}
            {activeTab === 'tracking' && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
              >
                <OrderTracking order={order} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders]                   = useState(initialOrders);
  const [activeFilter, setActiveFilter]       = useState('all');
  const [search, setSearch]                   = useState('');
  const [selectedOrder, setSelectedOrder]     = useState(null);
  const [currentPage, setCurrentPage]         = useState(1);
  const [sortBy, setSortBy]                   = useState('date_desc');
  const [actionMenuId, setActionMenuId]       = useState(null);
  const [selectedMonth, setSelectedMonth]     = useState('All Months');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');

  const resetPage = () => setCurrentPage(1);

  // ── STATS ── count + amount
  const stats = useMemo(() => {
    const revenue = orders
      .filter(o => !['cancelled','returned','pending_payment'].includes(o.status))
      .reduce((s, o) => s + o.total, 0);

    return [
      {
        label: 'Total Orders',
        count: orders.length,
        amount: `₹${orders.reduce((s,o) => s+o.total,0).toLocaleString()}`,
        icon: Package, gradient: 'from-gray-800 to-black',
      },
      {
        label: 'Pending Payment',
        count: orders.filter(o => o.status === 'pending_payment').length,
        amount: `₹${orders.filter(o => o.status === 'pending_payment').reduce((s,o) => s+o.total,0).toLocaleString()}`,
        icon: AlertTriangle, gradient: 'from-orange-400 to-orange-600',
      },
      {
        label: 'Processing',
        count: orders.filter(o => o.status === 'processing').length,
        amount: `₹${orders.filter(o => o.status === 'processing').reduce((s,o) => s+o.total,0).toLocaleString()}`,
        icon: Clock, gradient: 'from-yellow-400 to-orange-500',
      },
      {
        label: 'Shipped',
        count: orders.filter(o => o.status === 'shipped').length,
        amount: `₹${orders.filter(o => o.status === 'shipped').reduce((s,o) => s+o.total,0).toLocaleString()}`,
        icon: Truck, gradient: 'from-blue-500 to-blue-700',
      },
      {
        label: 'Delivered',
        count: orders.filter(o => o.status === 'delivered').length,
        amount: `₹${orders.filter(o => o.status === 'delivered').reduce((s,o) => s+o.total,0).toLocaleString()}`,
        icon: CheckCircle, gradient: 'from-green-500 to-green-700',
      },
      {
        label: 'Partial Return',
        count: orders.filter(o => o.status === 'partial_return').length,
        amount: `₹${orders.filter(o => o.status === 'partial_return').reduce((s,o) => s+o.total,0).toLocaleString()}`,
        icon: RotateCcw, gradient: 'from-pink-500 to-pink-700',
      },
      {
        label: 'Returned',
        count: orders.filter(o => o.status === 'returned').length,
        amount: `₹${orders.filter(o => o.status === 'returned').reduce((s,o) => s+o.total,0).toLocaleString()}`,
        icon: RotateCcw, gradient: 'from-purple-500 to-purple-700',
      },
      {
        label: 'Net Revenue',
        count: orders.filter(o => !['cancelled','returned','pending_payment'].includes(o.status)).length + ' orders',
        amount: `₹${revenue.toLocaleString()}`,
        icon: TrendingUp, gradient: 'from-indigo-500 to-indigo-700',
        highlight: true,
      },
    ];
  }, [orders]);

  // ── FILTERED + SORTED ──
  const filtered = useMemo(() => {
    let list = orders.filter(o => {
      const matchStatus = activeFilter === 'all' || o.status === activeFilter;
      const matchMonth  = selectedMonth === 'All Months' || o.month === selectedMonth;
      const matchType   = orderTypeFilter === 'all' || o.orderType === orderTypeFilter;
      const q = search.toLowerCase();
      const matchSearch =
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q));
      return matchStatus && matchMonth && matchType && matchSearch;
    });
    return [...list].sort((a, b) => {
      if (sortBy === 'date_desc')  return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc')   return new Date(a.date) - new Date(b.date);
      if (sortBy === 'total_desc') return b.total - a.total;
      if (sortBy === 'total_asc')  return a.total - b.total;
      return 0;
    });
  }, [orders, activeFilter, search, sortBy, selectedMonth, orderTypeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* ── HERO HEADER ── */}
      <section
        className="relative overflow-hidden text-white pt-14 pb-24"
        style={{ background: 'linear-gradient(135deg, #111827 0%, #000000 50%, #1f2937 100%)' }}
      >
        <div className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 0%, #6366f1 0%, transparent 55%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-medium">Admin Panel</span>
              <span className="text-white/30">·</span>
              <span className="text-xs font-bold">Order Management</span>
            </div>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-1">
                  Orders
                </h1>
                <p className="text-gray-400 text-sm">{orders.length} total · Manage, track and update order statuses</p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
                  <Download className="w-4 h-4" /> Export CSV
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20 relative z-10 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`bg-white rounded-2xl shadow-lg border p-3.5 flex flex-col gap-1.5 hover:shadow-xl transition-shadow ${
                stat.highlight ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-gray-100'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              {/* Amount — primary */}
              <p className="text-sm font-bold text-gray-900 leading-tight">{stat.amount}</p>
              {/* Count — secondary */}
              <p className="text-[10px] font-semibold text-gray-400">
                {typeof stat.count === 'string' ? stat.count : `${stat.count} order${stat.count !== 1 ? 's' : ''}`}
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── MAIN TABLE CARD ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* ── FILTERS BAR ── */}
          <div className="px-5 py-4 border-b border-gray-100 space-y-3">

            {/* Row 1: Search + Month + Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); resetPage(); }}
                  placeholder="Search by order ID, customer, product..."
                  className="w-full pl-9 pr-9 py-2.5 border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                />
                {search && (
                  <button onClick={() => { setSearch(''); resetPage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative flex-shrink-0">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select value={selectedMonth} onChange={e => { setSelectedMonth(e.target.value); resetPage(); }}
                  className="pl-9 pr-8 py-2.5 border-2 border-gray-200 focus:border-black rounded-xl text-sm outline-none text-gray-900 appearance-none bg-white font-medium min-w-[140px]">
                  {months.map(m => <option key={m}>{m}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative flex-shrink-0">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2.5 border-2 border-gray-200 focus:border-black rounded-xl text-sm outline-none text-gray-900 appearance-none bg-white font-medium">
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="total_desc">Highest Amount</option>
                  <option value="total_asc">Lowest Amount</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Row 2: Online/Offline + Status pill toggles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
                {[
                  { key: 'all',     label: 'All',     emoji: null },
                  { key: 'online',  label: 'Online',  emoji: '🌐' },
                  { key: 'offline', label: 'Offline', emoji: '🏪' },
                ].map(opt => (
                  <button key={opt.key}
                    onClick={() => { setOrderTypeFilter(opt.key); resetPage(); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      orderTypeFilter === opt.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {opt.emoji && <span>{opt.emoji}</span>}
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto scrollbar-hide flex-1">
                {filterTabs.map(tab => {
                  const count = tab.key === 'all'
                    ? orders.length
                    : orders.filter(o => o.status === tab.key).length;
                  return (
                    <button key={tab.key}
                      onClick={() => { setActiveFilter(tab.key); resetPage(); }}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeFilter === tab.key
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {tab.dot && (
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          activeFilter === tab.key ? tab.dot : 'bg-gray-400'
                        }`} />
                      )}
                      {tab.label}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        activeFilter === tab.key ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-500'
                      }`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── TABLE ── */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Order ID','Type','Customer','Items','Date','Amount','Payment','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-indigo-400" />
                          </div>
                          <p className="text-sm font-bold text-gray-700">No orders found</p>
                          <p className="text-xs text-gray-400">{search ? `No results for "${search}"` : 'No orders match this filter'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginated.map((order, i) => {
                    const st = statusConfig[order.status];
                    const returnedCount = order.items.filter(item => item.returned).length;
                    return (
                      <motion.tr key={order.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-mono font-bold text-gray-900">{order.id}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{order.time}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${
                            order.orderType === 'online'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {order.orderType === 'online' ? '🌐' : '🏪'}
                            {order.orderType === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
                              {order.customer.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate max-w-[100px]">{order.customer.name}</p>
                              <p className="text-[10px] text-gray-400 truncate max-w-[100px]">{order.customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-0.5">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <span key={idx} className={`text-base ${item.returned ? 'opacity-40' : ''}`} title={item.returned ? `${item.name} (returned)` : item.name}>
                                {item.image}
                              </span>
                            ))}
                            {order.items.length > 3 && <span className="text-[10px] text-gray-400 font-bold self-center ml-0.5">+{order.items.length - 3}</span>}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            {returnedCount > 0 && <span className="text-pink-500 font-bold ml-1">· {returnedCount} returned</span>}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-semibold text-gray-700">{order.date}</p>
                          <p className="text-[10px] text-gray-400">{order.month} {order.year}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                          {order.discount > 0 && <p className="text-[10px] text-green-600 font-semibold">−₹{order.discount}</p>}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${paymentBadge[order.paymentStatus]}`}>
                            {order.paymentStatus.replace('_', ' ')}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-0.5">{order.paymentMethod}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.color} ${st.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${['processing','pending_payment'].includes(order.status) ? 'animate-pulse' : ''}`} />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedOrder(order)}
                              className="w-8 h-8 bg-gray-100 hover:bg-black hover:text-white text-gray-500 rounded-lg flex items-center justify-center transition-all"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </motion.button>
                            <div className="relative">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => setActionMenuId(p => p === order.id ? null : order.id)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center transition-all"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </motion.button>
                              <AnimatePresence>
                                {actionMenuId === order.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                                    className="absolute right-0 top-10 z-30 bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 min-w-[170px]"
                                  >
                                    <p className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1">Change Status</p>
                                    {allStatuses.map(s => (
                                      <button key={s}
                                        onClick={() => { handleStatusChange(order.id, s); setActionMenuId(null); }}
                                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-gray-50 ${order.status === s ? 'text-black font-bold' : 'text-gray-600'}`}
                                      >
                                        <span className={`w-2 h-2 rounded-full ${statusConfig[s].dot}`} />
                                        {statusConfig[s].label}
                                        {order.status === s && <Check className="w-3 h-3 ml-auto" />}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–<span className="font-bold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-bold text-gray-900">{filtered.length}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </motion.button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.button key={page} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page ? 'bg-black text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>

      {actionMenuId && (
        <div className="fixed inset-0 z-20" onClick={() => setActionMenuId(null)} />
      )}
    </div>
  );
}
