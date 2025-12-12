'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";
import ProductCard from '@/components/layout/components/ProductCard';
import { products } from "@/components/layout/data/products";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, ChevronUp, Grid, List, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subcategory: '',
    priceRange: [0, 10000],
    sortBy: 'name'
  });

  const categories = Array.from(new Set(products.map(p => p.category)));
  const subcategories = Array.from(new Set(products.map(p => p.subcategory)));

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: true,
    price: true,
    rating: true
  });

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           product.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesSubcategory = !filters.subcategory || product.subcategory === filters.subcategory;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [filters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      subcategory: '',
      priceRange: [0, 10000],
      sortBy: 'name'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <motion.div
              className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-80 flex-shrink-0`}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-gray-800 hover:text-black text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('category')}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
                  >
                    Category
                    {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedSections.category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            checked={filters.category === ''}
                            onChange={() => setFilters(prev => ({ ...prev, category: '' }))}
                            className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">All Categories</span>
                        </label>
                        {categories.map(category => (
                          <label key={category} className="flex items-center">
                            <input
                              type="radio"
                              name="category"
                              checked={filters.category === category}
                              onChange={() => setFilters(prev => ({ ...prev, category }))}
                              className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">{category}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subcategory Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('subcategory')}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
                  >
                    Subcategory
                    {expandedSections.subcategory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedSections.subcategory && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={filters.subcategory === ''}
                            onChange={() => setFilters(prev => ({ ...prev, subcategory: '' }))}
                            className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">All Subcategories</span>
                        </label>
                        {subcategories.map(subcategory => (
                          <label key={subcategory} className="flex items-center">
                            <input
                              type="radio"
                              name="subcategory"
                              checked={filters.subcategory === subcategory}
                              onChange={() => setFilters(prev => ({ ...prev, subcategory }))}
                              className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">{subcategory}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('rating')}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
                  >
                    Customer Rating
                    {expandedSections.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedSections.rating && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        {[4, 3, 2, 1].map(rating => (
                          <label key={rating} className="flex items-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                            />
                            <div className="ml-2 flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-sm text-gray-600">& Up</span>
                            </div>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                    <p className="text-gray-600">
                      <span className="font-semibold">{filteredProducts.length}</span> of {products.length} products
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort Dropdown */}
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="category">Sort by Category</option>
                      <option value="featured">Featured First</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {filteredProducts.length > 0 ? (
                <motion.div
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredProducts.map((product, index) => (
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
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-16 bg-white rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={clearFilters}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
