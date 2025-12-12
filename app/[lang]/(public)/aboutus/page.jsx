'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Users, Award, Globe, TrendingUp, Heart, 
  CheckCircle, Zap, Shield, Package, Rocket, Star,
  MapPin, Building, ChevronRight, Sparkles, Factory,
  Truck, HeadphonesIcon, ThumbsUp 
} from 'lucide-react';

import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";

const stats = [
  { value: '2016', label: 'Established', icon: Building },
  { value: '150+', label: 'Team Members', icon: Users },
  { value: '5+', label: 'Warehouses', icon: Factory },
  { value: '10+', label: 'Countries', icon: Globe }
];

const values = [
  {
    icon: Heart,
    title: 'Passion for Quality',
    description: 'Our motto drives every decision we make, ensuring excellence in every product.',
    color: 'from-red-400 to-red-600'
  },
  {
    icon: Zap,
    title: 'Innovation First',
    description: 'We stay ahead of tech trends, bringing you the latest innovations in mobile accessories.',
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    icon: ThumbsUp,
    title: 'Customer Focus',
    description: 'Building long-term partnerships through consistent performance and timely support.',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Shield,
    title: 'Trust & Reliability',
    description: 'Delivering quality products at competitive prices, backed by our commitment to excellence.',
    color: 'from-green-400 to-green-600'
  }
];

const milestones = [
  { year: '2016', title: 'Founded', description: 'Touchtek established with a vision to revolutionize mobile accessories' },
  { year: '2018', title: 'Expanded Range', description: 'Launched comprehensive product line including batteries and power banks' },
  { year: '2020', title: 'Global Reach', description: 'Expanded operations to multiple countries across Asia' },
  { year: '2023', title: 'Innovation Hub', description: 'Opened advanced R&D center for next-gen products' },
  { year: '2025', title: 'Industry Leader', description: 'Recognized as a leading wholesaler with 150+ team members' }
];

const products = [
  { name: 'Chargers', icon: '⚡', count: '50+ Models' },
  { name: 'Data Cables', icon: '🔌', count: '30+ Variants' },
  { name: 'Earbuds & TWS', icon: '🎧', count: '25+ Designs' },
  { name: 'Neckbands', icon: '🎵', count: '15+ Options' },
  { name: 'Power Banks', icon: '🔋', count: '20+ Capacities' },
  { name: 'Batteries', icon: '🔌', count: 'Lithium & Polymer' }
];

const team = [
  {
    name: 'Manufacturing',
    description: 'State-of-the-art production facilities',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
  },
  {
    name: 'Quality Control',
    description: 'Rigorous testing and certification',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'
  },
  {
    name: 'Innovation',
    description: 'Advanced R&D and design team',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
  },
  {
    name: 'Distribution',
    description: 'Global logistics and warehousing',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">Passion for Quality Since 2016</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Powering Innovation in
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mobile Accessories
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Leading the industry with innovation, quality, and value. We're your trusted partner 
                for cutting-edge tech accessories that power your connected life.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/products"
                  className="bg-white text-black px-8 py-3 rounded-lg hover:shadow-2xl transition-all font-semibold inline-flex items-center gap-2"
                >
                  Explore Products
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-all font-semibold"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z" fill="rgb(249, 250, 251)"/>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 -mt-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-2xl transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Story */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Our Story</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Pioneering Excellence in Mobile Accessories
                </h2>
                
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Touchtek</strong> is a leading name in the mobile accessories industry, committed to 
                    delivering innovation, quality, and value since our establishment in <strong>2016</strong>. 
                    As a trusted wholesaler and brand, we specialize in a wide range of tech products including 
                    chargers, data cables, neckbands, earbuds, power banks, Bluetooth TWS, lithium/polymer batteries, 
                    and much more.
                  </p>
                  
                  <p>
                    At Touchtek, our motto <strong>"Passion for Quality"</strong> drives everything we do. With a 
                    dedicated team of over <strong>150 professionals</strong>, <strong>5+ warehouses</strong>, and 
                    a growing presence across multiple countries, we constantly strive to offer the latest technology 
                    at competitive prices.
                  </p>
                  
                  <p>
                    We believe in building long-term partnerships with our clients by ensuring consistent product 
                    performance, sleek design, and timely support. Whether you're looking for everyday essentials 
                    or the next big innovation in tech accessories, Touchtek is your go-to destination.
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <a
                    href="/products"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all font-semibold inline-flex items-center gap-2"
                  >
                    View Products
                    <ChevronRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/warranty"
                    className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-black hover:bg-gray-50 transition-all font-semibold"
                  >
                    Warranty Info
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop"
                    alt="Touchtek Office"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                {/* Floating Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">9+ Years</div>
                      <div className="text-sm text-gray-600">Industry Excellence</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-4 py-2 mb-4">
                <Heart className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">Our Values</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our core values shape our culture and guide our commitment to excellence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Range */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-2 mb-4">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Product Range</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Tech Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From everyday essentials to cutting-edge innovations
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-black hover:shadow-xl transition-all group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{product.icon}</div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-600">{product.count}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-8 py-3 rounded-lg hover:shadow-2xl transition-all font-semibold"
              >
                Explore All Products
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
                <Rocket className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold">Our Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Milestones of Excellence</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                A decade of innovation, growth, and success
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-col`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-inherit`}>
                      <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-sm text-gray-300">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Center Dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-4 border-gray-900 shadow-lg"></div>
                    </div>

                    <div className="flex-1 hidden md:block"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team/Operations */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-2 mb-4">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-600">Our Operations</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Excellence Across Every Function
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                150+ professionals dedicated to bringing you the best
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((dept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg mb-4">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">{dept.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Partner with Us?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers worldwide. Experience the Touchtek difference today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:shadow-2xl transition-all font-semibold inline-flex items-center gap-2"
                >
                  Browse Products
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-all font-semibold"
                >
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
