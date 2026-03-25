'use client';

import { useState } from 'react';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";
import { motion } from 'framer-motion';
import {
  Shield, Eye, Lock, Database, Cookie,
  Share2, UserCheck, RefreshCw, Mail,
  ChevronRight, Search, Clock, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: 'introduction', title: 'Introduction', icon: Shield },
  { id: 'collection', title: 'Information We Collect', icon: Database },
  { id: 'usage', title: 'How We Use Your Info', icon: Eye },
  { id: 'protection', title: 'Data Protection', icon: Lock },
  { id: 'cookies', title: 'Cookies & Analytics', icon: Cookie },
  { id: 'sharing', title: 'Information Sharing', icon: Share2 },
  { id: 'rights', title: 'Your Rights', icon: UserCheck },
  { id: 'updates', title: 'Policy Updates', icon: RefreshCw },
  { id: 'contact', title: 'Contact Touchtek', icon: Mail },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');

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
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Privacy & Trust</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                Privacy is built on trust. Learn how Touchtek collects, uses, and safeguards your information.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Last Updated: March 25, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Version 1.0</span>
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
                      placeholder="Search sections..."
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
                      <Link href="/terms" className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors">
                        <ChevronRight className="w-3 h-3" />
                        Terms & Conditions
                      </Link>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                      >
                        <ChevronRight className="w-3 h-3" />
                        Print Policy
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-10">

                  {/* Introduction */}
                  <motion.section
                    id="introduction"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        At <strong>Touchtek</strong>, privacy is built on trust. We are committed to protecting your
                        personal information with transparency, responsibility, and care. This Privacy Policy explains
                        how Touchtek collects, uses, and safeguards your information when you interact with our
                        website, products, or services.
                      </p>
                      <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <strong className="text-yellow-800">Note:</strong> By accessing the Touchtek website, you
                        agree to the terms outlined in this policy.
                      </p>
                    </div>
                  </motion.section>

                  {/* Information We Collect */}
                  <motion.section
                    id="collection"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>Touchtek may collect information that helps us serve you better. This may include:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h3 className="font-bold text-sm text-purple-900 mb-2 flex items-center gap-2">
                            <UserCheck className="w-4 h-4" /> Personal Information
                          </h3>
                          <ul className="text-sm text-purple-800 space-y-1 pl-1">
                            <li>• Name & email address</li>
                            <li>• Phone number</li>
                            <li>• Billing or shipping details</li>
                            <li>• Business information</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-bold text-sm text-blue-900 mb-2 flex items-center gap-2">
                            <Database className="w-4 h-4" /> Technical Information
                          </h3>
                          <ul className="text-sm text-blue-800 space-y-1 pl-1">
                            <li>• IP address & browser type</li>
                            <li>• Device details</li>
                            <li>• Usage data</li>
                            <li>• Cookies</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-sm italic text-gray-500">
                        We collect only the information necessary to deliver a seamless and secure experience.
                      </p>
                    </div>
                  </motion.section>

                  {/* How We Use Your Info */}
                  <motion.section
                    id="usage"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">2. How Touchtek Uses Your Information</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>Touchtek uses your information responsibly to:</p>
                      <ul className="space-y-2 list-none pl-0">
                        {[
                          'Respond to inquiries and customer support requests',
                          'Process orders or business partnerships',
                          'Improve website performance and user experience',
                          'Share relevant updates, product information, or service notifications',
                          'Fulfill legal and regulatory obligations',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="bg-green-50 border-l-4 border-green-400 p-4 rounded text-sm font-semibold text-green-800">
                        Touchtek does not sell, trade, or rent your personal information.
                      </p>
                    </div>
                  </motion.section>

                  {/* Data Protection */}
                  <motion.section
                    id="protection"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">3. Data Protection & Security</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        Touchtek implements appropriate technical and organizational safeguards to protect your
                        information from unauthorized access, misuse, or disclosure.
                      </p>
                      <p className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-sm text-red-800">
                        While no digital platform can guarantee absolute security, Touchtek continuously monitors
                        and upgrades its systems to maintain strong protection standards.
                      </p>
                    </div>
                  </motion.section>

                  {/* Cookies */}
                  <motion.section
                    id="cookies"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <Cookie className="w-5 h-5 text-orange-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">4. Cookies & Website Analytics</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        Touchtek may use cookies and similar technologies to enhance your browsing experience.
                        These tools help us understand how visitors interact with our website and allow us to
                        improve functionality.
                      </p>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                        <Cookie className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-800">
                          You may adjust cookie preferences through your browser settings at any time.
                        </p>
                      </div>
                    </div>
                  </motion.section>

                  {/* Information Sharing */}
                  <motion.section
                    id="sharing"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-teal-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">5. Information Sharing</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>Touchtek may share limited information only when necessary with:</p>
                      <div className="space-y-3">
                        {[
                          'Authorized service and logistics partners',
                          'Technical service providers',
                          'Government or regulatory authorities, when legally required',
                        ].map((item, i) => (
                          <div key={i} className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                            <span className="text-sm text-teal-800">{item}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm italic text-gray-500">
                        All such sharing is conducted under strict confidentiality standards.
                      </p>
                    </div>
                  </motion.section>

                  {/* Your Rights */}
                  <motion.section
                    id="rights"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">6. Your Rights</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { right: 'Access', desc: 'Request a copy of your personal data', icon: '👁️' },
                          { right: 'Correction', desc: 'Update inaccurate or incomplete data', icon: '✏️' },
                          { right: 'Deletion', desc: 'Request removal of your personal data', icon: '🗑️' },
                        ].map((item, i) => (
                          <div key={i} className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-100 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <h3 className="font-bold text-sm text-gray-900 mb-1">{item.right}</h3>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Touchtek will respond to such requests in a timely and transparent manner, subject to
                        applicable laws.
                      </p>
                    </div>
                  </motion.section>

                  {/* Policy Updates */}
                  <motion.section
                    id="updates"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">7. Policy Updates</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        Touchtek may update this Privacy Policy periodically to reflect operational or legal
                        changes. Updated versions will be published on this page.
                      </p>
                    </div>
                  </motion.section>

                  {/* Contact */}
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
                      <h2 className="text-2xl font-bold text-gray-900">8. Contact Touchtek</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p>
                        For questions regarding privacy practices, please contact Touchtek through our official
                        website or customer support channels.
                      </p>
                    </div>
                  </motion.section>

                  {/* Trust Footer Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mt-10 text-center"
                  >
                    <Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <p className="text-base font-semibold text-gray-900">Touchtek values your trust.</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Your privacy is not just protected —{' '}
                      <span className="font-semibold text-blue-700">it is respected</span>.
                    </p>
                  </motion.div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
