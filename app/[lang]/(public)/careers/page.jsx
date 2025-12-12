'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Briefcase, Upload, Send } from 'lucide-react';
import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Product Manager',
    department: 'Product',
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: '5+ years',
    description:
      'Lead product strategy and development for our innovative battery and audio product lines.',
    requirements: [
      '5+ years of product management experience',
      'Experience in consumer electronics',
      'Strong analytical and communication skills',
      "Bachelor's degree in Engineering or related field",
    ],
  },
  {
    id: 2,
    title: 'Hardware Engineer',
    department: 'Engineering',
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: '3+ years',
    description:
      'Design and develop cutting-edge battery technology and charging solutions.',
    requirements: [
      '3+ years of hardware engineering experience',
      'Experience with battery technology and power management',
      'Proficiency in circuit design and PCB layout',
      "Bachelor's degree in Electrical Engineering",
    ],
  },
  {
    id: 3,
    title: 'Quality Assurance Specialist',
    department: 'Quality',
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: '2+ years',
    description:
      'Ensure product quality and compliance with industry standards.',
    requirements: [
      '2+ years of QA experience in electronics',
      'Knowledge of quality standards and testing procedures',
      'Attention to detail and analytical mindset',
      "Bachelor's degree in Engineering or related field",
    ],
  },
  {
    id: 4,
    title: 'Digital Marketing Manager',
    department: 'Marketing',
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: '4+ years',
    description:
      'Drive digital marketing strategies and brand awareness for Touchtek products.',
    requirements: [
      '4+ years of digital marketing experience',
      'Experience with e-commerce and social media marketing',
      'Strong analytical and creative skills',
      "Bachelor's degree in Marketing or related field",
    ],
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
    resume: null,
  });

  const handleJobSelect = (jobId) => {
    setSelectedJob(jobId);
    const job = jobOpenings.find((j) => j.id === jobId);
    if (job) {
      setApplicationData((prev) => ({ ...prev, position: job.title }));
    }
  };

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData({
        ...applicationData,
        resume: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Application submitted:', applicationData);
    alert('Thank you for your application! We will review it and get back to you soon.');
    setApplicationData({
      name: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      coverLetter: '',
      resume: null,
    });
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Be part of the innovation that's shaping the future of technology accessories
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Culture */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Work at Touchtek?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join a team of passionate innovators dedicated to creating the next generation of tech accessories
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborative Culture</h3>
                <p className="text-gray-600">
                  Work with talented individuals in a supportive and inclusive environment
                </p>
              </motion.div>

              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
                <p className="text-gray-600">
                  Advance your career with continuous learning and development programs
                </p>
              </motion.div>

              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Work-Life Balance</h3>
                <p className="text-gray-600">
                  Flexible working arrangements and comprehensive benefits package
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Openings</h2>
              <p className="text-lg text-gray-600">Explore exciting career opportunities with us</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Listings */}
              <div className="space-y-6">
                {jobOpenings.map((job, index) => (
                  <motion.div
                    key={job.id}
                    className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-300 ${
                      selectedJob === job.id ? 'ring-2 ring-black' : 'hover:shadow-xl'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => handleJobSelect(job.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {job.experience}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <button className="text-black font-semibold hover:underline">
                      {selectedJob === job.id ? 'Selected - Apply Below' : 'Apply Now →'}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Application Form */}
              <motion.div
                className="bg-white rounded-lg shadow-lg p-8"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply for Position</h3>
                {selectedJob ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position Applied For
                      </label>
                      <input
                        type="text"
                        value={applicationData.position}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={applicationData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={applicationData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={applicationData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience *
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          required
                          value={applicationData.experience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="">Select experience</option>
                          <option value="0-1">0-1 years</option>
                          <option value="2-3">2-3 years</option>
                          <option value="4-5">4-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                        Resume/CV *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          required
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="resume" className="cursor-pointer">
                          <span className="text-black font-medium">Click to upload</span>
                          <span className="text-gray-600"> or drag and drop</span>
                        </label>
                        <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                        {applicationData.resume && (
                          <p className="text-sm text-green-600 mt-2">
                            Selected: {applicationData.resume.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter *
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        required
                        rows={6}
                        value={applicationData.coverLetter}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Submit Application
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Select a Position</h4>
                    <p className="text-gray-600">
                      Choose a job opening from the list to start your application
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
