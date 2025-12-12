import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Touchtek</h3>
            <p className="text-gray-300 text-sm mb-4">
              Premium smart accessories and audio gear with fast charging technology and innovative design.
            </p>
            <p className="text-gray-400 text-xs">
              Sign up now to receive exclusive offers & discounts
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/aboutus" className="text-gray-300 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white text-sm transition-colors">
                  FAQ's
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-md font-semibold mb-4">Policies</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-refund" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Shipping & Refund
                </Link>
              </li>
              <li>
                <Link href="/delivery-and-return" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Delivery & Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-md font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/stores" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Stores
                </Link>
              </li>
              <li>
                <Link href="/products/battery" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Battery
                </Link>
              </li>
              <li>
                <Link href="/products/audio" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Audio
                </Link>
              </li>
              <li>
                <Link href="/products/accessories" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2026 Touchtek. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
