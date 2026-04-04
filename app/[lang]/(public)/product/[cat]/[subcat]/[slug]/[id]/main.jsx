// app/products/[id]/page.jsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getProductById } from '@/action/common';
import Header from '@/components/layout/components/Header';
import Footer from '@/components/layout/components/Footer';
import Gallery from './components/gallery';
import ProductInfo from './components/product-info';
import Specifications from './components/specification';
import About from './components/about';
import Reviews from './components/reviews';
import RelatedProducts from './components/related-products';
import Hero from './components/hero';
import Features from './components/features';
import StickyHeader from './components/sticky-header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id;

  const { data: productData, isLoading, isError } = useQuery({
    queryKey: ['product-by-id', productId],
    queryFn: () => getProductById(productId),
    staleTime: 30 * 1000,
  });

  console.log('productData', productData)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError || !productData?.data?.product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/products"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center gap-2 font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const product = productData.data.product;
  const variant = productData.data.variant;
  const variantTypes = productData.data.variantsTypes;
  const relatedVariants = productData.data.relatedVariants || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <StickyHeader product={product} variant={variant} />

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-800 hover:text-orange-600 mb-4 group font-semibold"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Link>
          </motion.div>

          {/* Product info and gallery layout - Normal scroll, perfect alignment */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-20">

  {/* Gallery - FIRST on mobile, LEFT on desktop */}
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="order-1 lg:order-1"
  >
    <Gallery images={variant.images || []} />
  </motion.div>

  {/* Product Info - SECOND on mobile, RIGHT on desktop */}
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="order-2 lg:order-2 space-y-6 lg:pr-8"
  >
    <ProductInfo product={product} variant={variant} types={variantTypes} />
  </motion.div>

</section>
          {/* Features */}
          <section className="space-y-8">
            <Features />
          </section>

        
        </div>
        {/* Hero */}
        <Hero banners={variant?.banners || []}  videos={variant?.videos || []}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
  {/* Content sections */}
          <section className="space-y-8">
            {variant.specifications?.length > 0 && (
              <Specifications specifications={variant.specifications} />
            )}
            {variant.about?.length > 0 && <About about={variant.about} />}
            <Reviews />
          </section>
        </div>


        {/* Related products */}
        <RelatedProducts
          products={relatedVariants}
          category={product?.subCategory?.name}
        />
      </main>

      <Footer />
    </div>
  );
}
