'use client';

import { motion} from 'framer-motion';
import { Truck, X, MapPin, CheckCircle} from 'lucide-react';
import Image from 'next/image';
import dayjs from "dayjs";
import { getOrderStatusTimelineConfig } from "@/lib/utils/functions";



export default function TrackOrderDialog({ order, onClose, timeline = [] }) {
  if (!order) return null;
  const steps = timeline.map((step)=>{
    const statusConfig = getOrderStatusTimelineConfig(step?.orderStatus)
  
    return {
      label: statusConfig?.label,
      desc:statusConfig?.desc,
      time:dayjs(step?.timeStamp).format('DD MMM, hh:mm A'),
      done:true
    }

  });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Track Order</h3>
              <p className="text-xs text-gray-500 font-mono">{order.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tracking ID + ETA */}
          {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Tracking ID</p>
                <p className="text-base font-bold text-gray-900 font-mono">
                  {order.trackingId || 'TRK' + order.id.slice(-7)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">
                  {order.status === 'delivered' ? 'Delivered On' : 'Est. Delivery'}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {order.deliveredOn || order.estimatedDelivery || '—'}
                </p>
              </div>
            </div>
          </div> */}

          {/* Delivery Address */}
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-700 mb-0.5">Delivering to</p>
              <p className="text-xs text-gray-500">{order.address}</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Delivery Timeline</p>
            <div className="relative">
              {steps.map((step, idx, arr) => {
                const isLast    = idx === arr.length - 1;
                const isCurrent = step.done && (isLast || !arr[idx + 1]?.done);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex gap-4 relative"
                  >
                    {/* Connector line */}
                    {!isLast && (
                      <div className="absolute left-[17px] top-8 bottom-0 w-0.5 z-0">
                        <div className={`h-full w-full ${step.done ? 'bg-gradient-to-b from-green-400 to-green-300' : 'bg-gray-200'}`} />
                      </div>
                    )}

                    {/* Dot */}
                    <div className="flex-shrink-0 mt-1 relative z-10">
                      {step.done ? (
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.08 + 0.1, type: 'spring', stiffness: 300 }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-green-400 to-green-600`}
                        >
                         <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-bold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                           
                          </p>
                          <p className={`text-xs mt-0.5 ${step.done ? 'text-gray-500' : 'text-gray-300'}`}>
                            {step.desc}
                          </p>
                        </div>
                        {step.done && (
                          <span className="text-xs text-gray-400 font-medium whitespace-nowrap flex-shrink-0">
                            {step.time}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Items in shipment */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-700 mb-3">Items in Shipment</p>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-slate-50 shadow-sm group-hover:shadow-md transition-all">
                    {item.image !== "" && (
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />

                    ) }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate capitalize">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-bold text-sm shadow-lg"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
