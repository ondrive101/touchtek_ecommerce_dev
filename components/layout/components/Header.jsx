'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  LogIn, 
  UserPlus,
  User2,
  Bell,
  Headphones,
  Package,
  Award,
  Users,
  LogOut 
} from 'lucide-react';
import logo from '@/public/images/logo/touchtek.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your auth logic

  const profileMenuItems = [
    { href: '/profile', label: 'Profile', icon: User2 },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/support', label: 'Support', icon: Headphones },
    { href: '/orders', label: 'Orders', icon: Package },
    { href: '/rewards', label: 'Rewards', icon: Award },
    { href: '/affiliates', label: 'Affiliates', icon: Users },
    { href: '/logout', label: 'Logout', icon: LogOut },
  ];

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
            <Link href="/en/products" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium flex items-center gap-1 hover:scale-105 transition-all">
              All Products
            </Link>

            {/* Shop by Category (MEGA MENU) */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium flex items-center gap-1 hover:scale-105 transition-all">
                Shop by Category
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[760px] bg-white shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 backdrop-blur-sm">
                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Shop by Category</h3>
                    <p className="text-sm text-gray-600">Explore our complete range of products</p>
                  </div>

                  {/* Main Categories - keeping your existing structure */}
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
                        <Link href="/en/products?category=polymer&parentCategory=batteries" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=50&h=50&fit=crop" alt="Polymer" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Polymer</span>
                        </Link>
                        <Link href="/en/products?category=lithium&parentCategory=batteries" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop&crop=center" alt="Lithium" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Lithium</span>
                        </Link>
                      </div>
                    </div>

                    {/* Audio Category */}
                    <div className="group/item bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
                          <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop&crop=center" alt="Audio" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Audio Experience</h4>
                          <p className="text-xs text-gray-500">Sound & Music</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/en/products?category=tws&parentCategory=accessories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=50&h=50&fit=crop" alt="Earbuds" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">TWS</span>
                        </Link>
                        <Link href="/en/products?category=neckbands&parentCategory=accessories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=50&h=50&fit=crop&saturation=80" alt="Neckbands" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Neckbands</span>
                        </Link>
                        <Link href="/en/products?category=headphones&parentCategory=accessories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group/link">
                          <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=50&h=50&fit=crop&contrast=110" alt="Headphones" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-700 group-hover/link:text-black">Headphones</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* View All */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link href="/en/products" className="block w-full text-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                      View All Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/en/contact" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              Contact
            </Link>
            <Link href="/en/warranty" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              Warranty
            </Link>
            <Link href="/en/careers" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              Careers
            </Link>
            <Link href="/en/faq" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">
              FAQ
            </Link>

            {/* Auth & User Actions - Desktop */}
            {!isLoggedIn ? (
              <>
                <Link href="/en/login" className="relative px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-gray-800 to-black rounded-xl shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-black active:scale-95 transform transition-all duration-200 hover:-translate-y-0.5 border-0 overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link href="/en/register" className="relative px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-gray-800 to-black rounded-xl shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-black active:scale-95 transform transition-all duration-200 hover:-translate-y-0.5 border-0 overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Sign up
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            ) : (
              <>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <User className="w-6 h-6" />
                    <span className="text-sm font-medium hidden sm:inline">Profile</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 backdrop-blur-sm">
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Icon */}
                <Link href="/en/cart" className="flex items-center gap-2 text-gray-700 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-sm font-medium hidden sm:inline">Cart</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                </Link>
              </>
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
              <Link href="/en/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all flex items-center gap-2">
                All Products
              </Link>
              <Link href="/en/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all flex items-center gap-2">
                Contact
              </Link>
              <Link href="/en/warranty" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all flex items-center gap-2">
                Warranty
              </Link>
              <Link href="/en/careers" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all flex items-center gap-2">
                Careers
              </Link>
              <Link href="/en/faq" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-white transition-all flex items-center gap-2">
                FAQ
              </Link>

              {/* Mobile Auth & User Actions */}
              {!isLoggedIn ? (
                <>
                  <Link href="/en/login" className="group relative block px-4 py-3 mt-2 mx-2 bg-gradient-to-r from-gray-800 to-black text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:from-gray-900 hover:to-black active:scale-[0.98] transition-all duration-200 hover:-translate-y-1 border-0 overflow-hidden flex items-center gap-2 justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" />
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link href="/en/register" className="group relative block px-4 py-3 mt-2 mx-2 bg-gradient-to-r from-gray-800 to-black text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:from-gray-900 hover:to-black active:scale-[0.98] transition-all duration-200 hover:-translate-y-1 border-0 overflow-hidden flex items-center gap-2 justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" />
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <>
                  {/* Mobile Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                    >
                      <User className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                      <span>Profile</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProfileOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 backdrop-blur-sm">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 group"
                            onClick={() => {
                              setIsProfileOpen(false);
                              setIsMenuOpen(false);
                            }}
                          >
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Cart */}
                  <Link href="/en/cart" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-all flex items-center gap-3 relative group">
                    <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                    <span>Cart</span>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
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
