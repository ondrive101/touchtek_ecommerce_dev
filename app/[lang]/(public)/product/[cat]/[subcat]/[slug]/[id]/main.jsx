// app/products/[id]/page.jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getProductById } from '@/action/common';
import Header from '@/components/layout/components/Header';
import Footer from '@/components/layout/components/Footer';
import Gallery from './components/gallery';
import ProductInfo from './components/product-info';
import BannersLayout from './components/banner-layout';
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

  const product = productData?.data?.product;
  const relatedProducts = productData?.data?.relatedProducts || [];
  const allImages = product?.images || [];

  // Unique colors for swatches (one entry per colorName)
  const colorOptions = useMemo(() => {
    const map = new Map();
    for (const img of allImages) {
      const name = (img?.colorName || '').trim();
      if (!name) continue;
      if (!map.has(name.toLowerCase())) {
        map.set(name.toLowerCase(), {
          value: name,
          image: img.image || img.fileUrl,
          id: img.id,
          skuId: img.skuCode || product?.skuCode,
        });
      }
    }
    return Array.from(map.values());
  }, [allImages, product?.skuCode]);

  const [selectedColor, setSelectedColor] = useState('');

  // Set / reset selected color when product loads or changes
  useEffect(() => {
    if (colorOptions.length > 0) {
      setSelectedColor(colorOptions[0].value);
    } else {
      setSelectedColor('');
    }
  }, [product?.skuCode, colorOptions]);

  // Gallery only shows images for the selected color
  const galleryImages = useMemo(() => {
    if (!selectedColor) return allImages;
    return allImages.filter(
      (img) =>
        (img?.colorName || '').trim().toLowerCase() ===
        selectedColor.trim().toLowerCase()
    );
  }, [allImages, selectedColor]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <StickyHeader product={product}/>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/en/products"
              className="inline-flex items-center gap-2 text-gray-800 hover:text-orange-600 mb-4 group font-semibold"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Link>
          </motion.div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-20">
            {/* Gallery - filtered by selected color */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="order-1 lg:order-1 lg:sticky lg:top-24 self-start"
            >
              <Gallery
                key={selectedColor || product.skuCode}
                images={galleryImages}
              />
            </motion.div>

            {/* Product Info - controls selected color */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 lg:order-2 space-y-6 lg:pr-8"
            >
              <ProductInfo
                product={product}
                colorOptions={colorOptions}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            </motion.div>
          </section>
        </div>

        {/* Hero */}
        <Hero banners={product?.banners || []}  videos={product?.videos || []}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
        {/* <BannersLayout/> */}
  {/* Content sections */}
          <section className="space-y-8">
            {product?.specifications && (
              <Specifications specifications={product?.specifications} />
            )}
            {product?.about?.length > 0 && <About about={product?.about} />}
            <Reviews reviews = {product?.reviews}/>
          </section>
        </div>


        {/* Related products */}
        <RelatedProducts
          products={relatedProducts}
          category={product?.categoryId}
        />
      </main>

      {/* <Footer /> */}
    </div>
  );
}
