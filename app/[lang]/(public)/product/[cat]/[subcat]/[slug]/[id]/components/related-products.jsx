// components/product/RelatedProducts.jsx
'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from './star-rating';

export default function RelatedProducts({ products = [], category }) {
  const params = useParams();
  const { cat, subcat, slug } = params;

  const displayProducts = products.length > 0 ? products.slice(0, 4) : [];

  return (
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
          <p className="text-gray-600 text-lg">
            Discover more products in the {category || 'Smartwatches'} category
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((p, index) => {
            const imageSrc =
              (typeof p?.image === 'string' && p.image.trim()) ||
              (typeof p?.fileUrl === 'string' && p.fileUrl.trim()) ||
              (Array.isArray(p?.images) &&
                (p.images[0]?.image ||
                  p.images[0]?.fileUrl ||
                  (typeof p.images[0] === 'string' && p.images[0].trim()))) ||
              null;

            return (
              <motion.div
                key={p.skuCode || index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="aspect-square overflow-hidden relative bg-gray-50 flex items-center justify-center">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={p.productName || 'Product image'}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 uppercase">
                    {p.productName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    <StarRating rating={5} />
                    <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {p.price && (
                      <span className="text-xl font-bold text-gray-900">
                        ₹{p.price}
                      </span>
                    )}
                    {p.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{p.originalPrice}
                      </span>
                    )}
                    {p.originalPrice && p.price && p.originalPrice > p.price && (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/en/product/${cat}/${subcat}/${slug}/${p.skuCode}`}
                    className="block w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
