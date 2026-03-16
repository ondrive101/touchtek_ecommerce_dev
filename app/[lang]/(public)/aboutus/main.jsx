'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Users, Award, Heart, Zap, Shield, Package,
  Rocket, Building, ChevronRight, Sparkles, Factory,
  ThumbsUp, Crown, Linkedin, Mail
} from 'lucide-react';

import Header from "@/components/layout/components/Header";
import Footer from "@/components/layout/components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: '2016', label: 'Established', icon: Building },
  { value: '150+', label: 'Team Members', icon: Users },
  { value: '5+', label: 'Offices / Warehouses', icon: Factory },
];

const values = [
  { icon: Heart, title: 'Passion for Quality', description: 'Our motto drives every decision we make, ensuring excellence in every product.', color: 'from-red-400 to-red-600' },
  { icon: Zap, title: 'Innovation First', description: 'We stay ahead of tech trends, bringing you the latest innovations in mobile accessories.', color: 'from-yellow-400 to-yellow-600' },
  { icon: ThumbsUp, title: 'Customer Focus', description: 'Building long-term partnerships through consistent performance and timely support.', color: 'from-blue-400 to-blue-600' },
  { icon: Shield, title: 'Trust & Reliability', description: 'Delivering quality products at competitive prices, backed by our commitment to excellence.', color: 'from-green-400 to-green-600' }
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
  { name: 'Batteries', icon: '🪫', count: 'Lithium & Polymer' }
];

