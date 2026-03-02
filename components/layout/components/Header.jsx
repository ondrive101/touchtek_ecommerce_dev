'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Airpod from "@/public/images/touchtek/Airpod.jpeg";
import Cable from "@/public/images/touchtek/Cable.jpeg";
import Charger from "@/public/images/touchtek/Charger.jpeg";
import Earphone from "@/public/images/touchtek/Earphone.jpeg";
import Headphone from "@/public/images/touchtek/Headphone.jpeg";
import Neckband from "@/public/images/touchtek/Neckband.jpeg";
import Powerbank from "@/public/images/touchtek/Powerbank.jpeg";
import Speaker from "@/public/images/touchtek/Speaker.jpeg";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from '@/store';
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  ShoppingCart,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import logo from '@/public/images/logo/touchtek.png';


export default function Header() {
  const { data: session, status } = useSession();
  const { items } = useCartStore();
  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle refresh token failure — force re-login
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/en/login" });
    }
  }, [session]);

  // Logout handler
  const handleLogout = async () => {
    setIsMenuOpen(false);
    await signOut({ callbackUrl: "/en" });
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

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
            <Link
              href="/en/products"
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium flex items-center gap-1 hover:scale-105 transition-all"
            >
              All Products
            </Link>

            {/* Shop by Category Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium flex items-center">
                Shop by Category
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[760px] bg-white shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 backdrop-blur-sm">
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Shop by Category</h3>
                    <p className="text-sm text-gray-600">Explore our complete range of products</p>
                  </div>

                  {/* Main Categories */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
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
                        <Link href="/en/products?category=tws&parentCategory=accessories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <Image src={Airpod} alt='TWS' className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">TWS</span>
                        </Link>
                        <Link href="/en/products?category=neckbands&parentCategory=accessories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <Image src={Neckband} alt='Neckband' className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Neckbands</span>
                        </Link>
                        <Link href="/en/products?category=headphones&parentCategory=accessories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <Image src={Headphone} alt='Headphone' className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Headphones</span>
                        </Link>
                        <Link href="/en/products?category=speakers&parentCategory=accessories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <Image src={Speaker} alt='Speaker' className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Speaker</span>
                        </Link>
                        <Link href="/en/products?category=earphones&parentCategory=accessories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <Image src={Earphone} alt='Earphone' className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Earphones</span>
                        </Link>
                      </div>
                    </div>

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
                        <Link href="/en/products?category=chargers&parentCategory=accessories" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <Image src={Charger} alt='Charger' className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Charger</span>
                        </Link>
                        <Link href="/en/products?category=carchargers&parentCategory=accessories" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40&h=40&fit=crop&contrast=120" alt="Car Charger" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Car Charger</span>
                        </Link>
                        <Link href="/en/products?category=cables&parentCategory=accessories" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <Image src={Cable} alt='Cable' className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Data Cable</span>
                        </Link>
                        <Link href="/en/products?category=powerbanks&parentCategory=accessories" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <Image src={Powerbank} alt='Powerbank' className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Power Bank</span>
                        </Link>
                        <Link href="/en/products?category=powerbanks&parentCategory=accessories" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=40&h=40&fit=crop" alt="OTG" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">OTG</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Categories */}
                  <div className="grid grid-cols-2 gap-6">
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
                        <Link href="/en/products?category=polymer&parentCategory=batteries" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=50&h=50&fit=crop" alt="Polymer" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Polymer</span>
                        </Link>
                        <Link href="/en/products?category=lithium&parentCategory=batteries" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop&crop=center" alt="Lithium" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Lithium</span>
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
                        <Link href="/en/products" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=50&h=50&fit=crop&brightness=120" alt="Cover" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Cover</span>
                        </Link>
                        <Link href="/en/products" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=50&h=50&fit=crop&brightness=130" alt="Tempered Glass" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Tempered Glass</span>
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

            <Link href="/en/contact" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">Contact</Link>
            <Link href="/en/warranty" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">Warranty</Link>
            <Link href="/en/careers" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">Careers</Link>
            <Link href="/en/faq" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">FAQ</Link>

            {/* Desktop Auth & User Actions */}
            {isLoading ? (
              <div className="w-32 h-9 bg-gray-100 animate-pulse rounded-xl" />
            ) : !isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/en/login"
                  className="relative px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-gray-800 to-black rounded-xl shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-black active:scale-95 transform transition-all duration-200 hover:-translate-y-0.5 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  href="/en/register"
                  className="relative px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-gray-800 to-black rounded-xl shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-black active:scale-95 transform transition-all duration-200 hover:-translate-y-0.5 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">

                {/* ✅ Dashboard Button (replaces profile dropdown) */}
                <Link
                  href="/en/user/dashboard"
                  className="relative px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-gray-800 to-black rounded-xl shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-black active:scale-95 transform transition-all duration-200 hover:-translate-y-0.5 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

             
                {/* Cart Icon */}
                <Link
                  href="/en/cart"
                  className="flex items-center gap-2 text-gray-700 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-sm font-medium hidden sm:inline">Cart</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {items?.length}
                  </span>
                </Link>

              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-100">
              <Link href="/en/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all" onClick={() => setIsMenuOpen(false)}>All Products</Link>
              <Link href="/en/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link href="/en/warranty" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all" onClick={() => setIsMenuOpen(false)}>Warranty</Link>
              <Link href="/en/careers" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all" onClick={() => setIsMenuOpen(false)}>Careers</Link>
              <Link href="/en/faq" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all" onClick={() => setIsMenuOpen(false)}>FAQ</Link>

              {/* Mobile Auth & User Actions */}
              {isLoading ? (
                <div className="h-12 bg-gray-100 animate-pulse rounded-xl mx-2 mt-2" />
              ) : !isLoggedIn ? (
                <>
                  <Link
                    href="/en/login"
                    className="group relative flex items-center justify-center gap-2 px-4 py-3 mt-2 mx-2 bg-gradient-to-r from-gray-800 to-black text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-2xl active:scale-[0.98] transition-all duration-200 overflow-hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" />
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/en/register"
                    className="group relative flex items-center justify-center gap-2 px-4 py-3 mt-2 mx-2 bg-gradient-to-r from-gray-800 to-black text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-2xl active:scale-[0.98] transition-all duration-200 overflow-hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" />
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <>
                  {/* ✅ Mobile Dashboard Button */}
                  <Link
                    href="/en/user/dashboard"
                    className="group relative flex items-center justify-center gap-2 px-4 py-3 mt-2 mx-2 bg-gradient-to-r from-gray-800 to-black text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-2xl active:scale-[0.98] transition-all duration-200 overflow-hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" />
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Mobile Cart */}
                  <Link
                    href="/en/cart"
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-all relative group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                    <span>Cart</span>
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {items?.length}
                    </span>
                  </Link>

                </>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
