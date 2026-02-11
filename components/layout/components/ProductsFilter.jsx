'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { PARENT_CATEGORIES, CATEGORIES } from "@/lib/utils/constants";

export default function ProductFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters
}) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: true,
    price: true,
    rating: true
  });

  // Local search state for immediate UI updates
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Create debounced search function
  const debouncedSearchRef = useRef(
    debounce((searchValue) => {
      onFilterChange({ ...filters, search: searchValue, page: 1 });
    }, 500)
  ).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearchRef.cancel();
    };
  }, [debouncedSearchRef]);

  // Sync searchInput with filters.search when filters are cleared
  useEffect(() => {
    if (filters.search === '' && searchInput !== '') {
      setSearchInput('');
    }
  }, [filters.search]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle search input change with debouncing
  const handleSearchChange = (value) => {
    setSearchInput(value);
    debouncedSearchRef(value);
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handlePriceRangeChange = (min, max) => {
    onFilterChange({ ...filters, priceRange: [min, max] });
  };

  // Handle parent category change
  const handleParentCategoryChange = (parentCategoryId) => {
    onFilterChange({ 
      ...filters, 
      parentCategory: parentCategoryId, 
      category: '', // Clear subcategory when parent changes
      page: 1 
    });
  };

  // Handle subcategory change
  const handleCategoryChange = (categoryId) => {
    onFilterChange({ 
      ...filters, 
      category: categoryId,
      page: 1 
    });
  };

  // Get subcategories based on selected parent category
  const availableSubcategories = filters.parentCategory 
    ? CATEGORIES[filters.parentCategory] || []
    : [];

  // Get selected parent category name for display
  const selectedParentCategoryName = PARENT_CATEGORIES.find(
    cat => cat._id === filters.parentCategory
  )?.name;

  // Get selected subcategory name for display
  const selectedSubcategoryName = availableSubcategories.find(
    cat => cat._id === filters.category
  )?.name;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </h2>
        <button
          onClick={() => {
            debouncedSearchRef.cancel(); // Cancel pending search
            setSearchInput(''); // Clear search input
            onClearFilters();
          }}
          className="text-gray-800 hover:text-black text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Active Filters Display */}
      {(filters.parentCategory || filters.category || searchInput) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {searchInput && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              Search: "{searchInput}"
              <button
                onClick={() => {
                  setSearchInput('');
                  debouncedSearchRef.cancel();
                  handleFilterChange('search', '');
                }}
                className="hover:text-gray-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.parentCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {selectedParentCategoryName}
              <button
                onClick={() => handleParentCategoryChange('')}
                className="hover:text-gray-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {selectedSubcategoryName}
              <button
                onClick={() => handleCategoryChange('')}
                className="hover:text-gray-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Search with Debouncing */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                debouncedSearchRef.cancel();
                handleFilterChange('search', '');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Parent Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
        >
          <span>Category</span>
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {expandedSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                {/* All Categories Option */}
                <button
                  onClick={() => handleParentCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filters.parentCategory === ''
                      ? 'bg-gray-800 text-white font-medium'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>

                {/* Parent Categories */}
                {PARENT_CATEGORIES.map(parentCat => (
                  <button
                    key={parentCat._id}
                    onClick={() => handleParentCategoryChange(parentCat._id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filters.parentCategory === parentCat._id
                        ? 'bg-gray-800 text-white font-medium'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {parentCat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subcategory Filter */}
      {filters.parentCategory !== '' && availableSubcategories.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('subcategory')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
          >
            <span>Subcategory</span>
            {expandedSections.subcategory ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.subcategory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-2">
                  {/* All Subcategories Option */}
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filters.category === ''
                        ? 'bg-gray-800 text-white font-medium'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Subcategories
                  </button>

                  {/* Subcategories */}
                  {availableSubcategories.map(subCat => (
                    <button
                      key={subCat._id}
                      onClick={() => handleCategoryChange(subCat._id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filters.category === subCat._id
                          ? 'bg-gray-800 text-white font-medium'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {subCat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
        >
          <span>Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        filters.priceRange?.[0] === 0 && 
                        filters.priceRange?.[1] === 10000
                      }
                      onChange={() => handlePriceRangeChange(0, 10000)}
                      className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">All Prices</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        filters.priceRange?.[0] === 0 && 
                        filters.priceRange?.[1] === 500
                      }
                      onChange={() => handlePriceRangeChange(0, 500)}
                      className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Under ₹500</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        filters.priceRange?.[0] === 500 && 
                        filters.priceRange?.[1] === 1000
                      }
                      onChange={() => handlePriceRangeChange(500, 1000)}
                      className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">₹500 - ₹1,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        filters.priceRange?.[0] === 1000 && 
                        filters.priceRange?.[1] === 2000
                      }
                      onChange={() => handlePriceRangeChange(1000, 2000)}
                      className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">₹1,000 - ₹2,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        filters.priceRange?.[0] === 2000 && 
                        filters.priceRange?.[1] === 5000
                      }
                      onChange={() => handlePriceRangeChange(2000, 5000)}
                      className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">₹2,000 - ₹5,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        filters.priceRange?.[0] === 5000 && 
                        filters.priceRange?.[1] === 10000
                      }
                      onChange={() => handlePriceRangeChange(5000, 10000)}
                      className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Above ₹5,000</span>
                  </label>
                </div>

                {/* Custom Price Range */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Custom Range</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange?.[0] ?? 0}
                      onChange={(e) => 
                        handlePriceRangeChange(
                          Number(e.target.value), 
                          filters.priceRange?.[1] ?? 10000
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange?.[1] ?? 10000}
                      onChange={(e) => 
                        handlePriceRangeChange(
                          filters.priceRange?.[0] ?? 0, 
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
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
          <span>Customer Rating</span>
          {expandedSections.rating ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={filters.minRating === null}
                    onChange={() => handleFilterChange('minRating', null)}
                    className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">All Ratings</span>
                </label>
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="minRating"
                      checked={filters.minRating === rating}
                      onChange={() => handleFilterChange('minRating', rating)}
                      className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                    />
                    <div className="ml-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
