'use client';

import { useState, useEffect } from "react";
import { getProductById } from "@/action/common";
import { useParams } from 'next/navigation';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ArrowLeft, Shield, Truck, Award, CheckCircle,
  ChevronDown, ChevronUp, User, SlidersHorizontal, Info,
  MessageSquare, Cpu, Zap, Layers, Ruler,
  Wifi, Battery, MonitorSmartphone, Thermometer, Box,
  ThumbsUp, ThumbsDown, BadgeCheck, Quote, BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ─── Dummy Reviews ───────────────────────────────────────────────────────────
const DUMMY_REVIEWS = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    date: "Feb 12, 2026",
    title: "Excellent product!",
    body: "Really impressed with the build quality. Exactly as described and shipped quickly. Would buy again without hesitation.",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    name: "Priya Mehta",
    rating: 4,
    date: "Jan 28, 2026",
    title: "Great value for money",
    body: "Very good product overall. The design is sleek and it works perfectly. Minor packaging issue but the product itself is top-notch.",
    helpful: 18,
    verified: true,
  },
  {
    id: 3,
    name: "Amit Verma",
    rating: 5,
    date: "Jan 15, 2026",
    title: "Would definitely recommend",
    body: "Bought this as a gift and the recipient absolutely loved it. Premium quality and great finish throughout.",
    helpful: 31,
    verified: false,
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    rating: 4,
    date: "Dec 30, 2025",
    title: "Solid build, fast delivery",
    body: "The product lives up to the description. Fast delivery and well-packaged. Will buy again.",
    helpful: 12,
    verified: true,
  },
];

// ─── Spec type → Lucide icon map ─────────────────────────────────────────────
const SPEC_ICON_MAP = {
  processor: Cpu,     cpu: Cpu,
  power: Zap,         watt: Zap,         voltage: Zap,
  material: Layers,   build: Layers,
  dimension: Ruler,   size: Ruler,       length: Ruler,  width: Ruler, height: Ruler,
  weight: Wifi,
  wireless: Wifi,     wifi: Wifi,        bluetooth: Wifi,
  battery: Battery,
  display: MonitorSmartphone, screen: MonitorSmartphone,
  temperature: Thermometer,   heat: Thermometer,
  package: Box,       box: Box,          contents: Box,
};

function getSpecIcon(type = "") {
  const key = type.toLowerCase();
  for (const [keyword, Icon] of Object.entries(SPEC_ICON_MAP)) {
    if (key.includes(keyword)) return Icon;
  }
  return SlidersHorizontal;
}

