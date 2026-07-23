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
import { motion } from "framer-motion";
import { Filter, Grid, List } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <motion.div
              className={`${isSidebarOpen ? "block" : "hidden"} lg:block w-80 flex-shrink-0`}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </motion.div>

            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {isLoading ? (
                        "Loading..."
                      ) : (
                        <>
                          <span className="font-semibold">{products?.length || 0}</span>{" "}
                          of {productsPagination?.totalProducts || 0} products
                          {isFetching && (
                            <span className="ml-2 text-sm text-gray-500">(Updating...)</span>
                          )}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                      className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="discount">Sort by Discount</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <ProductGrid
                products={products || []}
                viewMode={viewMode}
                isLoading={isLoading}
                onClearFilters={clearFilters}
              />

              <Pagination
                currentPage={filters.page}
                totalPages={productsPagination?.totalPages || 1}
                onPageChange={handlePageChange}
                isLoading={isFetching}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
