'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/layout/components/ProductGridCard';
import { Search } from 'lucide-react';

export default function ProductGrid({ 
  products, 
  viewMode = 'grid',
  isLoading = false,
  onClearFilters 
}) {

  // console.log("products", products);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        className="text-center py-16 bg-white rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or search terms
        </p>
        <button
          onClick={onClearFilters}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
        >
          Clear All Filters
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <ProductCard
            id={product.id}
            name={product.name}
            image={product.image}
            slug={product.slug}
            category={product.category}
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            viewMode={viewMode}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
