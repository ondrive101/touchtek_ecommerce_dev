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
  Cable,
  Phone,
  SmartphoneCharging,
  Mail,
} from 'lucide-react';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";

const faqCategories = [
  {
    id: 'batteries',
    name: 'Batteries',
    icon: Battery,
    faqs: [
      {
        question: 'What is the difference between polymer and lithium batteries?',
        answer:
          'Polymer batteries are lighter and slimmer compared to traditional lithium-ion batteries. They offer stable power output and improved safety design, making them ideal for modern smartphones.',
      },
      {
        question: 'Are Touchtek batteries safe?',
        answer:
          'Yes. Touchtek batteries are manufactured using quality-tested cells and include built-in protection against overcharging, overheating, and short circuits',
      },
      {
        question: 'How long does a Touchtek battery last?',
        answer:
          'Battery life depends on usage, but a Touchtek battery is designed to deliver consistent backup and reliable long-term performance when properly maintained.',
      },
      {
        question: 'How can I increase the life of my Touchtek battery?',
        answer:
          'Use certified chargers, avoid overcharging, and keep your device away from extreme temperatures.',
      },
      {
        question: 'Will replacing my old battery with a Touchtek battery improve performance?',
        answer:
          'Yes. Replacing a worn-out battery with a Touchtek battery can significantly improve backup time and overall device performance.',
      },
    ],
  },
    {
    id: 'chargers',
    name: 'Chargers',
    icon: Zap,
    faqs: [
      {
        question: 'Is it safe to use Touchtek chargers daily?',
        answer:
          'Yes. Every Touchtek charger is built with multiple safety protections, including Over Voltage Protection and Short Circuit Protection, ensuring safe and stable charging.',
      },
      {
        question: 'Can I use a higher watt Touchtek charger for my phone?',
        answer:
          'Yes, if your device supports higher wattage. Touchtek chargers automatically adjust power output based on device requirements.',
      },
      {
        question: 'Does fast charging damage the battery?',
        answer:
          'No. Touchtek fast chargers are engineered to deliver controlled power safely when used with compatible devices.',
      },
      {
        question: 'Why does my Touchtek charger feel slightly warm?',
        answer:
          'Mild warmth during charging is normal. Ensure proper ventilation and use a quality Touchtek cable for optimal performance.',
      },
    ],
  },
  {
    id: 'cables',
    name: 'Cables',
    icon: Shield,
    faqs: [
      {
        question: 'Does cable quality affect charging speed?',
        answer:
          'Yes. A Touchtek data cable ensures stable current flow, faster charging, and secure data transfer.',
      },
      {
        question: 'How durable are Touchtek data cables?',
        answer:
          'Touchtek cables are designed with reinforced connectors and strong outer materials for long-lasting daily use.',
      },
      {
        question: 'Why does charging disconnect sometimes?',
        answer:
          'This may happen due to connector wear or dust inside the device port. Using a well-maintained Touchtek cable helps ensure consistent performance.',
      },
      {
        question: 'Can I use any cable with a Touchtek charger?',
        answer:
          'For best results, use a Touchtek cable that matches your device type and supports the required power output.',
      },
    ],
  },
  
  {
    id: 'audio',
    name: 'Audio Products',
    icon: Headphones,
    faqs: [
      {
        question: 'How long does the battery last in Touchtek TWS?',
        answer:
          'Battery life varies by model, but Touchtek TWS are designed to provide extended playback time with additional charging support from the case.',
      },
      {
        question: 'How do I connect Touchtek TWS to my phone?',
        answer:
          'Enable Bluetooth on your device, select the Touchtek TWS name, and connect. It will automatically reconnect after the first pairing.',
      },
      {
        question: 'What is the Bluetooth range of Touchtek TWS?',
        answer:
          'Touchtek TWS typically offer up to 10 meters of wireless range in open space.',
      },
      {
        question: 'What should I do if one earbud is not working?',
        answer:
          'Reset the Touchtek TWS and reconnect. Ensure both earbuds are properly charged.',
      },
      {
        question: 'How long does a Touchtek neckband battery last?',
        answer:
          'Battery performance depends on usage, but Touchtek neckbands are engineered for long music and standby time.',
      },
      {
        question: 'Is a Touchtek neckband suitable for calls?',
        answer:
          'Yes. Touchtek neckbands deliver clear voice quality with stable Bluetooth connectivity.',
      },
      {
        question: 'Are Touchtek neckbands suitable for workouts?',
        answer:
          'Many Touchtek neckband models are designed for daily use and light physical activity.',
      },
      {
        question: 'Do Touchtek wired earphones provide better sound stability?',
        answer:
          'Yes. Touchtek wired earphones offer uninterrupted audio without battery dependency.',
      },
      {
        question: 'Are Touchtek earphones compatible with all smartphones?',
        answer:
          'Compatibility depends on your device port type, such as 3.5mm jack or Type-C connection.',
      },
      {
        question: 'How long does a Touchtek Bluetooth speaker battery last?',
        answer:
          'Battery backup depends on volume level and usage, but Touchtek speakers are designed for extended playback.',
      },
      {
        question: 'Can a Touchtek speaker connect to a TV or laptop?',
        answer:
          'Yes, if your device supports Bluetooth connectivity.',
      },
      {
        question: 'Are Touchtek Bluetooth speakers water-resistant?',
        answer:
          'Water resistance depends on the specific Touchtek model. Please check product specifications.',
      },
      {
        question: 'Are Touchtek headphones better than earbuds?',
        answer:
          'Touchtek headphones typically provide deeper bass and improved sound isolation for an immersive listening experience.',
      },
      {
        question: 'Can I use Touchtek headphones for gaming?',
        answer:
          'Yes. Touchtek headphones deliver clear sound output suitable for gaming and media.',
      },
     
      
    ],
  },
  {
    id: 'powerbanks',
    name: 'Power Banks',
    icon: SmartphoneCharging,
    faqs: [
      {
        question: 'How many times can a Touchtek powerbank charge my phone?',
        answer:
          'Charging cycles depend on the Touchtek powerbank capacity and your phone’s battery size.',
      },
      {
        question: 'Is it safe to leave a Touchtek powerbank charging overnight?',
        answer:
          'Yes, but disconnecting once fully charged helps maintain battery health.',
      },
      {
        question: 'Can I carry a Touchtek powerbank during flights?',
        answer:
          'Yes, within airline-approved capacity limits.',
      },
  
  
    ],
  },
   {
    id: 'connectors',
    name: 'OTG and Connectors',
    icon: Cable,
    faqs: [
      {
        question: 'What is a Touchtek OTG used for?',
        answer:
          'A Touchtek OTG allows you to connect USB devices such as pen drives, keyboards, and accessories directly to your smartphone.',
      },
      {
        question: 'Are all Touchtek connectors compatible with every device?',
        answer:
          'No. Always check your device port type before purchasing a Touchtek connector.',
      },
  
  
  
    ],
  },
     {
    id: 'stands',
    name: 'Mobile and Car Stands',
    icon: Shield,
    faqs: [
      {
        question: 'Will a Touchtek stand fit my phone?',
        answer:
          'Most Touchtek stands are adjustable and compatible with a wide range of smartphone sizes.',
      },
      {
        question: 'Is it safe to use a Touchtek car stand while driving?',
        answer:
          'Yes, when properly mounted. A Touchtek car stand enables safer hands-free navigation.',
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
                <p className="text-gray-300 text-sm">+91 7982215977</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <Mail className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-300 text-sm">support@touchtek.in</p>
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
