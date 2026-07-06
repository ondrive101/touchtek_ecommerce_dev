'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading = false 
}) {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="w-full overflow-x-auto mt-8">
      <div className="flex items-center justify-center gap-1 sm:gap-2 min-w-max px-2 mx-auto w-fit">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-2 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex gap-1 sm:gap-2">
          {currentPage > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="px-2 sm:px-4 py-2 text-gray-500">...</span>
              )}
            </>
          )}

          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2 border rounded-lg transition-colors shrink-0 ${
                currentPage === page
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-2 sm:px-4 py-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-2 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 shrink-0"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}