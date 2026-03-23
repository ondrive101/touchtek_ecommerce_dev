// components/product/RelatedProducts.jsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from './star-rating';

// Dummy related products - replace with real data
const DUMMY_RELATED = [
  {
    skuCode: 'RP001', image: 'https://picsum.photos/300/300?random=1', productName: 'Pulse Pro Watch', description: 'Advanced fitness tracking', price: 8999, originalPrice: 11999,
  },
  {
    skuCode: 'RP002', image: 'https://picsum.photos/300/300?random=2', productName: 'Elite Metal Band', description: 'Premium titanium strap', price: 2999, originalPrice: 3999,
  },
  {
    skuCode: 'RP003', image: 'https://picsum.photos/300/300?random=3', productName: 'Sport Ultra', description: 'Waterproof sports watch', price: 7499,
  },
  {
    skuCode: 'RP004', image: 'https://picsum.photos/300/300?random=4', productName: 'Classic Leather', description: 'Timeless leather strap', price: 1999,
  },
];

export default function RelatedProducts({ products = [], category }) {
  const displayProducts = products.length > 0 ? products.slice(0, 4) : DUMMY_RELATED;

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
          {displayProducts.map((p, index) => (
            <motion.div
              key={p.skuCode}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.productName}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
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
                  href={`/products/${p.skuCode}`}
                  className="block w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-sm"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
