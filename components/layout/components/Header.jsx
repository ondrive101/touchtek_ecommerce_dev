'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import logo from '@/public/images/logo/touchtek.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
<div className="flex-shrink-0">
  <Link href="/" className="flex items-center">
    <Image
      src={logo}
      alt="Touchtek"
      width={160}
      height={48}
      className="h-12 sm:h-12 object-contain"
      priority
    />
  </Link>
</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              All Products
            </Link>

            {/* Shop by Category (MEGA MENU) */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium flex items-center">
                Shop by Category
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[760px] bg-white shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 backdrop-blur-sm">
                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Shop by Category</h3>
                    <p className="text-sm text-gray-600">Explore our complete range of products</p>
                  </div>

                  {/* Main Categories */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Battery Category */}
                    <div className="group/item bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                          <img
                            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center"
                            alt="Battery"
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Battery Solutions</h4>
                          <p className="text-xs text-gray-500">Power & Energy</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/products?category=Polymer"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=50&h=50&fit=crop"
                              alt="Polymer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Polymer</span>
                        </Link>
                        <Link
                          href="/products?category=Lithium"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop&crop=center"
                              alt="Lithium"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Lithium</span>
                        </Link>
                      </div>
                    </div>

                    {/* Audio Category */}
                    <div className="group/item bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
                          <img
                            src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop&crop=center"
                            alt="Audio"
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Audio Experience</h4>
                          <p className="text-xs text-gray-500">Sound & Music</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/products?category=Earbuds"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=50&h=50&fit=crop"
                              alt="Earbuds"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Earbuds</span>
                        </Link>
                        <Link
                          href="/products?category=Neckbands"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=50&h=50&fit=crop&saturation=80"
                              alt="Neckbands"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Neckbands</span>
                        </Link>
                        <Link
                          href="/products?category=Earphones"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=50&h=50&fit=crop&contrast=110"
                              alt="Earphones"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Earphones</span>
                        </Link>
                        <Link
                          href="/products?category=Speaker"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=50&h=50&fit=crop"
                              alt="Speaker"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Speaker</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Categories */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Accessories Category */}
                    <div className="group/item bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                          <img
                            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop&crop=center"
                            alt="Accessories"
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Accessories</h4>
                          <p className="text-xs text-gray-500">Charging & Cables</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <Link
                          href="/products?category=Charger"
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-5 h-5 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=40&h=40&fit=crop"
                              alt="Charger"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Charger</span>
                        </Link>
                        <Link
                          href="/products?category=Car Charger"
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-5 h-5 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40&h=40&fit=crop&contrast=120"
                              alt="Car Charger"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Car Charger</span>
                        </Link>
                        <Link
                          href="/products?category=Data Cable"
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-5 h-5 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=40&h=40&fit=crop"
                              alt="Data Cable"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Data Cable</span>
                        </Link>
                        <Link
                          href="/products?category=Power Bank"
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-5 h-5 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=40&h=40&fit=crop"
                              alt="Power Bank"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Power Bank</span>
                        </Link>
                      </div>
                    </div>

                    {/* Protection Category */}
                    <div className="group/item bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
                          <img
                            src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop&brightness=120"
                            alt="Protection"
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Protection</h4>
                          <p className="text-xs text-gray-500">Cases & Screen</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/products?category=Cover"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=50&h=50&fit=crop&brightness=120"
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Cover</span>
                        </Link>
                        <Link
                          href="/products?category=Tempered Glass"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=50&h=50&fit=crop&brightness=130"
                              alt="Tempered Glass"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Tempered Glass</span>
                        </Link>
                        <Link
                          href="/products?category=Combo"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=50&h=50&fit=crop&hue=60"
                              alt="Combo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Combo</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* View All */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link
                      href="/products"
                      className="block w-full text-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/contact" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              Contact
            </Link>
            <Link href="/warranty" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              Warranty
            </Link>
            <Link href="/careers" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              Careers
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              FAQ
            </Link>

            {/* BLACK GRADIENT Sign In Button - Desktop */}
            <Link
              href="/login"
              className="relative px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-gray-800 to-black rounded-xl shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-black active:scale-95 transform transition-all duration-200 hover:-translate-y-0.5 border-0 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link href="/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
                All Products
              </Link>
              <Link href="/products?category=Battery" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
                Battery
              </Link>
              <Link href="/products?category=Audio" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
                Audio
              </Link>
              <Link href="/products?category=Accessories" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
                Accessories
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
                Contact
              </Link>
              <Link href="/warranty" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
                Warranty
              </Link>
              <Link href="/careers" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
                Careers
              </Link>
              <Link href="/faq" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
                FAQ
              </Link>

              {/* BLACK GRADIENT Sign In Button - Mobile */}
              <Link
                href="/login"
                className="group relative block px-4 py-3 mt-2 mx-2 bg-gradient-to-r from-gray-800 to-black text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:from-gray-900 hover:to-black active:scale-[0.98] transform transition-all duration-200 hover:-translate-y-1 border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" />
                <div className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
