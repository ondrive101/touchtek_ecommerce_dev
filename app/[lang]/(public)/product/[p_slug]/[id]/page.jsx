'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";
import { products } from "@/components/layout/data/products";
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Shield, Truck, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id;
  const productSlug = params.slug;
  
  const product = products.find(p => p.id === productId && p.slug === productSlug);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link
              href="/products"
              className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Create multiple images for gallery (using the same image with different parameters for demo)
  const productImages = [
    product.image,
    product.image + '&brightness=110',
    product.image + '&contrast=110',
    product.image + '&saturation=90'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-800 hover:text-black mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-gray-800 ring-2 ring-gray-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Category and Featured Badge */}
              <div className="flex items-center gap-3">
                <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="bg-gradient-to-r from-gray-800 to-black text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gray-700 text-gray-700" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8 out of 5)</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">127 reviews</span>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                <ul className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{spec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  className="bg-white rounded-xl p-4 text-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Shield className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Warranty</h4>
                  <p className="text-sm text-gray-600">2 Year Coverage</p>
                </motion.div>
                
                <motion.div
                  className="bg-white rounded-xl p-4 text-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Truck className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On all orders</p>
                </motion.div>
                
                <motion.div
                  className="bg-white rounded-xl p-4 text-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Award className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Quality</h4>
                  <p className="text-sm text-gray-600">Premium Grade</p>
                </motion.div>
              </div>

              {/* Contact CTA */}
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Interested in this product?</h3>
                <p className="text-gray-200 mb-4">
                  Get in touch with our team for more information or bulk orders.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-center"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/products"
                    className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-gray-800 transition-colors text-center"
                  >
                    View More Products
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Products</h2>
              <p className="text-gray-600">Discover more products in the {product.category} category</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {relatedProduct.description}
                      </p>
                      <Link
                        href={`/product/${relatedProduct.id}/${relatedProduct.slug}`}
                        className="text-gray-800 hover:text-black text-sm font-semibold"
                      >
                        View Details →
                      </Link>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
