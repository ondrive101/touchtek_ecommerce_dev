"use client";
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";
import HeroCarousel from "@/components/layout/components/HeroCarousel";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { getProducts } from "@/action/common";
// import Unauthorized from "@/components/unauthorised";
import LayoutLoader from "@/components/layout-loader";
import ProductCarousel from "@/components/layout/components/ProductCarousel";
import CategoryCarousel from "@/components/layout/components/CategoryCarousel";
import HotSellingCarousel from "@/components/layout/components/HotSellingCarousel";
import FeaturedCarousel from "@/components/layout/components/FeaturedCarousel";
import UpcommingCarousel from "@/components/layout/components/UpcommingCarousel";
import NewArrivalsCarousel from "@/components/layout/components/NewArrivalsCarousel";


import AnimatedCounter from "@/components/layout/components/AnimatedCounter";
// import { products } from "@/components/layout/data/products";
import { motion } from "framer-motion";

export default function Home() {
  const [filters, setFilters] = useState({ source: "landing" });

  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);


   const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch: productsRefetch,
  } = useQuery({
    queryKey: ["products-landing", filters],
    queryFn: () => getProducts(filters),
    enabled: true,
    staleTime: 30 * 1000,
  });

    useEffect(() => {
    if (productsData) {
      console.log("productsData received", productsData?.data?.payload?.products);
      setProducts(productsData?.data?.payload?.products || []);
      setBanners(productsData?.data?.payload?.banners || []);
    }

  }, [productsData]);


   if (productsLoading) {
    return <LayoutLoader />;
  }

  // if (productsError) {
  //   return <Unauthorized errorCode={5633} />;
  // }


  const upcommingProducts = products
    .filter((product) => product.is_upcoming)
    .slice(0, 10);


     const hotSellingProducts = products
    .filter((product) => product.is_hot_selling)
    .slice(0, 10);

    const newArrivalProducts = products
    .filter((product) => product.is_new_arrival)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Carousel */}
       {banners.length > 0 && <HeroCarousel  banners={banners} /> }

        {/* Explore Our Catalog Section */}
        <CategoryCarousel />

        {/* Hot Selling Products Section */}

        {newArrivalProducts.length > 0 && <NewArrivalsCarousel products={newArrivalProducts} />}

        {hotSellingProducts.length > 0 && <HotSellingCarousel products={hotSellingProducts}/>}

        {upcommingProducts.length > 0 && <UpcommingCarousel products={upcommingProducts} />}

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
