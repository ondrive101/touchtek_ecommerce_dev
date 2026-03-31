'use client';

import { motion } from 'framer-motion';
import { Rocket, Zap, Eye, Github, Coffee } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden mt-2">
      {/* Animated Background */}
      <div className="opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header Badge */}
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl px-8 py-4 rounded-3xl mb-12">
            <Rocket className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-black bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </div>
          
          {/* Hero */}
          <div className="mb-20">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-600 bg-clip-text text-transparent mb-6 leading-none">
              {/* 🚧 */}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-6">
              Under Development
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Building something amazing. Stay tuned for the launch!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300"
            >
              <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Notify Me
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border-2 border-gray-200 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:border-gray-300 transition-all"
            >
              <Eye className="w-6 h-6" />
              Watch Progress
            </motion.button>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