const teamDepts = [
  { name: 'Manufacturing', description: 'State-of-the-art production facilities', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop' },
  { name: 'Quality Control', description: 'Rigorous testing and certification', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop' },
  { name: 'Innovation', description: 'Advanced R&D and design team', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop' },
  { name: 'Distribution', description: 'Global logistics and warehousing', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' }
];

// ─── Owners ───────────────────────────────────────────────────────────────────

const owners = [
  {
    name: 'Neeraj Goel', title: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
    bio: 'Visionary entrepreneur with 15+ years in consumer electronics. Rajesh founded Touchtek with a singular mission — to make quality tech accessories accessible to every Indian household.',
    quote: '"Quality is not an act, it is a habit."',
    linkedin: '#', email: 'rajesh@touchtek.in', badge: 'Founder',
    accent: 'from-amber-400 to-orange-500', glow: 'rgba(251,146,60,0.35)'
  },
  {
    name: 'Anchal Goel', title: 'Co-Founder & COO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
    bio: "Operations expert who built Touchtek's 5-warehouse network from scratch. Priya oversees supply chain, logistics, and the 150+ member team with precision and passion.",
    quote: '"Excellence is in the details of every shipment."',
    linkedin: '#', email: 'priya@touchtek.in', badge: 'Co-Founder',
    accent: 'from-violet-400 to-pink-500', glow: 'rgba(167,139,250,0.35)'
  },
  {
    name: 'Ritesh Gupta', title: 'Co-Founder & CTO',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
    bio: "Tech innovator leading Touchtek's R&D center. Amit drives product innovation across charging, audio, and battery solutions, holding multiple patents in mobile accessory design.",
    quote: '"The next big thing is always being built."',
    linkedin: '#', email: 'amit@touchtek.in', badge: 'Co-Founder',
    accent: 'from-cyan-400 to-blue-500', glow: 'rgba(34,211,238,0.35)'
  }
];

// ─── Team Members (40) ────────────────────────────────────────────────────────

const teamMembers = [
  { name: 'Sneha Gupta',      role: 'Product Designer',       dept: 'Design',        avatar: 'https://i.pravatar.cc/150?img=1',  accent: 'from-pink-400 to-rose-500',      glow: 'rgba(244,114,182,0.3)' },
  { name: 'Vikram Singh',     role: 'Supply Chain Manager',   dept: 'Operations',    avatar: 'https://i.pravatar.cc/150?img=2',  accent: 'from-orange-400 to-amber-500',   glow: 'rgba(251,146,60,0.3)'  },
  { name: 'Neha Joshi',       role: 'QA Engineer',            dept: 'Quality',       avatar: 'https://i.pravatar.cc/150?img=3',  accent: 'from-green-400 to-emerald-500',  glow: 'rgba(74,222,128,0.3)'  },
  { name: 'Arjun Mehta',      role: 'Sales Executive',        dept: 'Sales',         avatar: 'https://i.pravatar.cc/150?img=4',  accent: 'from-blue-400 to-indigo-500',    glow: 'rgba(96,165,250,0.3)'  },
  { name: 'Kavya Reddy',      role: 'Marketing Lead',         dept: 'Marketing',     avatar: 'https://i.pravatar.cc/150?img=5',  accent: 'from-purple-400 to-violet-500',  glow: 'rgba(192,132,252,0.3)' },
  { name: 'Rohit Verma',      role: 'Warehouse Supervisor',   dept: 'Logistics',     avatar: 'https://i.pravatar.cc/150?img=6',  accent: 'from-teal-400 to-cyan-500',      glow: 'rgba(45,212,191,0.3)'  },
  { name: 'Pooja Nair',       role: 'Customer Support',       dept: 'Support',       avatar: 'https://i.pravatar.cc/150?img=7',  accent: 'from-yellow-400 to-orange-400',  glow: 'rgba(250,204,21,0.3)'  },
  { name: 'Sanjay Dubey',     role: 'R&D Engineer',           dept: 'Innovation',    avatar: 'https://i.pravatar.cc/150?img=8',  accent: 'from-cyan-400 to-blue-500',      glow: 'rgba(34,211,238,0.3)'  },
  { name: 'Ananya Das',       role: 'Finance Analyst',        dept: 'Finance',       avatar: 'https://i.pravatar.cc/150?img=9',  accent: 'from-emerald-400 to-green-500',  glow: 'rgba(52,211,153,0.3)'  },
  { name: 'Karan Malhotra',   role: 'IT Manager',             dept: 'Technology',    avatar: 'https://i.pravatar.cc/150?img=10', accent: 'from-indigo-400 to-purple-500',  glow: 'rgba(129,140,248,0.3)' },
  { name: 'Ritu Chopra',      role: 'Brand Manager',          dept: 'Marketing',     avatar: 'https://i.pravatar.cc/150?img=11', accent: 'from-fuchsia-400 to-pink-500',   glow: 'rgba(232,121,249,0.3)' },
  { name: 'Deepak Sharma',    role: 'Logistics Coordinator',  dept: 'Logistics',     avatar: 'https://i.pravatar.cc/150?img=12', accent: 'from-teal-400 to-green-500',     glow: 'rgba(45,212,191,0.3)'  },
  { name: 'Meera Pillai',     role: 'HR Manager',             dept: 'HR',            avatar: 'https://i.pravatar.cc/150?img=13', accent: 'from-rose-400 to-pink-500',      glow: 'rgba(251,113,133,0.3)' },
  { name: 'Aakash Tiwari',    role: 'Product Manager',        dept: 'Product',       avatar: 'https://i.pravatar.cc/150?img=14', accent: 'from-violet-400 to-indigo-500',  glow: 'rgba(167,139,250,0.3)' },
  { name: 'Sunita Rao',       role: 'Accounts Lead',          dept: 'Finance',       avatar: 'https://i.pravatar.cc/150?img=15', accent: 'from-emerald-400 to-teal-500',   glow: 'rgba(52,211,153,0.3)'  },
  { name: 'Nikhil Bansal',    role: 'Hardware Engineer',      dept: 'Innovation',    avatar: 'https://i.pravatar.cc/150?img=16', accent: 'from-sky-400 to-blue-500',       glow: 'rgba(56,189,248,0.3)'  },
  { name: 'Pallavi Mishra',   role: 'Social Media Manager',   dept: 'Marketing',     avatar: 'https://i.pravatar.cc/150?img=17', accent: 'from-pink-400 to-fuchsia-500',   glow: 'rgba(244,114,182,0.3)' },
  { name: 'Gaurav Sinha',     role: 'Regional Sales Head',    dept: 'Sales',         avatar: 'https://i.pravatar.cc/150?img=18', accent: 'from-blue-400 to-cyan-500',      glow: 'rgba(96,165,250,0.3)'  },
  { name: 'Tanvi Agarwal',    role: 'UX Designer',            dept: 'Design',        avatar: 'https://i.pravatar.cc/150?img=19', accent: 'from-rose-400 to-orange-500',    glow: 'rgba(251,113,133,0.3)' },
  { name: 'Manish Pandey',    role: 'Factory Supervisor',     dept: 'Manufacturing', avatar: 'https://i.pravatar.cc/150?img=20', accent: 'from-amber-400 to-yellow-500',   glow: 'rgba(251,191,36,0.3)'  },
  { name: 'Ishaan Kapoor',    role: 'Business Analyst',       dept: 'Strategy',      avatar: 'https://i.pravatar.cc/150?img=21', accent: 'from-sky-400 to-indigo-500',     glow: 'rgba(56,189,248,0.3)'  },
  { name: 'Divya Menon',      role: 'Compliance Officer',     dept: 'Legal',         avatar: 'https://i.pravatar.cc/150?img=22', accent: 'from-slate-400 to-gray-500',     glow: 'rgba(148,163,184,0.3)' },
  { name: 'Rahul Saxena',     role: 'Network Engineer',       dept: 'Technology',    avatar: 'https://i.pravatar.cc/150?img=23', accent: 'from-indigo-400 to-blue-500',    glow: 'rgba(129,140,248,0.3)' },
  { name: 'Shruti Kulkarni',  role: 'Content Writer',         dept: 'Marketing',     avatar: 'https://i.pravatar.cc/150?img=24', accent: 'from-purple-400 to-pink-500',    glow: 'rgba(192,132,252,0.3)' },
  { name: 'Piyush Jain',      role: 'Operations Analyst',     dept: 'Operations',    avatar: 'https://i.pravatar.cc/150?img=25', accent: 'from-orange-400 to-red-500',     glow: 'rgba(251,146,60,0.3)'  },
  { name: 'Nisha Goswami',    role: 'Customer Success',       dept: 'Support',       avatar: 'https://i.pravatar.cc/150?img=26', accent: 'from-yellow-400 to-amber-500',   glow: 'rgba(250,204,21,0.3)'  },
  { name: 'Vivek Thakur',     role: 'Production Engineer',    dept: 'Manufacturing', avatar: 'https://i.pravatar.cc/150?img=27', accent: 'from-amber-400 to-orange-500',   glow: 'rgba(251,191,36,0.3)'  },
  { name: 'Ankita Bose',      role: 'Legal Counsel',          dept: 'Legal',         avatar: 'https://i.pravatar.cc/150?img=28', accent: 'from-gray-400 to-slate-500',     glow: 'rgba(156,163,175,0.3)' },
  { name: 'Suresh Nambiar',   role: 'Export Manager',         dept: 'Sales',         avatar: 'https://i.pravatar.cc/150?img=29', accent: 'from-blue-400 to-sky-500',       glow: 'rgba(96,165,250,0.3)'  },
  { name: 'Priyanka Ghosh',   role: 'Training Manager',       dept: 'HR',            avatar: 'https://i.pravatar.cc/150?img=30', accent: 'from-rose-400 to-red-500',       glow: 'rgba(251,113,133,0.3)' },
  { name: 'Mohit Aggarwal',   role: 'Inventory Controller',   dept: 'Logistics',     avatar: 'https://i.pravatar.cc/150?img=31', accent: 'from-teal-400 to-cyan-500',      glow: 'rgba(45,212,191,0.3)'  },
  { name: 'Swati Bajaj',      role: 'PR Specialist',          dept: 'Marketing',     avatar: 'https://i.pravatar.cc/150?img=32', accent: 'from-fuchsia-400 to-purple-500', glow: 'rgba(232,121,249,0.3)' },
  { name: 'Ajay Rawat',       role: 'Security Head',          dept: 'Operations',    avatar: 'https://i.pravatar.cc/150?img=33', accent: 'from-red-400 to-rose-500',       glow: 'rgba(248,113,113,0.3)' },
  { name: 'Leena Shah',       role: 'Packaging Designer',     dept: 'Design',        avatar: 'https://i.pravatar.cc/150?img=34', accent: 'from-pink-400 to-rose-400',      glow: 'rgba(244,114,182,0.3)' },
  { name: 'Harsh Vardhan',    role: 'Test Engineer',          dept: 'Quality',       avatar: 'https://i.pravatar.cc/150?img=35', accent: 'from-green-400 to-teal-500',     glow: 'rgba(74,222,128,0.3)'  },
  { name: 'Kamla Srivastava', role: 'Admin Executive',        dept: 'Admin',         avatar: 'https://i.pravatar.cc/150?img=36', accent: 'from-lime-400 to-green-500',     glow: 'rgba(163,230,53,0.3)'  },
  { name: 'Rajan Iyer',       role: 'Procurement Head',       dept: 'Operations',    avatar: 'https://i.pravatar.cc/150?img=37', accent: 'from-orange-400 to-amber-400',   glow: 'rgba(251,146,60,0.3)'  },
  { name: 'Payal Chauhan',    role: 'Digital Marketer',       dept: 'Marketing',     avatar: 'https://i.pravatar.cc/150?img=38', accent: 'from-violet-400 to-purple-500',  glow: 'rgba(167,139,250,0.3)' },
  { name: 'Dinesh Choudhary', role: 'Electrician Supervisor', dept: 'Manufacturing', avatar: 'https://i.pravatar.cc/150?img=39', accent: 'from-yellow-400 to-orange-500',  glow: 'rgba(250,204,21,0.3)'  },
  { name: 'Taruna Bhatt',     role: 'Recruitment Specialist', dept: 'HR',            avatar: 'https://i.pravatar.cc/150?img=40', accent: 'from-rose-400 to-fuchsia-500',   glow: 'rgba(251,113,133,0.3)' },
];

// ─── Founder Flip Card ────────────────────────────────────────────────────────

function OwnerCard({ owner, index }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.7 }}
      viewport={{ once: true }}
      className="cursor-pointer"
      style={{ perspective: 1400 }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="rounded-2xl p-[1px] transition-all duration-500"
        style={{
          background: flipped
            ? `linear-gradient(135deg, ${owner.glow.replace('0.35','0.8')}, transparent)`
            : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          boxShadow: flipped ? `0 0 50px ${owner.glow}` : '0 8px 40px rgba(0,0,0,0.6)'
        }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: 500 }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
            <img src={owner.image} alt={owner.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000000f0 40%, #00000055 70%, transparent 100%)' }} />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className={`bg-gradient-to-r ${owner.accent} text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg`}>
                <Crown className="w-3 h-3" />{owner.badge}
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white/60 text-xs px-3 py-1.5 rounded-full">Tap to flip ✦</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className={`h-0.5 w-12 bg-gradient-to-r ${owner.accent} rounded-full mb-4`} />
              <h3 className="text-2xl font-bold text-white tracking-tight">{owner.name}</h3>
              <p className="text-sm text-white/50 mt-1 mb-4">{owner.title}</p>
              <div className="flex gap-2">
                <a href={owner.linkedin} onClick={e => e.stopPropagation()} className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 border border-white/10 flex items-center justify-center transition-all backdrop-blur-sm">
                  <Linkedin className="w-4 h-4 text-white" />
                </a>
                <a href={`mailto:${owner.email}`} onClick={e => e.stopPropagation()} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/10 flex items-center justify-center transition-all backdrop-blur-sm">
                  <Mail className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-center items-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(145deg, #0a0a0a, #111111)' }}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 35%, ${owner.glow}, transparent 65%)` }} />
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className={`relative w-16 h-16 bg-gradient-to-br ${owner.accent} rounded-2xl flex items-center justify-center mb-5 shadow-2xl`} style={{ boxShadow: `0 8px 32px ${owner.glow}` }}>
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1 relative z-10">{owner.name}</h3>
            <p className={`text-sm font-semibold bg-gradient-to-r ${owner.accent} bg-clip-text text-transparent mb-1 relative z-10`}>{owner.title}</p>
            <div className={`h-px w-16 bg-gradient-to-r ${owner.accent} opacity-50 rounded-full my-4`} />
            <p className="text-white/60 text-sm leading-relaxed mb-5 relative z-10">{owner.bio}</p>
            <blockquote className="text-xs italic text-white/35 border-l-2 pl-4 text-left relative z-10" style={{ borderColor: owner.glow.replace('0.35','0.6') }}>{owner.quote}</blockquote>
            <div className="flex gap-3 mt-6 relative z-10">
              <a href={owner.linkedin} onClick={e => e.stopPropagation()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
              <a href={`mailto:${owner.email}`} onClick={e => e.stopPropagation()} className="flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors">
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            </div>
            <p className="text-white/20 text-xs mt-5 relative z-10">← Tap to flip back</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Team Static Card (tall, no flip) ────────────────────────────────────────

function TeamCard({ member }) {
  return (
    <div
      className="relative flex-shrink-0 rounded-xl overflow-hidden group"
      style={{
        width: 180,
        minHeight: 260,
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(145deg, #0d0d0d, #111)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 0 28px ${member.glow}`;
        e.currentTarget.style.borderColor = member.glow.replace('0.3','0.5');
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      
      <div className="relative w-full" style={{ height: 190 }}>
        <img
          src={member.avatar}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        {/* Gradient overlay */}
        {/* <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d0d0d 5%, rgba(0,0,0,0.35) 60%, transparent 100%)' }} /> */}

        {/* Dept badge */}
        <div className="absolute top-2.5 left-2.5">
          <div
            className={`bg-gradient-to-r ${member.accent} text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md`}
          >
            {member.dept}
          </div>
        </div>

      </div>

      {/* Info panel */}
      <div className="px-3.5 py-3 relative">
        {/* Accent line */}
        <div className={`h-0.5 w-8 bg-gradient-to-r ${member.accent} rounded-full mb-2.5`} />

        <h3 className="text-white text-sm font-bold leading-tight tracking-tight">{member.name}</h3>
        <p className="text-white/45 text-[11px] mt-0.5 leading-tight">{member.role}</p>

        {/* Social row */}
        {/* <div className="flex gap-1.5 mt-3">
          <a
            href="#"
            className="flex items-center gap-1 text-[10px] font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-blue-600/80 border border-white/8 px-2 py-1 rounded-lg transition-all duration-200"
            onClick={e => e.stopPropagation()}
          >
            <Linkedin className="w-2.5 h-2.5" /> LinkedIn
          </a>
          <a
            href="#"
            className="flex items-center gap-1 text-[10px] font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/15 border border-white/8 px-2 py-1 rounded-lg transition-all duration-200"
            onClick={e => e.stopPropagation()}
          >
            <Mail className="w-2.5 h-2.5" /> Email
          </a>
        </div> */}
      </div>

      {/* Subtle inner glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-400 rounded-xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${member.glow.replace('0.3','0.08')}, transparent 70%)` }}
      />
    </div>
  );
}

// ─── Marquee Row ──────────────────────────────────────────────────────────────

function MarqueeRow({ members, reverse, speed }) {
  const doubled = [...members, ...members];
  const id = `mq-${reverse ? 'r' : 'f'}-${speed}`;

  return (
    <div className="relative overflow-hidden py-2">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10"
        style={{ background: 'linear-gradient(to right, #000, transparent)' }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10"
        style={{ background: 'linear-gradient(to left, #000, transparent)' }} />

      <div
        className="flex gap-6 w-max"
        style={{ animation: `${id} ${speed}s linear infinite` }}
      >
        {doubled.map((member, i) => (
          <TeamCard key={i} member={member} />
        ))}
      </div>

      <style>{`
        @keyframes ${id} {
          0%   { transform: translateX(${reverse ? '-50%' : '0'}); }
          100% { transform: translateX(${reverse ? '0' : '-50%'}); }
        }
        .${id}-wrap:hover > div[style] { animation-play-state: paused; }
      `}</style>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>

        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">Passion for Quality Since 2016</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Powering Innovation in
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Mobile Accessories</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Leading the industry with innovation, quality, and value. We're your trusted partner for cutting-edge tech accessories.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="/products" className="bg-white text-black px-8 py-3 rounded-lg hover:shadow-2xl transition-all font-semibold inline-flex items-center gap-2">
                  Explore Products <ChevronRight className="w-4 h-4" />
                </a>
                <a href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-all font-semibold">
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none"><path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z" fill="rgb(249,250,251)" /></svg>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-16 -mt-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-2xl transition-all">
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

        {/* ── Story ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Our Story</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Pioneering Excellence in Mobile Accessories</h2>
                <div className="space-y-4 text-gray-600">
                  <p>Established over 9+ years ago, Touchtek is an Indian consumer electronics brand specializing in reliable mobile accessories and battery solutions.</p>
                  <p>At Touchtek, our motto <strong>"Passion for Quality"</strong> drives everything we do. With a dedicated team of over <strong>150 professionals</strong> and <strong>5+ warehouses</strong>.</p>
                  <p>We believe in building long-term partnerships ensuring consistent product performance, sleek design, and timely support.</p>
                  <p>From polymer batteries to chargers, data cables, neckbands, TWS, and speakers — designed for everyday efficiency.</p>
                </div>
                <div className="flex gap-4 mt-8">
                  <a href="/products" className="bg-black text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all font-semibold inline-flex items-center gap-2">
                    View Products <ChevronRight className="w-4 h-4" />
                  </a>
                  <a href="/warranty" className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-black hover:bg-gray-50 transition-all font-semibold">Warranty Info</a>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop" alt="Touchtek Office" className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
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

        {/* ── Values ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-4 py-2 mb-4">
                <Heart className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">Our Values</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our core values shape our culture and guide our commitment to excellence</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group">
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

        {/* ══════════════════════════════════════════════
            FOUNDERS — Black Gradient + Flip Cards
        ══════════════════════════════════════════════ */}
        <section
          className="relative py-24 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #000000 0%, #0a0a0a 40%, #050510 70%, #000000 100%)' }}
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.06) 0%, transparent 70%)', transform: 'translateY(-50%)' }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)', transform: 'translateY(50%)' }} />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)', transform: 'translate(-50%,-50%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-white/80">Leadership</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Meet the Founders</h2>
              <p className="text-lg text-white/40 max-w-xl mx-auto">
                The visionaries behind Touchtek —{' '}
                <span className="text-white/70 font-medium">tap any card</span> to learn their story
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {owners.map((owner, index) => (
                <OwnerCard key={index} owner={owner} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            TEAM MARQUEE — Tall Cards, Black BG, No Flip
        ══════════════════════════════════════════════ */}
        <section
          className="relative py-20 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #000000 0%, #07070f 50%, #000000 100%)' }}
        >
          {/* Hairlines */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)' }} />

          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 w-[700px] h-[300px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)', transform: 'translate(-50%,-50%)' }} />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-white/70">Our People</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">The Team Behind the Brand</h2>
              <p className="text-lg text-white/40 max-w-2xl mx-auto">
                40+ dedicated professionals across design, tech, operations, sales & more
              </p>
            </motion.div>
          </div>

          {/* Three marquee rows — tall cards, different speeds & directions */}
          <div className="space-y-5 relative z-10">
            <MarqueeRow members={teamMembers} reverse={false} speed={120} />
          </div>

        </section>

        {/* ── Timeline ── */}
        <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
                <Rocket className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold">Our Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Milestones of Excellence</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">A decade of innovation, growth, and success</p>
            </motion.div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block" />
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-inherit`}>
                      <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-sm text-gray-300">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-4 border-gray-900 shadow-lg" />
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Products ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-2 mb-4">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Product Range</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Tech Solutions</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">From everyday essentials to cutting-edge innovations</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.map((product, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-black hover:shadow-xl transition-all group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{product.icon}</div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-600">{product.count}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-8 py-3 rounded-lg hover:shadow-2xl transition-all font-semibold">
                Explore All Products <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Operations ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-2 mb-4">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-600">Our Operations</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Excellence Across Every Function</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">150+ professionals dedicated to bringing you the best</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamDepts.map((dept, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="group">
                  <div className="relative rounded-xl overflow-hidden shadow-lg mb-4">
                    <img src={dept.image} alt={dept.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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

        {/* ── CTA ── */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner with Us?</h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers worldwide. Experience the Touchtek difference today.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:shadow-2xl transition-all font-semibold inline-flex items-center gap-2">
                  Browse Products <ChevronRight className="w-5 h-5" />
                </a>
                <a href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-all font-semibold">
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
