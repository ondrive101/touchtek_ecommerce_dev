import Link from 'next/link';
import Image from "next/image";
import facebook from "@/public/images/social/facebook-1.png"
import dribble from "@/public/images/social/dribble-1.png"
import linkedin from "@/public/images/social/linkedin-1.png"
import instagram from "@/public/images/social/instagram.png"
import github from "@/public/images/social/github-1.png"
import behance from "@/public/images/social/behance-1.png"
import twitter from "@/public/images/social/twitter-1.png"
import youtube from "@/public/images/social/youtube.png"



 const socials = [
    {
      icon: facebook,
      href: "https://www.facebook.com/profile.php?id=61573722944708"
    },
      {
      icon: instagram,
      href: "https://www.instagram.com/touchtek.official?igsh=enc1dWFzMWY2NWg1"
    },
    {
      icon: linkedin,
      href: "https://www.linkedin.com/in/touchtek-india-499a08383/"
    },
    {
      icon: youtube,
      href: "https://www.youtube.com/@touchtekofficial"
    },
    {
      icon: twitter,
      href: "https://twitter.com/TouchtekIndia"
    },

   
  ]

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
              {/* <li>
                <Link href="/stores" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Stores
                </Link>
              </li> */}
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

        <div className="flex flex-col items-center">
       

        <div className="mt-8 flex items-center justify-center flex-wrap gap-5">
                    {
                      socials.map((item, index) => (
                        <Link
                          href={item.href}
                          key={`social-link-${index}`}
                          target="_blank"
                        >
                          <Image src={item.icon} alt="social" width={30} height={30} />
                        </Link>
                      ))
                    }
                  </div>

                 <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2026 Touchtek. All rights reserved.</p>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
