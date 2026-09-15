"use client";

import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Header from "@/components/layout/components/Header";
import { toast } from "react-hot-toast";
import Footer from "@/components/layout/components/Footer";
import ProductFilters from "@/components/layout/components/ProductsFilter";
import ProductGrid from "@/components/layout/components/ProductGrid";
import { getProducts } from "@/action/common";
import Pagination from "@/components/layout/components/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PARENT_CATEGORIES } from "@/lib/utils/constants";

export default function ProductsPage({ searchParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsPagination, setProductsPagination] = useState({});

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    parentCategory: searchParams?.parentCategory || "",
    category: searchParams?.category || "",
    priceRange: [0, 10000],
    sortBy: "name",
    minRating: null,
  });

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    placeholderData: keepPreviousData,
    staleTime: 120 * 1000,
  });

  useEffect(() => {
    if (data) {
      setProducts(data?.data?.payload?.products || []);
      setProductsPagination(data?.data?.payload?.pagination || {});
    }
  }, [data]);

  const handleFilterChange = (newFilters) => {
    // Reset to page 1 if any filter other than page changed
    if (
      newFilters.search !== filters.search ||
      newFilters.parentCategory !== filters.parentCategory ||
      newFilters.category !== filters.category ||
      newFilters.sortBy !== filters.sortBy ||
      newFilters.minRating !== filters.minRating ||
      JSON.stringify(newFilters.priceRange) !== JSON.stringify(filters.priceRange)
    ) {
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters(newFilters);
    }
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      parentCategory: "",
      category: "",
      priceRange: [0, 10000],
      sortBy: "name",
      minRating: null,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isCustomPrice = filters.priceRange && (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000);
  const activeFiltersCount = (filters.parentCategory ? 1 : 0) + 
    (filters.category ? 1 : 0) + 
    (filters.search ? 1 : 0) + 
    (filters.minRating !== null ? 1 : 0) + 
    (isCustomPrice ? 1 : 0);

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Products
            </h3>
            <p className="text-red-700">
              {error?.message || "Something went wrong"}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Mobile Quick Category Pills */}
          <div className="lg:hidden mb-3 overflow-x-auto scrollbar-none -mx-3 px-3 flex items-center gap-2 py-1">
            <button
              onClick={() => handleFilterChange({ ...filters, parentCategory: "", category: "" })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                !filters.parentCategory
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {PARENT_CATEGORIES.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleFilterChange({ ...filters, parentCategory: cat._id, category: "" })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  filters.parentCategory === cat._id
                    ? "bg-gray-900 text-white shadow-xs"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block w-72 xl:w-80 shrink-0">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                isMobile={false}
              />
            </div>

            {/* Mobile Filter Drawer (Slide-Over) */}
            <AnimatePresence>
              {isSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                  />

                  {/* Drawer Content */}
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 280 }}
                    className="relative w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden"
                  >
                    {/* Scrollable Filter Area */}
                    <div className="flex-1 overflow-y-auto">
                      <ProductFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                        isMobile={true}
                        onClose={() => setIsSidebarOpen(false)}
                      />
                    </div>

                    {/* Bottom Apply Action */}
                    <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 shadow-lg">
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="w-full bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Show {productsPagination?.totalProducts ?? products?.length ?? 0} Products</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Products Main Area */}
            <div className="flex-1 min-w-0">
              {/* Controls Header */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-semibold text-gray-800 shrink-0 shadow-2xs"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-gray-700" />
                      <span>Filters</span>
                      {activeFiltersCount > 0 && (
                        <span className="bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {isLoading ? (
                        "Loading..."
                      ) : (
                        <>
                          <span className="font-bold text-gray-900">{products?.length || 0}</span> of{" "}
                          <span className="font-bold text-gray-900">{productsPagination?.totalProducts || 0}</span>
                          <span className="hidden sm:inline"> products</span>
                          {isFetching && (
                            <span className="ml-1 text-xs text-gray-400 font-normal">(Updating...)</span>
                          )}
                        </>
                      )}
                    </p>
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="hidden sm:inline text-xs text-gray-500 font-medium whitespace-nowrap">Sort:</span>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-800 font-medium"
                    >
                      <option value="name">Name</option>
                      <option value="discount">Discount</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products 2-Column Mobile / 3-Column Desktop Grid */}
              <ProductGrid
                products={products || []}
                viewMode={viewMode}
                isLoading={isLoading}
                onClearFilters={clearFilters}
              />

              {/* Pagination */}
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={filters.page}
                  totalPages={productsPagination?.totalPages || 1}
                  onPageChange={handlePageChange}
                  isLoading={isFetching}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
