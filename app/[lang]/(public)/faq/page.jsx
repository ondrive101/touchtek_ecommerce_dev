'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  Battery,
  Headphones,
  Zap,
  Shield,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
} from 'lucide-react';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";

const faqCategories = [
  {
    id: 'general',
    name: 'General',
    icon: Shield,
    faqs: [
      {
        question: 'What is Touchtek?',
        answer:
          'Touchtek is a leading manufacturer of premium batteries, audio accessories, and smart charging solutions. We specialize in innovative technology products designed for modern lifestyles.',
      },
      {
        question: 'Where are Touchtek products manufactured?',
        answer:
          'Our products are manufactured in state-of-the-art facilities with strict quality control measures. We maintain high standards across all our manufacturing processes.',
      },
      {
        question: 'Do you offer international shipping?',
        answer:
          'Currently, we primarily serve the Indian market. For international shipping inquiries, please contact our customer support team for specific availability in your region.',
      },
      {
        question: 'How can I become a Touchtek dealer or distributor?',
        answer:
          'We welcome partnership opportunities. Please contact us through our careers page or email partnerships@touchtek.com with your business details.',
      },
    ],
  },
  {
    id: 'batteries',
    name: 'Batteries',
    icon: Battery,
    faqs: [
      {
        question: 'What types of batteries does Touchtek offer?',
        answer:
          'We offer both Lithium and Polymer batteries with fast charging capabilities. Our Diamond Exclusive Series features premium battery technology with enhanced performance and durability.',
      },
      {
        question: 'How long do Touchtek batteries last?',
        answer:
          'Our batteries are designed for extended lifespan with proper usage. Lithium batteries typically last 2-3 years, while Polymer batteries can last 3-4 years depending on usage patterns.',
      },
      {
        question: 'Are Touchtek batteries safe to use?',
        answer:
          'Yes, all our batteries include multiple safety features: over-voltage protection, over-current protection, overcharge protection, and short-circuit protection.',
      },
      {
        question: 'Can I use Touchtek batteries in any device?',
        answer:
          'Our batteries are designed for specific device compatibility. Please check the product specifications or contact our support team to ensure compatibility with your device.',
      },
      {
        question: 'How should I dispose of old batteries?',
        answer:
          'Please dispose of batteries responsibly at designated e-waste collection centers. Do not throw batteries in regular trash as they contain materials that require proper recycling.',
      },
    ],
  },
  {
    id: 'audio',
    name: 'Audio Products',
    icon: Headphones,
    faqs: [
      {
        question: 'What audio products does Touchtek offer?',
        answer:
          'We offer wireless audio products like Mini Pods, Trendy Pods, Moon Pods (earbuds), neckbands, earphones, and speakers with premium sound quality.',
      },
      {
        question: 'How do I pair Touchtek earbuds with my device?',
        answer:
          'Turn on Bluetooth on your device, take the earbuds out of the case, and select "Touchtek" in your Bluetooth settings. Most of our earbuds pair automatically.',
      },
      {
        question: 'What is the battery life of Touchtek earbuds?',
        answer:
          'Our earbuds typically provide 6–8 hours of playback, with the charging case extending total usage to 24–30 hours.',
      },
      {
        question: 'Are Touchtek earbuds water-resistant?',
        answer:
          'Many models have IPX4 or higher water resistance for workouts and light rain. Check each product’s specifications for details.',
      },
      {
        question: 'Can I use just one earbud at a time?',
        answer:
          'Yes, our true wireless earbuds support mono mode, so you can use either the left or right earbud alone.',
      },
    ],
  },
  {
    id: 'charging',
    name: 'Charging & Accessories',
    icon: Zap,
    faqs: [
      {
        question: 'What charging solutions does Touchtek provide?',
        answer:
          'We offer DC Chargers, Hyper Pro chargers, Insta Chargers, power banks, and silicon data cables with fast charging capabilities.',
      },
      {
        question: 'Are Touchtek chargers compatible with all devices?',
        answer:
          'Our chargers are designed for universal compatibility. They support multiple charging protocols and connector types.',
      },
      {
        question: 'What safety features do Touchtek chargers have?',
        answer:
          'Our chargers have over-current, over-voltage, temperature, and short-circuit protection for safe operation.',
      },
      {
        question: 'How fast can Touchtek chargers charge my device?',
        answer:
          'Charging speed depends on your device and charger model. Hyper Pro chargers can deliver up to 100W of power for ultra-fast charging.',
      },
      {
        question: 'Do Touchtek cables support data transfer?',
        answer:
          'Yes. Our silicon data cables handle both charging and high-speed data transfer with a tangle-free, durable design.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [openFAQ, setOpenFAQ] = useState(null);

  const filteredFAQs =
    faqCategories.find((cat) => cat.id === selectedCategory)?.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const toggleFAQ = (index) => {
    const faqId = `${selectedCategory}-${index}`;
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-20">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <HelpCircle className="w-10 h-10" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Help Center
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
                Get instant answers to your questions about our products and services
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-12 -mt-8 relative z-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl p-2">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-6 bg-transparent text-lg placeholder-gray-400 focus:outline-none"
              />
              <motion.button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-black transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search
              </motion.button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Choose a category to find relevant answers quickly
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {faqCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative p-8 rounded-2xl text-left transition-all duration-300 group ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-br from-gray-800 to-black text-white shadow-2xl scale-105'
                        : 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg hover:shadow-xl'
                    }`}
                    whileHover={{ y: -5 }}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                        selectedCategory === category.id
                          ? 'bg-white/20'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent
                        className={`w-8 h-8 ${
                          selectedCategory === category.id
                            ? 'text-white'
                            : 'text-gray-800'
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p
                      className={`text-sm ${
                        selectedCategory === category.id
                          ? 'text-gray-200'
                          : 'text-gray-600'
                      }`}
                    >
                      {category.faqs.length} questions
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <AnimatePresence>
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => {
                  const faqId = `${selectedCategory}-${index}`;
                  const isOpen = openFAQ === faqId;
                  return (
                    <motion.div
                      key={faqId}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                      layout
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-6 h-6 text-gray-800" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-gray-100">
                              <p className="text-gray-600 pt-4 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  className="text-center py-16 bg-white rounded-2xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or browse different categories.
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
                  >
                    Clear Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <MessageCircle className="w-8 h-8 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Still need help?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Can’t find what you’re looking for? Our team is ready to assist you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-2xl p-6">
                <Phone className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-gray-300 text-sm">+91 11 1234 5678</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <Mail className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-300 text-sm">support@touchtek.com</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-300 text-sm">Available 24/7</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
