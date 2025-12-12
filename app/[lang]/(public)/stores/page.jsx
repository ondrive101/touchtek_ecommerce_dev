'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Store, Clock, Phone, Users, Award, Star,
  ChevronRight, Sparkles, Target, TrendingUp
} from 'lucide-react';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";

const states = [
  { id: 'maharashtra', name: 'Maharashtra', stores: 12, cities: 'Mumbai, Pune, Nagpur', color: 'from-indigo-400 to-blue-500' },
  { id: 'delhi', name: 'Delhi NCR', stores: 8, cities: 'Delhi, Noida, Gurgaon', color: 'from-red-400 to-pink-500' },
  { id: 'karnataka', name: 'Karnataka', stores: 7, cities: 'Bengaluru, Mysore', color: 'from-green-400 to-emerald-500' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', stores: 6, cities: 'Chennai, Coimbatore', color: 'from-orange-400 to-yellow-500' },
  { id: 'gujarat', name: 'Gujarat', stores: 5, cities: 'Ahmedabad, Surat', color: 'from-purple-400 to-violet-500' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', stores: 4, cities: 'Lucknow, Kanpur', color: 'from-blue-400 to-cyan-500' },
  { id: 'rajasthan', name: 'Rajasthan', stores: 3, cities: 'Jaipur, Udaipur', color: 'from-rose-400 to-fuchsia-500' },
  { id: 'kerala', name: 'Kerala', stores: 3, cities: 'Kochi, Trivandrum', color: 'from-teal-400 to-emerald-500' },
  { id: 'punjab', name: 'Punjab', stores: 2, cities: 'Chandigarh, Ludhiana', color: 'from-amber-400 to-orange-500' },
  { id: 'west-bengal', name: 'West Bengal', stores: 2, cities: 'Kolkata', color: 'from-sky-400 to-blue-500' },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', stores: 2, cities: 'Hyderabad, Visakhapatnam', color: 'from-lime-400 to-green-500' },
  { id: 'telangana', name: 'Telangana', stores: 1, cities: 'Hyderabad', color: 'from-emerald-400 to-teal-500' }
];

const stores = [
  // Maharashtra (12 stores)
  { id: 1, name: 'Touchtek Mumbai Central', address: 'Andheri East, Mumbai MH 400059', phone: '+91 22 1234 5678', hours: '10AM - 8PM', rating: 4.9, state: 'maharashtra' },
  { id: 2, name: 'Touchtek Pune Hinjewadi', address: 'Hinjewadi Phase 1, Pune MH 411057', phone: '+91 20 8765 4321', hours: '9:30AM - 7:30PM', rating: 4.8, state: 'maharashtra' },
  { id: 3, name: 'Touchtek Nagpur', address: 'Sitabuldi, Nagpur MH 440012', phone: '+91 712 3456 7890', hours: '10AM - 8PM', rating: 4.7, state: 'maharashtra' },
  { id: 4, name: 'Touchtek Mumbai Bandra', address: 'Bandra West, Mumbai MH 400050', phone: '+91 22 5678 9012', hours: '10AM - 9PM', rating: 4.9, state: 'maharashtra' },
  { id: 5, name: 'Touchtek Nashik', address: 'College Road, Nashik MH 422001', phone: '+91 253 2345 6789', hours: '9:30AM - 7PM', rating: 4.6, state: 'maharashtra' },
  { id: 6, name: 'Touchtek Aurangabad', address: 'CIDCO, Aurangabad MH 431003', phone: '+91 240 1234 5678', hours: '10AM - 8PM', rating: 4.8, state: 'maharashtra' },
  { id: 7, name: 'Touchtek Thane', address: 'Ghodbunder Road, Thane MH 400607', phone: '+91 22 6789 0123', hours: '10AM - 8PM', rating: 4.9, state: 'maharashtra' },
  { id: 8, name: 'Touchtek Kolhapur', address: 'Tarabai Park, Kolhapur MH 416003', phone: '+91 231 4567 8901', hours: '9:30AM - 7:30PM', rating: 4.7, state: 'maharashtra' },
  { id: 9, name: 'Touchtek Solapur', address: 'Hotgi Road, Solapur MH 413001', phone: '+91 217 8901 2345', hours: '10AM - 7PM', rating: 4.6, state: 'maharashtra' },
  { id: 10, name: 'Touchtek Amravati', address: 'Morshi Road, Amravati MH 444602', phone: '+91 721 2345 6789', hours: '9:30AM - 7PM', rating: 4.8, state: 'maharashtra' },
  { id: 11, name: 'Touchtek Akola', address: 'Murtizapur Road, Akola MH 444001', phone: '+91 724 5678 9012', hours: '10AM - 8PM', rating: 4.7, state: 'maharashtra' },
  { id: 12, name: 'Touchtek Nanded', address: 'Vazirabad, Nanded MH 431601', phone: '+91 2462 1234 5678', hours: '9:30AM - 7PM', rating: 4.6, state: 'maharashtra' },

  // Delhi NCR (8 stores)
  { id: 13, name: 'Touchtek Delhi CP', address: 'Connaught Place, New Delhi DL 110001', phone: '+91 11 2345 6789', hours: '10AM - 9PM', rating: 4.9, state: 'delhi' },
  { id: 14, name: 'Touchtek Noida', address: 'Sector 18, Noida UP 201301', phone: '+91 120 3456 7890', hours: '10AM - 8PM', rating: 4.8, state: 'delhi' },
  { id: 15, name: 'Touchtek Gurgaon', address: 'MG Road, Gurgaon HR 122001', phone: '+91 124 4567 8901', hours: '10AM - 9PM', rating: 4.9, state: 'delhi' },
  { id: 16, name: 'Touchtek Delhi Rohini', address: 'Rohini Sector 3, Delhi DL 110085', phone: '+91 11 6789 0123', hours: '10AM - 8PM', rating: 4.7, state: 'delhi' },
  { id: 17, name: 'Touchtek Faridabad', address: 'Neharpar, Faridabad HR 121002', phone: '+91 129 7890 1234', hours: '9:30AM - 7:30PM', rating: 4.8, state: 'delhi' },
  { id: 18, name: 'Touchtek Ghaziabad', address: 'Vaishali, Ghaziabad UP 201010', phone: '+91 120 8901 2345', hours: '10AM - 8PM', rating: 4.7, state: 'delhi' },
  { id: 19, name: 'Touchtek Delhi Saket', address: 'Saket District Centre, Delhi DL 110017', phone: '+91 11 9012 3456', hours: '10AM - 9PM', rating: 4.9, state: 'delhi' },
  { id: 20, name: 'Touchtek Dwarka', address: 'Sector 10, Dwarka Delhi DL 110075', phone: '+91 11 0123 4567', hours: '9:30AM - 7:30PM', rating: 4.8, state: 'delhi' },

  // Karnataka (7 stores)
  { id: 21, name: 'Touchtek Bengaluru Whitefield', address: 'Whitefield, Bengaluru KA 560066', phone: '+91 80 3456 7890', hours: '10AM - 8PM', rating: 5.0, state: 'karnataka' },
  { id: 22, name: 'Touchtek Bengaluru Jayanagar', address: 'Jayanagar 4th Block, Bengaluru KA 560011', phone: '+91 80 4567 8901', hours: '10AM - 9PM', rating: 4.9, state: 'karnataka' },
  { id: 23, name: 'Touchtek Mysore', address: 'JLN Road, Mysore KA 570008', phone: '+91 821 5678 9012', hours: '9:30AM - 7:30PM', rating: 4.8, state: 'karnataka' },
  { id: 24, name: 'Touchtek Mangalore', address: 'Kadri, Mangalore KA 575002', phone: '+91 824 6789 0123', hours: '10AM - 8PM', rating: 4.7, state: 'karnataka' },
  { id: 25, name: 'Touchtek Hubli', address: 'Deshpande Nagar, Hubli KA 580021', phone: '+91 836 7890 1234', hours: '9:30AM - 7PM', rating: 4.8, state: 'karnataka' },
  { id: 26, name: 'Touchtek Belgaum', address: 'Shahapur, Belgaum KA 590001', phone: '+91 831 8901 2345', hours: '10AM - 8PM', rating: 4.7, state: 'karnataka' },
  { id: 27, name: 'Touchtek Davangere', address: 'PJ Extension, Davangere KA 577002', phone: '+91 8192 9012 3456', hours: '9:30AM - 7PM', rating: 4.6, state: 'karnataka' },

  // Tamil Nadu (6 stores)
  { id: 28, name: 'Touchtek Chennai Anna Nagar', address: 'Anna Nagar, Chennai TN 600040', phone: '+91 44 1234 5678', hours: '10AM - 9PM', rating: 4.9, state: 'tamil-nadu' },
  { id: 29, name: 'Touchtek Coimbatore', address: 'RS Puram, Coimbatore TN 641002', phone: '+91 422 2345 6789', hours: '10AM - 8PM', rating: 4.8, state: 'tamil-nadu' },
  { id: 30, name: 'Touchtek Madurai', address: 'KK Nagar, Madurai TN 625020', phone: '+91 452 3456 7890', hours: '9:30AM - 7:30PM', rating: 4.7, state: 'tamil-nadu' },
  { id: 31, name: 'Touchtek Salem', address: 'Four Roads, Salem TN 636001', phone: '+91 427 4567 8901', hours: '10AM - 8PM', rating: 4.8, state: 'tamil-nadu' },
  { id: 32, name: 'Touchtek Trichy', address: 'Cantt Road, Trichy TN 620001', phone: '+91 431 5678 9012', hours: '9:30AM - 7PM', rating: 4.7, state: 'tamil-nadu' },
  { id: 33, name: 'Touchtek Erode', address: 'NGGO Colony, Erode TN 638011', phone: '+91 424 6789 0123', hours: '10AM - 8PM', rating: 4.6, state: 'tamil-nadu' },

  // Gujarat (5 stores)
  { id: 34, name: 'Touchtek Ahmedabad', address: 'CG Road, Ahmedabad GJ 380009', phone: '+91 79 1234 5678', hours: '10AM - 9PM', rating: 4.9, state: 'gujarat' },
  { id: 35, name: 'Touchtek Surat', address: 'Adajan, Surat GJ 395009', phone: '+91 261 2345 6789', hours: '10AM - 8PM', rating: 4.8, state: 'gujarat' },
  { id: 36, name: 'Touchtek Vadodara', address: 'Alkapuri, Vadodara GJ 390007', phone: '+91 265 3456 7890', hours: '9:30AM - 7:30PM', rating: 4.7, state: 'gujarat' },
  { id: 37, name: 'Touchtek Rajkot', address: '150 Feet Ring Road, Rajkot GJ 360005', phone: '+91 281 4567 8901', hours: '10AM - 8PM', rating: 4.8, state: 'gujarat' },
  { id: 38, name: 'Touchtek Vapi', address: 'GIDC, Vapi GJ 396195', phone: '+91 260 5678 9012', hours: '9:30AM - 7PM', rating: 4.7, state: 'gujarat' },

  // Uttar Pradesh (4 stores)
  { id: 39, name: 'Touchtek Lucknow', address: 'Hazratganj, Lucknow UP 226001', phone: '+91 522 1234 5678', hours: '10AM - 8PM', rating: 4.8, state: 'uttar-pradesh' },
  { id: 40, name: 'Touchtek Kanpur', address: 'Mall Road, Kanpur UP 208001', phone: '+91 512 2345 6789', hours: '9:30AM - 7:30PM', rating: 4.7, state: 'uttar-pradesh' },
  { id: 41, name: 'Touchtek Agra', address: 'Sanjay Place, Agra UP 282002', phone: '+91 562 3456 7890', hours: '10AM - 8PM', rating: 4.6, state: 'uttar-pradesh' },
  { id: 42, name: 'Touchtek Varanasi', address: 'Godowlia, Varanasi UP 221001', phone: '+91 544 4567 8901', hours: '9:30AM - 7PM', rating: 4.8, state: 'uttar-pradesh' },

  // Rajasthan (3 stores)
  { id: 43, name: 'Touchtek Jaipur', address: 'MI Road, Jaipur RJ 302001', phone: '+91 141 1234 5678', hours: '10AM - 9PM', rating: 4.9, state: 'rajasthan' },
  { id: 44, name: 'Touchtek Udaipur', address: 'City Palace Road, Udaipur RJ 313001', phone: '+91 294 2345 6789', hours: '10AM - 8PM', rating: 4.8, state: 'rajasthan' },
  { id: 45, name: 'Touchtek Jodhpur', address: 'Sardarpura, Jodhpur RJ 342003', phone: '+91 291 3456 7890', hours: '9:30AM - 7:30PM', rating: 4.7, state: 'rajasthan' },

  // Kerala (3 stores)
  { id: 46, name: 'Touchtek Kochi', address: 'MG Road, Kochi KL 682011', phone: '+91 484 1234 5678', hours: '10AM - 8PM', rating: 4.9, state: 'kerala' },
  { id: 47, name: 'Touchtek Trivandrum', address: 'MG Road, Trivandrum KL 695001', phone: '+91 471 2345 6789', hours: '9:30AM - 7:30PM', rating: 4.8, state: 'kerala' },
  { id: 48, name: 'Touchtek Calicut', address: 'Mavoor Road, Calicut KL 673004', phone: '+91 495 3456 7890', hours: '10AM - 8PM', rating: 4.7, state: 'kerala' },

  // Punjab (2 stores)
  { id: 49, name: 'Touchtek Chandigarh', address: 'Sector 17, Chandigarh CH 160017', phone: '+91 172 1234 5678', hours: '10AM - 9PM', rating: 4.9, state: 'punjab' },
  { id: 50, name: 'Touchtek Ludhiana', address: 'Ferozepur Road, Ludhiana PB 141001', phone: '+91 161 2345 6789', hours: '10AM - 8PM', rating: 4.8, state: 'punjab' },

  // West Bengal (2 stores)
  { id: 51, name: 'Touchtek Kolkata Park Street', address: 'Park Street, Kolkata WB 700016', phone: '+91 33 1234 5678', hours: '10AM - 9PM', rating: 4.9, state: 'west-bengal' },
  { id: 52, name: 'Touchtek Howrah', address: 'GT Road, Howrah WB 711101', phone: '+91 33 2345 6789', hours: '9:30AM - 7:30PM', rating: 4.7, state: 'west-bengal' },

  // Andhra Pradesh (2 stores)
  { id: 53, name: 'Touchtek Visakhapatnam', address: 'MVP Colony, Visakhapatnam AP 530017', phone: '+91 891 1234 5678', hours: '10AM - 8PM', rating: 4.8, state: 'andhra-pradesh' },
  { id: 54, name: 'Touchtek Vijayawada', address: 'Benz Circle, Vijayawada AP 520010', phone: '+91 866 2345 6789', hours: '9:30AM - 7:30PM', rating: 4.7, state: 'andhra-pradesh' },

  // Telangana (1 store)
  { id: 55, name: 'Touchtek Hyderabad Gachibowli', address: 'Gachibowli, Hyderabad TS 500032', phone: '+91 40 3456 7890', hours: '10AM - 9PM', rating: 5.0, state: 'telangana' }
];

export default function StoresPage() {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  const filteredStores = selectedState ? stores.filter(store => store.state === selectedState.id) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 overflow-hidden">
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
                <span className="text-sm font-semibold">150+ Locations Across India</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Nearest
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Touchtek Store
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover our extensive network of stores across India. Walk in today for premium mobile accessories and expert advice.
              </p>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0 ">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z" fill="rgb(249, 250, 251)"/>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 -mt-12 relative z-10 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '50+', label: 'Cities', icon: MapPin },
                { value: '150+', label: 'Stores', icon: Store },
                { value: '12', label: 'States', icon: Target },
                { value: '4.9', label: 'Avg Rating', icon: Award }
              ].map((stat, index) => (
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* States Map Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-2 mb-4">
              <Store className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-600">Store Network</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Stores Across India</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click any state to view stores or hover to preview
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {states.map((state, index) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
                onClick={() => setSelectedState(state)}
                whileHover={{ y: -8 }}
              >
                <div className={`relative bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:border-black hover:shadow-2xl transition-all cursor-pointer h-[140px] flex flex-col justify-between overflow-hidden ${hoveredState?.id === state.id || selectedState?.id === state.id ? 'ring-4 ring-blue-500/20 shadow-2xl border-blue-500 scale-[1.02]' : ''}`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${state.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{state.name}</h3>
                    <p className="text-xs text-gray-600">{state.stores} stores</p>
                  </div>
                  
                  {/* Hover Preview */}
                  {(hoveredState?.id === state.id || selectedState?.id === state.id) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col p-4 text-white text-left"
                    >
                      <p className="text-xs mb-1 opacity-75">{state.cities}</p>
                      <div className="text-sm font-bold mb-2">{state.stores} Locations</div>
                      <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
                        <ChevronRight className="w-3 h-3" />
                        <span>View Stores</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected State Stores */}
          {selectedState && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-16"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${selectedState.color} rounded-xl flex items-center justify-center`}>
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedState.name}</h3>
                    <p className="text-sm text-gray-600">{selectedState.stores} stores • {selectedState.cities}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedState(null)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black font-medium"
                >
                  Clear Filter
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store, index) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:border-black hover:shadow-xl transition-all h-full">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-black">{store.name}</h4>
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{store.rating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 leading-relaxed">{store.address}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <a href={`tel:${store.phone}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">{store.phone}</a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{store.hours}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button className="flex-1 bg-gradient-to-r from-black to-gray-800 text-white py-2 px-4 rounded-lg hover:shadow-xl transition-all font-semibold text-sm flex items-center justify-center gap-2">
                          Get Directions
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm">
                          Call Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Nationwide Coverage CTA */}
          <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">Expanding Nationwide</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Coming Soon to Your City</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                We're rapidly expanding. Stay updated on new store openings near you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg flex items-center gap-3 justify-center">
                  <MapPin className="w-5 h-5" />
                  Notify Me
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all font-bold text-lg">
                  View All Stores
                </button>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
