// components/product/Reviews.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronDown, ChevronUp, BarChart2, BadgeCheck, Quote, ThumbsUp, ThumbsDown, User, Star } from 'lucide-react';
import StarRating from './star-rating';
import AccordionSection from './accordian-section';

// Dummy reviews - replace with real data
const DUMMY_REVIEWS = [
  {
    id: 1, name: 'Rahul Sharma', rating: 5, date: 'Feb 12, 2026', title: 'Excellent product!', body: 'Really impressed with the build quality.', helpful: 24, verified: true,
  },
  {
    id: 2, name: 'Priya Mehta', rating: 4, date: 'Jan 28, 2026', title: 'Great value for money', body: 'Very good product overall. Sleek design.', helpful: 18, verified: true,
  },
  {
    id: 3, name: 'Amit Verma', rating: 5, date: 'Jan 15, 2026', title: 'Would definitely recommend', body: 'Premium quality and great finish.', helpful: 31, verified: false,
  },
];

export default function Reviews() {
  const [isOpen, setIsOpen] = useState(true);
  const totalReviews = DUMMY_REVIEWS.length;
  const averageRating = DUMMY_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = DUMMY_REVIEWS.filter((r) => r.rating === star).length;
    return { star, count, percentage: (count / totalReviews) * 100 };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16 }}
      className="rounded-2xl overflow-hidden shadow-md border border-gray-100"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={Math.round(averageRating)} size="w-3 h-3" />
              <p className="text-xs text-gray-500">
                {averageRating.toFixed(1)} · {totalReviews} reviews
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <BarChart2 className="w-3 h-3" />
            {averageRating.toFixed(1)} / 5
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      <AccordionSection isOpen={isOpen}>
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="px-6 py-6 bg-white border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="flex flex-col items-center justify-center w-36 h-36 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex-shrink-0">
                <span className="text-5xl font-black text-gray-900 leading-none">
                  {averageRating.toFixed(1)}
                </span>
                <StarRating rating={Math.round(averageRating)} size="w-4 h-4" />
                <p className="text-xs text-gray-500 mt-1">{totalReviews} verified</p>
              </div>
              <div className="flex-1 w-full space-y-2.5">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12 justify-end flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-700">{star}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-5 text-right flex-shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {DUMMY_REVIEWS.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                            <BadgeCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="w-4 h-4" />
                </div>

                <div className="relative pl-5 mb-3">
                  <Quote className="absolute left-0 top-0 w-3.5 h-3.5 text-gray-300" />
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    {review.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.body}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">Helpful?</span>
                  <button className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Yes ({review.helpful})
                  </button>
                  <button className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    No
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AccordionSection>
    </motion.div>
  );
}
