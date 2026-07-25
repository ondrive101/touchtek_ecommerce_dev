
'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Quote,
  User,
  Star,
} from 'lucide-react';
import StarRating from './star-rating';
import AccordionSection from './accordian-section';

const formatReviewDate = (dateValue) => {
  if (!dateValue) return '';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const getInitials = (name = '') => {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

export default function Reviews({ reviews = [] }) {
  const [isOpen, setIsOpen] = useState(true);

  const normalizedReviews = useMemo(() => {
    if (!Array.isArray(reviews)) return [];

    return reviews
      .filter((review) => review?.review || review?.stars)
      .map((review, index) => ({
        id: review?.id || `review-${index}`,
        name: review?.name?.trim() || 'Anonymous Customer',
        review: review?.review?.trim() || '',
        stars: Math.min(5, Math.max(1, Number(review?.stars) || 1)),
        createdAt: review?.createdAt,
      }));
  }, [reviews]);

  const totalReviews = normalizedReviews.length;

  const averageRating = useMemo(() => {
    if (!totalReviews) return 0;

    const totalStars = normalizedReviews.reduce(
      (sum, review) => sum + review.stars,
      0
    );

    return totalStars / totalReviews;
  }, [normalizedReviews, totalReviews]);

  const ratingDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = normalizedReviews.filter(
        (review) => review.stars === star
      ).length;

      return {
        star,
        count,
        percentage: totalReviews ? (count / totalReviews) * 100 : 0,
      };
    });
  }, [normalizedReviews, totalReviews]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16 }}
      className="overflow-hidden rounded-2xl border border-gray-100 shadow-md"
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between bg-white px-6 py-5 transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <MessageSquare className="h-5 w-5 text-amber-600" />
          </div>

          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">
              Customer Reviews
            </h3>

            {totalReviews > 0 ? (
              <div className="mt-0.5 flex items-center gap-2">
                <StarRating
                  rating={Math.round(averageRating)}
                  size="w-3 h-3"
                />
                <p className="text-xs text-gray-500">
                  {averageRating.toFixed(1)} · {totalReviews}{' '}
                  {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            ) : (
              <p className="mt-0.5 text-xs text-gray-500">
                No reviews yet
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalReviews > 0 && (
            <span className="hidden items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 sm:inline-flex">
              <BarChart2 className="h-3 w-3" />
              {averageRating.toFixed(1)} / 5
            </span>
          )}

          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      <AccordionSection isOpen={isOpen}>
        {totalReviews === 0 ? (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-12 text-center">
            <MessageSquare className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <h4 className="font-semibold text-gray-800">No reviews yet</h4>
            <p className="mt-1 text-sm text-gray-500">
              Be the first customer to review this product.
            </p>
          </div>
        ) : (
          <div className="border-t border-gray-100 bg-gray-50">
            {/* Rating overview */}
            <div className="border-b border-gray-100 bg-white px-6 py-6">
              <div className="flex flex-col items-center gap-8 sm:flex-row">
                <div className="flex h-36 w-36 flex-shrink-0 flex-col items-center justify-center rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50">
                  <span className="text-5xl font-black leading-none text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>

                  <StarRating
                    rating={Math.round(averageRating)}
                    size="w-4 h-4"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                <div className="w-full flex-1 space-y-2.5">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex w-12 flex-shrink-0 items-center justify-end gap-1">
                        <span className="text-sm font-semibold text-gray-700">
                          {star}
                        </span>
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      </div>

                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            duration: 0.7,
                            delay: 0.1,
                            ease: 'easeOut',
                          }}
                        />
                      </div>

                      <span className="w-5 flex-shrink-0 text-right text-sm text-gray-500">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual reviews */}
            <div className="space-y-4 px-6 py-5">
              {normalizedReviews.map((review, index) => (
                <motion.article
                  key={review.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
                        {getInitials(review.name) ? (
                          <span className="text-xs font-bold text-gray-600">
                            {getInitials(review.name)}
                          </span>
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>

                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {review.name}
                        </span>

                        {review.createdAt && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            {formatReviewDate(review.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <StarRating rating={review.stars} size="w-4 h-4" />
                  </div>

                  <div className="relative pl-5">
                    <Quote className="absolute left-0 top-0 h-3.5 w-3.5 text-gray-300" />
                    <p className="text-sm leading-relaxed text-gray-600">
                      {review.review}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </AccordionSection>
    </motion.div>
  );
}