// ─── Reusable Star Rating ────────────────────────────────────────────────────
function StarRating({ rating, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Animated Accordion ──────────────────────────────────────────────────────
function AccordionSection({ children, isOpen }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 1 — SPECIFICATIONS
// ════════════════════════════════════════════════════════════════════════════
function SpecificationsSection({ specifications = [], isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            Product Specifications
          </h3>
        </div>
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-gray-500" />
          : <ChevronDown className="w-4 h-4 text-gray-500" />
        }
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
                    className="border-b border-gray-100 last:border-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {/* Label cell */}
                    <td className="w-[38%] px-5 py-3.5 bg-gray-50 align-top">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <IconComponent className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <span className="font-semibold text-gray-700 leading-snug">
                          {spec.type}
                        </span>
                      </div>
                    </td>

                    {/* Vertical divider */}
                    <td className="w-px bg-gray-200 p-0" />

                    {/* Value cell */}
                    <td className="px-5 py-3.5 bg-white align-top">
                      <span className="text-gray-800 leading-snug">
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

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 2 — ABOUT THIS ITEM
// ════════════════════════════════════════════════════════════════════════════
function AboutSection({ about = [], isOpen, onToggle }) {
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
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            About This Item
          </h3>
        </div>
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-gray-500" />
          : <ChevronDown className="w-4 h-4 text-gray-500" />
        }
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
              <p className="text-sm text-gray-800 leading-relaxed flex-1">
                {point}
              </p>
            </motion.li>
          ))}
        </ul>

        {/* See more / less toggle */}
        {hasMore && (
          <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-center">
            <button
              onClick={() => setExpanded((p) => !p)}
              className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              {expanded ? "See less" : `See all ${about.length} features`}
              {expanded
                ? <ChevronUp className="w-4 h-4" />
                : <ChevronDown className="w-4 h-4" />
              }
            </button>
          </div>
        )}
      </AccordionSection>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 3 — CUSTOMER REVIEWS
// ════════════════════════════════════════════════════════════════════════════
function ReviewsSection({ isOpen, onToggle }) {
  const totalReviews = DUMMY_REVIEWS.length;
  const averageRating =
    DUMMY_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

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
      {/* Header */}
      <button
        onClick={onToggle}
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
          {isOpen
            ? <ChevronUp className="w-5 h-5 text-gray-400" />
            : <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </button>

      <AccordionSection isOpen={isOpen}>
        <div className="bg-gray-50 border-t border-gray-100">
          {/* Rating Summary */}
          <div className="px-6 py-6 bg-white border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              {/* Score card */}
              <div className="flex flex-col items-center justify-center w-36 h-36 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex-shrink-0">
                <span className="text-5xl font-black text-gray-900 leading-none">
                  {averageRating.toFixed(1)}
                </span>
                <StarRating rating={Math.round(averageRating)} size="w-4 h-4" />
                <p className="text-xs text-gray-500 mt-1">{totalReviews} verified</p>
              </div>

              {/* Distribution bars */}
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
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
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

          {/* Individual Reviews */}
          <div className="px-6 py-5 space-y-4">
            {DUMMY_REVIEWS.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                {/* Top row */}
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

                {/* Quote body */}
                <div className="relative pl-5 mb-3">
                  <Quote className="absolute left-0 top-0 w-3.5 h-3.5 text-gray-300" />
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    {review.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.body}
                  </p>
                </div>

                {/* Helpful row */}
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

// ════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function ProductPage() {
  const params = useParams();
  const productId = params.id;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState({});
  const [variant, setVariant] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  // All three open by default
  const [showSpecifications, setShowSpecifications] = useState(true);
  const [showAbout, setShowAbout] = useState(true);
  const [showReviews, setShowReviews] = useState(true);

  const { data: productData, isLoading, isError } = useQuery({
    queryKey: ["product-by-id", productId],
    queryFn: () => getProductById(productId),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (productData) {
      setProduct(productData?.data?.product);
      setVariant(productData?.data?.variant);
      setRelatedProducts(productData?.data?.relatedVariants || []);
    }
  }, [productData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/products"
            className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Back to Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-800 hover:text-black mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Link>
          </motion.div>

          {/* ── Product Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Images */}
            {variant?.images?.length > 0 && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                  <Image
                    src={variant?.images?.[selectedImageIndex]?.fileUrl}
                    alt={product?.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {variant?.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-gray-800 ring-2 ring-gray-200"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={image?.fileUrl}
                        alt={`${product?.name} view ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Info Panel */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Category & Hot Badge */}
              <div className="flex items-center gap-3">
                <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {product?.category?.name}
                </span>
                {productData?.variant?.is_hot_selling && (
                  <span className="bg-gradient-to-r from-gray-800 to-black text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Hot Selling
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-4xl font-bold text-gray-900 uppercase">
                {product?.name}
              </h1>

              {/* Rating row */}
              {/* <div className="flex items-center gap-2">
                <StarRating rating={5} size="w-5 h-5" />
                <span className="text-gray-600">(4.8 out of 5)</span>
                <span className="text-gray-400">•</span>
                <button
                  onClick={() => setShowReviews(true)}
                  className="text-gray-600 hover:underline hover:text-gray-900 transition-colors"
                >
                  127 reviews
                </button>
              </div> */}

              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed">
                {variant?.description}
              </p>

              {/* Attributes */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Specifications
                </h3>
                <ul className="space-y-3">
                  {[
                    ...(variant?.attributes?.color
                      ? [`Color: ${variant?.attributes?.color}`]
                      : []),
                    ...(variant?.attributes?.port
                      ? [`Port Type: ${variant?.attributes?.port}`]
                      : []),
                  ].map((spec, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{spec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: "Warranty",      sub: "2 Year Coverage" },
                  { icon: Truck,  title: "Free Shipping", sub: "On all orders" },
                  { icon: Award,  title: "Quality",       sub: "Premium Grade" },
                ].map(({ icon: Icon, title, sub }) => (
                  <motion.div
                    key={title}
                    className="bg-white rounded-xl p-4 text-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                    <p className="text-sm text-gray-600">{sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Interested in this product?
                </h3>
                <p className="text-gray-200 mb-4">
                  Get in touch with our team for more information or bulk orders.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-center"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/products"
                    className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-gray-800 transition-colors text-center"
                  >
                    View More Products
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ══════════════════════════════════════════════
               SPECIFICATIONS / ABOUT / REVIEWS
          ══════════════════════════════════════════════ */}
          <div className="mt-16 space-y-4">
            {/* {variant?.specifications?.length > 0 && (
              <SpecificationsSection
                specifications={variant.specifications}
                isOpen={showSpecifications}
                onToggle={() => setShowSpecifications((p) => !p)}
              />
            )} */}

            {/* {variant?.about?.length > 0 && (
              <AboutSection
                about={variant.about}
                isOpen={showAbout}
                onToggle={() => setShowAbout((p) => !p)}
              />
            )} */}

            {/* <ReviewsSection
              isOpen={showReviews}
              onToggle={() => setShowReviews((p) => !p)}
            /> */}
          </div>
        </div>

        {/* ── Related Products ── */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Related Products
              </h2>
              <p className="text-gray-600">
                Discover more products in the {product?.subCategory?.name} category
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp, index) => (
                <motion.div
                  key={rp?.skuCode}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={rp?.image}
                      alt={rp?.productName}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors uppercase">
                      {rp?.productName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {rp?.description}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      <StarRating rating={5} />
                      <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      {rp?.price && (
                        <span className="text-lg font-bold text-gray-900">
                          ₹{rp?.price}
                        </span>
                      )}
                      {rp?.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{rp?.originalPrice}
                        </span>
                      )}
                      {rp?.originalPrice && rp?.price &&
                        rp?.originalPrice > rp?.price && (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            -{Math.round(
                              ((rp.originalPrice - rp.price) / rp.originalPrice) * 100
                            )}%
                          </span>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
