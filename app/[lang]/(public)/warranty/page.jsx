'use client';

import { useState } from 'react';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Upload, CheckCircle, FileText, Camera, AlertCircle, 
  Package, Clock, ArrowRight, Search, ChevronRight, Sparkles,
  Zap, Award, Users, Phone, Mail, MapPin
} from 'lucide-react';
import Link from 'next/link';

const issueTypes = [
  { id: 'not-working', label: 'Product Not Working', icon: '⚠️' },
  { id: 'physical-damage', label: 'Physical Damage', icon: '💔' },
  { id: 'battery', label: 'Battery Issues', icon: '🔋' },
  { id: 'charging', label: 'Charging Problems', icon: '⚡' },
  { id: 'audio', label: 'Audio Quality Issues', icon: '🎵' },
  { id: 'connectivity', label: 'Connectivity Problems', icon: '📡' },
  { id: 'other', label: 'Other', icon: '📝' }
];

const resolutionOptions = [
  { id: 'repair', label: 'Repair', description: 'Fix the existing product', icon: '🔧', color: 'blue' },
  { id: 'replacement', label: 'Replacement', description: 'Get a new product', icon: '🔄', color: 'green' },
  { id: 'refund', label: 'Refund', description: 'Get your money back', icon: '💰', color: 'purple' }
];

