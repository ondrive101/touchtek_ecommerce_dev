'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from "next/image";
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Battery, Headphones, Zap } from 'lucide-react';
import Airpod from "@/public/images/touchtek/Airpod.jpeg";
import Cable from "@/public/images/touchtek/Cable.jpeg";
import Charger from "@/public/images/touchtek/Charger.jpeg";
import Earphone from "@/public/images/touchtek/Earphone.jpeg";
import Headphone from "@/public/images/touchtek/Headphone.jpeg";
import Neckband from "@/public/images/touchtek/Neckband.jpeg";
import Powerbank from "@/public/images/touchtek/Powerbank.jpeg";
import Speaker from "@/public/images/touchtek/Speaker.jpeg";
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const categories = [
  // {
  //   id: 'battery',
  //   name: 'Batteries',
  //   description: 'Fast charging & long-lasting',
  //   icon: Battery,
  //   productCount: 15,
  //   image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop&crop=center',
  //   href: '/products?category=Battery'
  // },
  // {
  //   id: 'polymer',
  //   name: 'Polymer',
  //   description: 'Advanced polymer batteries',
  //   icon: Battery,
  //   productCount: 8,
  //   image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
  //   href: '/products?category=Polymer'
  // },
  // {
  //   id: 'lithium',
  //   name: 'Lithium',
  //   description: 'High-performance lithium batteries',
  //   icon: Battery,
  //   productCount: 12,
  //   image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop&crop=center',
  //   href: '/products?category=Lithium'
  // },
  {
    id: 'headphone',
    name: 'Head Phone',
    description: 'Premium sound quality',
    icon: Headphones,
    productCount: 12,
    image: Headphone,
    href: '/en/products?category=headphones&parentCategory=accessories'
  },
  {
    id: 'tws',
    name: 'TWS',
    description: 'True wireless earbuds',
    icon: Headphones,
    productCount: 10,
    image: Airpod,
    href: '/en/products?category=tws&parentCategory=accessories'
  },
  {
    id: 'neckbands',
    name: 'Neckbands',
    description: 'Comfortable neckband headphones',
    icon: Headphones,
    productCount: 6,
    image: Neckband,
    href: '/en/products?category=neckbands&parentCategory=accessories'
  },
  {
    id: 'earphones',
    name: 'Earphones',
    description: 'Wired earphones',
    icon: Headphones,
    productCount: 8,
    image: Earphone,
    href: '/en/products?category=earphones&parentCategory=accessories'
  },
  {
    id: 'speaker',
    name: 'Speaker',
    description: 'Bluetooth speakers',
    icon: Headphones,
    productCount: 5,
    image: Speaker,
    href: '/en/products?category=speakers&parentCategory=accessories'
  },
  // {
  //   id: 'accessories',
  //   name: 'Accessories',
  //   description: 'Smart charging solutions',
  //   icon: Zap,
  //   productCount: 18,
  //   image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&crop=center',
  //   href: '/products?category=Accessories'
  // },
  {
    id: 'charger',
    name: 'Charger',
    description: 'Fast charging solutions',
    icon: Zap,
    productCount: 15,
    image: Charger,
    href: '/en/products?category=chargers&parentCategory=accessories'
  },
  // {
  //   id: 'car-charger',
  //   name: 'Car Charger',
  //   description: 'Mobile car charging',
  //   icon: Zap,
  //   productCount: 7,
  //   image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center&contrast=120',
  //   href: '/products?category=Car Charger'
  // },
  {
    id: 'data-cable',
    name: 'Data Cable',
    description: 'High-speed data cables',
    icon: Zap,
    productCount: 20,
    image: Cable,
    href: '/en/products?category=cables&parentCategory=accessories'
  },
  // {
  //   id: 'connector',
  //   name: 'Connector',
  //   description: 'Universal connectors',
  //   icon: Zap,
  //   productCount: 12,
  //   image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop&crop=center',
  //   href: '/products?category=Connector'
  // },
  {
    id: 'power-bank',
    name: 'Power Bank',
    description: 'Portable power solutions',
    icon: Battery,
    productCount: 10,
    image: Powerbank,
    href: '/en/products?category=powerbanks&parentCategory=accessories'
  },
  // {
  //   id: 'combo',
  //   name: 'Combo',
  //   description: 'Product combinations',
  //   icon: Zap,
  //   productCount: 8,
  //   image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&crop=center&hue=60',
  //   href: '/products?category=Combo'
  // },
  // {
  //   id: 'cover',
  //   name: 'Cover',
  //   description: 'Protective covers',
  //   icon: Zap,
  //   productCount: 25,
  //   image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop&crop=center&brightness=120',
  //   href: '/products?category=Cover'
  // },
  // {
  //   id: 'tempered-glass',
  //   name: 'Tempered Glass',
  //   description: 'Screen protection',
  //   icon: Zap,
  //   productCount: 18,
  //   image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop&crop=center&brightness=130',
  //   href: '/products?category=Tempered Glass'
  // }
];

export default function CategoryCarousel() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-4">
            Explore Our Catalog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our diverse range of categories and find the perfect products for your needs
          </p>
        </motion.div>

        {/* Category Carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
            }}
            className="category-carousel"
          >
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <SwiperSlide key={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={category.href}>
                      <div className="group rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                        {/* Category Image with Text Overlay */}
                        <div className="relative h-40 overflow-hidden">
                          {/* <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          /> */}
                          <Image src={category?.image} alt={category?.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          {/* Category Name Overlay */}
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white text-base font-bold drop-shadow-lg">
                              {category.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>

          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group"
            aria-label="Next category"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
