'use client';

import { useState } from 'react';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";
import { motion } from 'framer-motion';
import {
  FileText, Shield, Users, CreditCard, Package,
  Scale, AlertCircle, CheckCircle, ChevronDown,
  ChevronRight, Search, Calendar, Clock, Mail, Phone, MapPin, Gavel, Link2
} from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: 'general', title: 'General Information', icon: FileText },
  { id: 'products', title: 'Product Information', icon: Package },
  { id: 'pricing', title: 'Pricing & Payments', icon: CreditCard },
  { id: 'warranty', title: 'Warranty Policy', icon: Shield },
  { id: 'liability', title: 'Limitation of Liability', icon: AlertCircle },
  { id: 'intellectual', title: 'Intellectual Property', icon: FileText },
  { id: 'user', title: 'User Responsibilities', icon: Users },
  { id: 'thirdparty', title: 'Third-Party Links', icon: Link2 },
  { id: 'changes', title: 'Changes to Terms', icon: Calendar },
  { id: 'governing', title: 'Governing Law', icon: Gavel },
  { id: 'contact', title: 'Contact Information', icon: Mail },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const filteredSections = sections.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                <Scale className="w-4 h-4" />
                <span className="text-sm font-medium">Legal Agreement</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                Please read these terms and conditions carefully before using our services.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Last Updated: March 25, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Version 3.0</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">

                  {/* Quick Search */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Quick Search
                    </h3>
                    <input
                      type="text"
                      placeholder="Search terms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    />
                  </div>

                  {/* Table of Contents */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h3 className="font-bold text-sm text-gray-900 mb-3">Table of Contents</h3>
                    <nav className="space-y-1">
                      {filteredSections.map((section, index) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all text-left ${
                            activeSection === section.id
                              ? 'bg-black text-white'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <section.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1">{section.title}</span>
                          <span className="text-xs opacity-50">{index + 1}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
                    <h3 className="font-bold text-sm text-gray-900 mb-3">Need Help?</h3>
                    <div className="space-y-2">
                      <Link href="/contact" className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors">
                        <ChevronRight className="w-3 h-3" />
                        Contact Support
                      </Link>
                      <Link href="/faq" className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors">
                        <ChevronRight className="w-3 h-3" />
                        FAQ
                      </Link>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                      >
                        <ChevronRight className="w-3 h-3" />
                        Print Terms
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-10">

                  {/* Intro Banner */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-sm text-yellow-800">
                      Welcome to the official website of <strong>Touchtek</strong>. By accessing or using this website,
                      you agree to comply with and be bound by the following Terms and Conditions. Please read them
                      carefully before using our website or purchasing any Touchtek products.
                    </p>
                  </div>

                  {/* 1. General Information */}
                  <motion.section
                    id="general"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">1. General Information</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        This website is owned and operated by <strong>Touchtek</strong>. The terms "Touchtek," "we,"
                        "us," and "our" refer to the brand and its authorized representatives. By accessing this
                        website, you agree to these Terms and Conditions in full.
                      </p>
                      <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <strong className="text-yellow-800">Important:</strong> If you do not agree with any part of
                        these terms, please do not use the website.
                      </p>
                    </div>
                  </motion.section>

                  {/* 2. Product Information */}
                  <motion.section
                    id="products"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-orange-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">2. Product Information</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        Touchtek makes every effort to ensure that product descriptions, specifications, pricing,
                        and images displayed on the website are accurate and up to date. However:
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <ul className="text-sm text-blue-800 space-y-2">
                          {[
                            'Product appearance may slightly vary due to lighting or display settings.',
                            'Specifications may change without prior notice for product improvement.',
                            'Availability of products is subject to stock and distribution conditions.',
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm text-gray-500 italic">
                        Touchtek reserves the right to modify or discontinue any product at any time without prior notice.
                      </p>
                    </div>
                  </motion.section>

                  {/* 3. Pricing & Payments */}
                  <motion.section
                    id="pricing"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-pink-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">3. Pricing & Payments</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        All prices listed on the Touchtek website are subject to change without notice. Prices may
                        vary across regions or retail partners.
                      </p>
                      <p className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded text-sm text-pink-800">
                        Touchtek is not responsible for pricing differences between online platforms, retail stores,
                        or authorized distributors.
                      </p>
                    </div>
                  </motion.section>

                  {/* 4. Warranty Policy */}
                  <motion.section
                    id="warranty"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">4. Warranty Policy</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        Touchtek products are covered under a limited warranty, subject to product category and
                        terms mentioned on the product packaging.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-bold text-sm text-red-900 mb-2">The warranty does not cover:</h3>
                        <ul className="text-sm text-red-800 space-y-1">
                          {[
                            'Physical damage',
                            'Water damage (unless specifically stated as water-resistant)',
                            'Unauthorized repairs',
                            'Damage caused by misuse or improper installation',
                            'Normal wear and tear',
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded text-sm text-indigo-800">
                        <strong>Note:</strong> Customers must retain original purchase proof to claim warranty service.
                      </p>
                    </div>
                  </motion.section>

                  {/* 5. Limitation of Liability */}
                  <motion.section
                    id="liability"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">5. Limitation of Liability</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>Touchtek shall not be held liable for:</p>
                      <div className="space-y-2">
                        {[
                          'Indirect or incidental damages arising from product use',
                          'Data loss or device malfunction caused by improper usage',
                          'Damage resulting from use of non-compatible devices',
                        ].map((item, i) => (
                          <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-sm text-yellow-800">{item}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm italic text-gray-500">
                        Users are responsible for ensuring compatibility before purchasing any Touchtek product.
                      </p>
                    </div>
                  </motion.section>

                  {/* 6. Intellectual Property */}
                  <motion.section
                    id="intellectual"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-cyan-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">6. Intellectual Property</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        All content on the Touchtek website, including logos, text, images, graphics, product
                        designs, and branding elements, are the intellectual property of Touchtek.
                      </p>
                      <p className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded text-sm text-cyan-800">
                        Unauthorized reproduction, distribution, or commercial use of any material without written
                        permission is strictly prohibited.
                      </p>
                    </div>
                  </motion.section>

                  {/* 7. User Responsibilities */}
                  <motion.section
                    id="user"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">7. User Responsibilities</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>By using this website, you agree:</p>
                      <ul className="space-y-2 list-none pl-0">
                        {[
                          'Not to misuse the website for unlawful purposes',
                          'Not to attempt unauthorized access to any part of the website',
                          'To provide accurate information when required',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm italic text-gray-500">
                        Touchtek reserves the right to restrict access if misuse is detected.
                      </p>
                    </div>
                  </motion.section>

                  {/* 8. Third-Party Links */}
                  <motion.section
                    id="thirdparty"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-teal-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">8. Third-Party Links</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        The Touchtek website may contain links to third-party platforms. Touchtek is not responsible
                        for the content, privacy practices, or policies of such external websites.
                      </p>
                    </div>
                  </motion.section>

                  {/* 9. Changes to Terms */}
                  <motion.section
                    id="changes"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">9. Changes to Terms</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        Touchtek reserves the right to update or modify these Terms & Conditions at any time without
                        prior notice. Continued use of the website after updates constitutes acceptance of the
                        revised terms.
                      </p>
                    </div>
                  </motion.section>

                  {/* 10. Governing Law */}
                  <motion.section
                    id="governing"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <Gavel className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">10. Governing Law</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        These Terms & Conditions shall be governed by and interpreted in accordance with the
                        laws of <strong>India</strong>. Any disputes arising shall be subject to the jurisdiction
                        of the appropriate courts.
                      </p>
                    </div>
                  </motion.section>

                  {/* 11. Contact Information */}
                  <motion.section
                    id="contact"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">11. Contact Information</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p>
                        For questions regarding these Terms & Conditions, please contact Touchtek customer support
                        through the official website or authorized channels.
                      </p>
                    </div>
                  </motion.section>

               
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Common Questions</h2>
              <p className="text-sm text-gray-600">Quick answers about our terms</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Can I cancel my order after placing it?',
                  a: 'Yes, you can cancel your order within 24 hours of placing it. After that, the order may have been processed and shipped.',
                },
                {
                  q: 'How do I claim warranty for my product?',
                  a: 'Visit our Warranty Claim page, fill in the required details with your original purchase proof, and submit your claim. Our team will process it within 24–48 hours.',
                },
                {
                  q: 'Are there any products I cannot return?',
                  a: 'Yes, certain products like opened batteries, used earbuds (for hygiene reasons), and physically damaged items cannot be returned unless defective.',
                },
                {
                  q: 'Does Touchtek sell my personal data?',
                  a: 'No. Touchtek does not sell, trade, or rent your personal information to any third party.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-sm text-gray-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