export default function WarrantyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderLookup, setOrderLookup] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    orderNumber: '',
    purchaseDate: '',
    productName: '',
    productCategory: '',
    serialNumber: '',
    issueType: '',
    issueDescription: '',
    preferredResolution: '',
    invoice: null,
    productImages: []
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, field) => {
    if (e.target.files) {
      if (field === 'invoice') {
        setFormData({ ...formData, invoice: e.target.files[0] });
      } else {
        setFormData({ ...formData, productImages: Array.from(e.target.files) });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Warranty claim submitted:', formData);
    setCurrentStep(5);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const stepTitles = ['Your Information', 'Order Details', 'Issue Description', 'Upload Evidence'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <main>
      {/* Hero Section with Particles */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Hassle-Free Warranty Claims</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Warranty Claim Center
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
                We stand behind our products. Submit your claim in minutes and let us take care of the rest.
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-8 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold mb-1">24h</div>
                  <div className="text-gray-400 text-xs">Response Time</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold mb-1">98%</div>
                  <div className="text-gray-400 text-xs">Approval Rate</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold mb-1">2 Years</div>
                  <div className="text-gray-400 text-xs">Full Coverage</div>
                </motion.div>
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

        {/* Benefits Cards */}
        <section className="py-12 -mt-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Zap, title: 'Quick Process', desc: 'Claims in 5 mins', gradient: 'from-yellow-400 to-yellow-600' },
                { icon: Shield, title: 'Full Coverage', desc: '2 year warranty', gradient: 'from-blue-400 to-blue-600' },
                { icon: Award, title: 'Quality First', desc: '98% approval', gradient: 'from-purple-400 to-purple-600' },
                { icon: Users, title: 'Expert Support', desc: '24/7 available', gradient: 'from-green-400 to-green-600' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Progress Tracker */}
        {currentStep < 5 && (
          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3, 4].map((step, index) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1 relative">
                        {/* Step Circle */}
                        <motion.div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-all duration-500 shadow-md relative z-10 ${
                            currentStep > step 
                              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white scale-105' 
                              : currentStep === step
                              ? 'bg-gradient-to-br from-black to-gray-700 text-white scale-105 ring-4 ring-gray-200'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          whileHover={{ scale: currentStep >= step ? 1.1 : 1 }}
                        >
                          {currentStep > step ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <span>{step}</span>
                          )}
                        </motion.div>
                        
                        {/* Step Label */}
                        <motion.span 
                          className={`text-xs font-medium mt-2 text-center transition-colors ${
                            currentStep >= step ? 'text-gray-900' : 'text-gray-400'
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {stepTitles[step - 1]}
                        </motion.span>
                      </div>
                      
                      {/* Connector Line */}
                      {step < 4 && (
                        <div className="flex-1 relative" style={{ marginTop: '-24px' }}>
                          <div className="h-1.5 bg-gray-100 rounded-full mx-3">
                            <motion.div
                              className={`h-full rounded-full transition-all duration-500 ${
                                currentStep > step 
                                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                  : 'bg-gray-100'
                              }`}
                              initial={{ width: '0%' }}
                              animate={{ width: currentStep > step ? '100%' : '0%' }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Current Step Info */}
                <motion.div
                  className="text-center bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-xs font-medium text-gray-600">Step {currentStep} of 4</p>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{stepTitles[currentStep - 1]}</h3>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Form Section */}
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {currentStep < 5 ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
                >
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Customer Information */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Users className="w-8 h-8 text-blue-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">Let's start with your details</h2>
                          <p className="text-sm text-gray-600">We'll use this to keep you updated on your claim</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              required
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-gray-900 placeholder:text-gray-400"
                              placeholder="John Doe"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address *
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  required
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-gray-900 placeholder:text-gray-400"
                                  placeholder="john@example.com"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number *
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="tel"
                                  id="phone"
                                  name="phone"
                                  required
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-gray-900 placeholder:text-gray-400"
                                  placeholder="+91 98765 43210"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Order Details */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Package className="w-8 h-8 text-purple-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your order</h2>
                          <p className="text-sm text-gray-600">Help us locate your purchase in our system</p>
                        </div>

                        {/* Quick Lookup */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-sm text-gray-900">Quick Lookup</h3>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">Enter your order number to auto-fill details</p>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                value={orderLookup}
                                onChange={(e) => setOrderLookup(e.target.value)}
                                placeholder="Order number or email"
                                className="w-full pl-9 pr-3 py-2 text-sm border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-gray-900 placeholder:text-gray-400"
                              />
                            </div>
                            <button
                              type="button"
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:shadow-lg transition-all font-semibold whitespace-nowrap"
                            >
                              Find
                            </button>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-x-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-white px-3 text-xs text-gray-500">Or enter manually</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="orderNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                Order Number *
                              </label>
                              <input
                                type="text"
                                id="orderNumber"
                                name="orderNumber"
                                required
                                value={formData.orderNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-gray-900 placeholder:text-gray-400"
                                placeholder="TT-12345"
                              />
                            </div>

                            <div>
                              <label htmlFor="purchaseDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                Purchase Date *
                              </label>
                              <input
                                type="date"
                                id="purchaseDate"
                                name="purchaseDate"
                                required
                                value={formData.purchaseDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-gray-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-2">
                              Product Name *
                            </label>
                            <input
                              type="text"
                              id="productName"
                              name="productName"
                              required
                              value={formData.productName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-gray-900 placeholder:text-gray-400"
                              placeholder="e.g., Diamond Exclusive Series"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="productCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Category *
                              </label>
                              <select
                                id="productCategory"
                                name="productCategory"
                                required
                                value={formData.productCategory}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all appearance-none bg-white text-gray-900"
                              >
                                <option value="">Select category</option>
                                <option value="Battery">Battery</option>
                                <option value="Audio">Audio</option>
                                <option value="Accessories">Accessories</option>
                              </select>
                            </div>

                            <div>
                              <label htmlFor="serialNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                Serial Number (Optional)
                              </label>
                              <input
                                type="text"
                                id="serialNumber"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-gray-900 placeholder:text-gray-400"
                                placeholder="SN-XXXXX"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Issue Details */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-8 h-8 text-orange-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">What's the issue?</h2>
                          <p className="text-sm text-gray-600">Select the problem you're experiencing</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Issue Type *
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {issueTypes.map((issue) => (
                              <motion.label
                                key={issue.id}
                                className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                  formData.issueType === issue.id
                                    ? 'border-black bg-black shadow-xl scale-105'
                                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <input
                                  type="radio"
                                  name="issueType"
                                  value={issue.id}
                                  checked={formData.issueType === issue.id}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <span className="text-2xl mb-2">{issue.icon}</span>
                                <span className={`text-xs font-semibold text-center ${
                                  formData.issueType === issue.id ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {issue.label}
                                </span>
                                {formData.issueType === issue.id && (
                                  <motion.div
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                  >
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </motion.div>
                                )}
                              </motion.label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="issueDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                            Detailed Description *
                          </label>
                          <textarea
                            id="issueDescription"
                            name="issueDescription"
                            required
                            rows={4}
                            value={formData.issueDescription}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all resize-none text-gray-900 placeholder:text-gray-400"
                            placeholder="Describe the issue in detail. Include when it started and what happened..."
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.issueDescription.length} / 500 characters
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Preferred Resolution *
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {resolutionOptions.map((option) => (
                              <motion.label
                                key={option.id}
                                className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                  formData.preferredResolution === option.id
                                    ? 'border-black bg-gradient-to-br from-black to-gray-800 shadow-xl scale-105'
                                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <input
                                  type="radio"
                                  name="preferredResolution"
                                  value={option.id}
                                  checked={formData.preferredResolution === option.id}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <span className="text-3xl mb-2">{option.icon}</span>
                                <h3 className={`text-base font-bold mb-1 ${
                                  formData.preferredResolution === option.id ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {option.label}
                                </h3>
                                <p className={`text-xs ${
                                  formData.preferredResolution === option.id ? 'text-gray-200' : 'text-gray-600'
                                }`}>
                                  {option.description}
                                </p>
                                {formData.preferredResolution === option.id && (
                                  <motion.div
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                  >
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </motion.div>
                                )}
                              </motion.label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Upload Documents */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-8 h-8 text-green-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">Upload your documents</h2>
                          <p className="text-sm text-gray-600">We need proof of purchase and images of the issue</p>
                        </div>
                        
                        {/* Invoice Upload */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Purchase Invoice/Receipt *
                          </label>
                          <div className="relative group">
                            <input
                              type="file"
                              id="invoice"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'invoice')}
                              className="hidden"
                            />
                            <label
                              htmlFor="invoice"
                              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:border-black hover:bg-gray-50 transition-all"
                            >
                              {formData.invoice ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-center"
                                >
                                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900 mb-1">{formData.invoice.name}</p>
                                  <p className="text-xs text-gray-500">Click to change file</p>
                                </motion.div>
                              ) : (
                                <>
                                  <FileText className="w-12 h-12 text-gray-400 mb-3 group-hover:text-black transition-colors" />
                                  <span className="text-sm font-semibold text-gray-900 mb-1">Click to upload invoice</span>
                                  <span className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</span>
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Product Images Upload */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product Images * <span className="text-gray-500 font-normal text-xs">(Show the issue from multiple angles)</span>
                          </label>
                          <div className="relative group">
                            <input
                              type="file"
                              id="productImages"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleFileChange(e, 'productImages')}
                              className="hidden"
                            />
                            <label
                              htmlFor="productImages"
                              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:border-black hover:bg-gray-50 transition-all"
                            >
                              {formData.productImages.length > 0 ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-center"
                                >
                                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Camera className="w-8 h-8 text-blue-600" />
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900 mb-2">{formData.productImages.length} image(s) selected</p>
                                  <div className="space-y-1 mb-2">
                                    {formData.productImages.map((file, index) => (
                                      <p key={index} className="text-xs text-gray-600">✓ {file.name}</p>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-500">Click to add more images</p>
                                </motion.div>
                              ) : (
                                <>
                                  <Camera className="w-12 h-12 text-gray-400 mb-3 group-hover:text-black transition-colors" />
                                  <span className="text-sm font-semibold text-gray-900 mb-1">Click to upload images</span>
                                  <span className="text-xs text-gray-500">Multiple images (max 5, 5MB each)</span>
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 mb-1">Tips for better images:</h4>
                              <ul className="space-y-0.5 text-xs text-gray-700">
                                <li>✓ Take clear, well-lit photos</li>
                                <li>✓ Show the defect from multiple angles</li>
                                <li>✓ Include any visible serial numbers</li>
                                <li>✓ Capture the full product context</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-100">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          Previous
                        </button>
                      )}
                      {currentStep < 4 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="ml-auto flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all font-semibold"
                        >
                          Continue
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="ml-auto flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:shadow-xl transition-all font-bold"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Submit Claim
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              ) : (
                // Success Screen
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 text-center border border-gray-100"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-gray-900 mb-3"
                  >
                    Claim Submitted Successfully! 🎉
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base text-gray-600 mb-6 max-w-xl mx-auto"
                  >
                    Your warranty claim has been received and is being processed. We'll review it and get back to you within 24-48 hours.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 mb-6 border-4 border-yellow-400"
                  >
                    <p className="text-xs text-gray-400 mb-1">Your Claim Reference Number</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-3xl font-bold text-white font-mono tracking-wider">
                        CLM-{Date.now().toString().slice(-8)}
                      </p>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Save this for tracking your claim</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100"
                  >
                    <p className="text-sm text-gray-700 mb-1">
                      📧 Confirmation email sent to
                    </p>
                    <p className="text-base font-bold text-gray-900">{formData.email}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
                  >
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <Clock className="w-7 h-7 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-gray-900">Review in 24h</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <Mail className="w-7 h-7 text-green-500 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-gray-900">Email Updates</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <Phone className="w-7 h-7 text-purple-500 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-gray-900">Call Support</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                  >
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          orderNumber: '',
                          purchaseDate: '',
                          productName: '',
                          productCategory: '',
                          serialNumber: '',
                          issueType: '',
                          issueDescription: '',
                          preferredResolution: '',
                          invoice: null,
                          productImages: []
                        });
                      }}
                      className="border-2 border-black text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-all font-semibold"
                    >
                      Submit Another Claim
                    </button>
                    <Link
                      href="/"
                      className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all font-semibold inline-block"
                    >
                      Back to Home
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-600">Quick answers to common warranty questions</p>
            </div>

            <div className="space-y-3">
              {[
                { q: 'How long does the warranty process take?', a: 'Most claims are processed within 24-48 hours. You\'ll receive updates via email.' },
                { q: 'What documents do I need?', a: 'You need your purchase invoice/receipt and clear images showing the product issue.' },
                { q: 'Can I track my claim status?', a: 'Yes! Use your claim reference number to track status via email or contact support.' },
                { q: 'What if my warranty has expired?', a: 'Contact our support team. We may still be able to help with repair options.' }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-all border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-gray-600 mb-3">Still have questions?</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Contact Support
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
