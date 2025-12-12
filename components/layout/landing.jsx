"use client";
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";
import HeroCarousel from "@/components/layout/components/HeroCarousel";
import ProductCarousel from "@/components/layout/components/ProductCarousel";
import CategoryCarousel from "@/components/layout/components/CategoryCarousel";
import HotSellingCarousel from "@/components/layout/components/HotSellingCarousel";
import FeaturedCarousel from "@/components/layout/components/FeaturedCarousel";
import AnimatedCounter from "@/components/layout/components/AnimatedCounter";
import { products } from "@/components/layout/data/products";
import { motion } from "framer-motion";

export default function Home() {
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Explore Our Catalog Section */}
        <CategoryCarousel />

        {/* Hot Selling Products Section */}
        <HotSellingCarousel products={products} />



        <FeaturedCarousel products={products} />

        {/* Featured Products Section */}
        {/* <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular and innovative products with
                cutting-edge technology
              </p>
            </motion.div>

            <ProductCarousel products={featuredProducts} title="" subtitle="" />
          </div>
        </section> */}

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-black to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter end={50} suffix="+" />
                </div>
                <p className="text-gray-300">Products</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter end={10000} suffix="+" />
                </div>
                <p className="text-gray-300">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <p className="text-gray-300">Satisfaction Rate</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter end={24} suffix="/7" />
                </div>
                <p className="text-gray-300">Support</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
