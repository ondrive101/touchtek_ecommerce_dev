'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  FileText, Shield, Users, CreditCard, Package, 
  Scale, AlertCircle, CheckCircle, ChevronDown, 
  ChevronRight, Search, Calendar, Clock,Mail,Phone,MapPin
} from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: 'introduction', title: 'Introduction', icon: FileText },
  { id: 'definitions', title: 'Definitions', icon: AlertCircle },
  { id: 'account', title: 'Account Terms', icon: Users },
  { id: 'products', title: 'Products & Services', icon: Package },
  { id: 'pricing', title: 'Pricing & Payment', icon: CreditCard },
  { id: 'shipping', title: 'Shipping & Delivery', icon: Package },
  { id: 'returns', title: 'Returns & Refunds', icon: Scale },
  { id: 'warranty', title: 'Warranty', icon: Shield },
  { id: 'liability', title: 'Limitation of Liability', icon: AlertCircle },
  { id: 'intellectual', title: 'Intellectual Property', icon: FileText },
  { id: 'termination', title: 'Termination', icon: AlertCircle },
  { id: 'changes', title: 'Changes to Terms', icon: Calendar }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
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
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Terms & Conditions
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                Please read these terms and conditions carefully before using our services
              </p>

              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Last Updated: Dec 6, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Version 2.0</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
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
                      {sections.map((section, index) => (
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
                      <Link
                        href="/contact"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                      >
                        <ChevronRight className="w-3 h-3" />
                        Contact Support
                      </Link>
                      <Link
                        href="/faq"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                      >
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
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        Welcome to <strong>Touchtek</strong> ("Company", "we", "our", "us"). These Terms and Conditions 
                        ("Terms", "Terms and Conditions") govern your use of our website located at <strong>touchtek.com</strong> 
                        (together or individually "Service") operated by Touchtek.
                      </p>
                      <p>
                        Your access to and use of the Service is conditioned on your acceptance of and compliance with 
                        these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                      </p>
                      <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <strong className="text-yellow-800">Important:</strong> By accessing or using the Service you 
                        agree to be bound by these Terms. If you disagree with any part of the terms then you may not 
                        access the Service.
                      </p>
                    </div>
                  </motion.section>

                  {/* Definitions */}
                  <motion.section
                    id="definitions"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">2. Definitions</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        { term: 'Service', definition: 'Refers to the website operated by Touchtek and all associated e-commerce services.' },
                        { term: 'Products', definition: 'Refers to batteries, audio devices, accessories and other electronic items sold through our Service.' },
                        { term: 'User/You', definition: 'Refers to the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.' },
                        { term: 'Company/We/Us', definition: 'Refers to Touchtek, the owner and operator of the Service.' },
                        { term: 'Content', definition: 'Refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You.' }
                      ].map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-bold text-sm text-gray-900 mb-1">{item.term}</h3>
                          <p className="text-sm text-gray-600">{item.definition}</p>
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  {/* Account Terms */}
                  <motion.section
                    id="account"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">3. Account Terms</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
                      <ul className="space-y-2 list-none pl-0">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>You must be at least 18 years old to use our Service</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>You are responsible for safeguarding your password and account</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>You agree not to disclose your password to any third party</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>You must notify us immediately of any breach of security or unauthorized use</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>You may not use another person's account without permission</span>
                        </li>
                      </ul>
                    </div>
                  </motion.section>

                  {/* Products & Services */}
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
                      <h2 className="text-2xl font-bold text-gray-900">4. Products & Services</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        Certain products or services may be available exclusively online through the website. 
                        These products or services may have limited quantities and are subject to return or 
                        exchange only according to our Return Policy.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-bold text-sm text-blue-900 mb-2">Product Information</h3>
                        <ul className="text-sm text-blue-800 space-y-1 pl-5">
                          <li>We reserve the right to limit quantities of products offered</li>
                          <li>Product descriptions or pricing are subject to change at any time</li>
                          <li>We reserve the right to discontinue any product at any time</li>
                          <li>We do not warrant that product descriptions or other content is accurate or complete</li>
                        </ul>
                      </div>
                    </div>
                  </motion.section>

                  {/* Pricing & Payment */}
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
                      <h2 className="text-2xl font-bold text-gray-900">5. Pricing & Payment</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        We reserve the right to refuse any order placed through the Service. We may, in our 
                        sole discretion, limit or cancel quantities purchased per person, per household or per order.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-bold text-sm text-gray-900 mb-2">Payment Methods</h3>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Credit/Debit Cards</li>
                            <li>• UPI Payments</li>
                            <li>• Net Banking</li>
                            <li>• Cash on Delivery (Selected areas)</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-bold text-sm text-gray-900 mb-2">Pricing Policy</h3>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• All prices are in Indian Rupees (₹)</li>
                            <li>• Prices include applicable GST</li>
                            <li>• Shipping charges may apply</li>
                            <li>• Prices subject to change</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Shipping & Delivery */}
                  <motion.section
                    id="shipping"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-teal-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">6. Shipping & Delivery</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        We offer shipping to addresses within India. Delivery times vary depending on your location 
                        and the shipping method selected.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Shipping Method</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Delivery Time</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Cost</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-3 text-gray-600">Standard Delivery</td>
                              <td className="px-4 py-3 text-gray-600">5-7 Business Days</td>
                              <td className="px-4 py-3 text-gray-600">₹50</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-gray-600">Express Delivery</td>
                              <td className="px-4 py-3 text-gray-600">2-3 Business Days</td>
                              <td className="px-4 py-3 text-gray-600">₹150</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-gray-600">Same Day Delivery</td>
                              <td className="px-4 py-3 text-gray-600">Within 24 Hours</td>
                              <td className="px-4 py-3 text-gray-600">₹300</td>
                            </tr>
                            <tr className="bg-green-50">
                              <td className="px-4 py-3 text-gray-600 font-semibold">Free Shipping</td>
                              <td className="px-4 py-3 text-gray-600">5-7 Business Days</td>
                              <td className="px-4 py-3 text-green-600 font-semibold">Orders above ₹999</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.section>

                  {/* Returns & Refunds */}
                  <motion.section
                    id="returns"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                        <Scale className="w-5 h-5 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">7. Returns & Refunds</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        We want you to be completely satisfied with your purchase. If you're not happy with your 
                        order, we offer a flexible return and refund policy.
                      </p>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                        <h3 className="font-bold text-base text-gray-900 mb-3">Return Policy Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">7</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900">Days Return Window</p>
                              <p className="text-xs text-gray-600">From delivery date</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900">Full Refund</p>
                              <p className="text-xs text-gray-600">For eligible returns</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-2">Return Conditions:</h3>
                        <ul className="space-y-2 list-none pl-0">
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Product must be unused and in original packaging</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>All accessories, manuals, and tags must be included</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Original invoice/receipt required</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>No physical damage to the product</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.section>

                  {/* Warranty */}
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
                      <h2 className="text-2xl font-bold text-gray-900">8. Warranty</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        All products sold through our Service come with a manufacturer's warranty. 
                        The warranty period varies by product category.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { category: 'Batteries', period: '2 Years', icon: '🔋' },
                          { category: 'Audio Devices', period: '1 Year', icon: '🎵' },
                          { category: 'Accessories', period: '6 Months', icon: '🔌' }
                        ].map((item, index) => (
                          <div key={index} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <h3 className="font-bold text-sm text-gray-900 mb-1">{item.category}</h3>
                            <p className="text-2xl font-bold text-blue-600">{item.period}</p>
                            <p className="text-xs text-gray-500 mt-1">Warranty Period</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm">
                        To claim warranty, visit our <Link href="/warranty" className="text-blue-600 hover:underline font-semibold">Warranty Claim Page</Link>.
                      </p>
                    </div>
                  </motion.section>

                  {/* Limitation of Liability */}
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
                      <h2 className="text-2xl font-bold text-gray-900">9. Limitation of Liability</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        In no event shall Touchtek, nor its directors, employees, partners, agents, suppliers, or 
                        affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, 
                        including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                      </p>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Maximum Liability:</strong> Our total liability to you for any claim arising out 
                          of or relating to these Terms or our Service shall not exceed the amount paid by you to us 
                          in the six (6) months prior to the event giving rise to the liability.
                        </p>
                      </div>
                    </div>
                  </motion.section>

                  {/* Intellectual Property */}
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
                      <h2 className="text-2xl font-bold text-gray-900">10. Intellectual Property</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        The Service and its original content (excluding Content provided by users), features and 
                        functionality are and will remain the exclusive property of Touchtek and its licensors.
                      </p>
                      <p>
                        The Service is protected by copyright, trademark, and other laws of both India and foreign 
                        countries. Our trademarks and trade dress may not be used in connection with any product or 
                        service without the prior written consent of Touchtek.
                      </p>
                    </div>
                  </motion.section>

                  {/* Termination */}
                  <motion.section
                    id="termination"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">11. Termination</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for 
                        any reason whatsoever, including without limitation if you breach the Terms.
                      </p>
                      <p>
                        Upon termination, your right to use the Service will immediately cease. If you wish to 
                        terminate your account, you may simply discontinue using the Service or contact us.
                      </p>
                    </div>
                  </motion.section>

                  {/* Changes to Terms */}
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
                      <h2 className="text-2xl font-bold text-gray-900">12. Changes to Terms</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                      <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                        If a revision is material we will try to provide at least 30 days notice prior to any new 
                        terms taking effect.
                      </p>
                      <p>
                        What constitutes a material change will be determined at our sole discretion. By continuing 
                        to access or use our Service after those revisions become effective, you agree to be bound by 
                        the revised terms.
                      </p>
                    </div>
                  </motion.section>

                  {/* Contact Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mt-10"
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      Contact Us
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      If you have any questions about these Terms, please contact us:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">support@touchtek.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">+91 98765 43210</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span className="text-gray-700">Touchtek Electronics, Mumbai, Maharashtra, India</span>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick FAQ */}
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
                  a: 'Yes, you can cancel your order within 24 hours of placing it. After that, the order may have been processed and shipped.'
                },
                {
                  q: 'How do I claim warranty for my product?',
                  a: 'Visit our Warranty Claim page, fill in the required details, and submit your claim. Our team will process it within 24-48 hours.'
                },
                {
                  q: 'Are there any products I cannot return?',
                  a: 'Yes, certain products like opened batteries, used earbuds (for hygiene reasons), and damaged items cannot be returned unless defective.'
                },
                {
                  q: 'How long does it take to process a refund?',
                  a: 'Once we receive and verify your return, refunds are processed within 5-7 business days to your original payment method.'
                }
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
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="px-4 pb-4 bg-gray-50"
                    >
                      <p className="text-sm text-gray-600">{faq.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold text-sm"
              >
                View All FAQs
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
