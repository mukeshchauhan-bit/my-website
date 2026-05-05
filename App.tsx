/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  Zap, 
  Globe, 
  MessageSquare, 
  Star, 
  X, 
  Lock, 
  Download, 
  Trash2, 
  Edit3, 
  Menu, 
  ChevronRight,
  TrendingUp,
  Layout,
  Smartphone,
  CheckCircle2,
  Phone,
  Mail,
  Send
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';

// --- Types ---
interface Lead {
  id: number;
  name: string;
  phone: string;
  business: string;
  message: string;
  timestamp: string;
}

interface Feedback {
  id: number;
  name: string;
  rating: number;
  message: string;
  timestamp: string;
}

interface Service {
  id: number;
  title: string;
  price: string;
  desc: string;
  category: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  img: string;
}

// --- Components ---

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <motion.div 
    className="flex items-center gap-3 cursor-pointer group"
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
  >
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Rotating Background Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-sky-500/40 to-indigo-500/40 rounded-full blur-xl"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* The Rocket Circle */}
      <svg width="48" height="48" viewBox="0 0 100 100" className="relative z-10 drop-shadow-2xl">
        <defs>
          <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#38bdf8' }} />
            <stop offset="100%" style={{ stopColor: '#6366f1' }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#rocketGrad)" />
        
        {/* Animated Rocket Emoji */}
        <motion.text 
          x="50%" 
          y="58%" 
          textAnchor="middle" 
          fontSize="45"
          animate={{ 
            y: ["58%", "52%", "58%"],
            rotate: [-5, 5, -5]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          🚀
        </motion.text>
      </svg>
    </div>
    
    <div className="flex flex-col -space-y-1">
      <h2 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
        GrowSite Studio
      </h2>
      <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Premium Agency</span>
    </div>
  </motion.div>
);

const GlowButton = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary" 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost"
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-[0_0_20px_-5px_rgba(56,189,248,0.5)]",
    secondary: "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${variants[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-sky-400/30 -z-10" />
      )}
    </motion.button>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [adminPassword, setAdminPassword] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const logoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleLogoClick = () => {
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    
    const newCount = logoClicks + 1;
    if (newCount >= 7) {
      setIsAdminVisible(true);
      setLogoClicks(0);
      alert("🔐 Admin Mode Activated");
    } else {
      setLogoClicks(newCount);
      logoTimerRef.current = setTimeout(() => {
        setLogoClicks(0);
      }, 3000);
    }
  };

  useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem("leads") || "[]");
    const savedFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    const savedServices = JSON.parse(localStorage.getItem("services") || "[]");
    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");

    setLeads(savedLeads);
    setFeedbacks(savedFeedbacks);
    
    if (savedServices.length === 0) {
      const defaultServices = [
        { id: 1, title: "Single Page Apps", price: "From ₹999", desc: "Perfect for startups and simple landing pages with high conversion rates.", category: "Starter" },
        { id: 2, title: "Business Platform", price: "From ₹2,999", desc: "Comprehensive multi-page sites with advanced SEO and custom branding.", category: "Growth" },
        { id: 3, title: "Enterprise Solutions", price: "From ₹4,999", desc: "Fully custom dynamic applications with API integrations and admin dashboards.", category: "Business" }
      ];
      setServices(defaultServices);
      localStorage.setItem("services", JSON.stringify(defaultServices));
    } else {
      setServices(savedServices);
    }

    if (savedProjects.length === 0) {
      const defaultProjects = [
        { id: 1, title: "Modern Garage Network", category: "Commercial Web App", img: "https://picsum.photos/seed/garage/800/600" },
        { id: 2, title: "Eco-Shop Hub", category: "E-Commerce", img: "https://picsum.photos/seed/shop/800/600" }
      ];
      setProjects(defaultProjects);
      localStorage.setItem("projects", JSON.stringify(defaultProjects));
    } else {
      setProjects(savedProjects);
    }
    
    const timer = setTimeout(() => setLoading(false), 1500);
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === "admin1275") {
      setIsAdminLoggedIn(true);
      setAdminPassword("");
    } else {
      alert("Invalid password!");
    }
  };

  const submitLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLead: Lead = {
      id: Date.now(),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      business: (formData.get("business") as string) || "Not specified",
      message: (formData.get("message") as string) || "No details",
      timestamp: new Date().toLocaleString()
    };

    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    localStorage.setItem("leads", JSON.stringify(updatedLeads));
    alert("Requirement submitted successfully!");
    e.currentTarget.reset();
  };

  const submitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFeedback: Feedback = {
      id: Date.now(),
      name: formData.get("name") as string,
      rating: parseInt(formData.get("rating") as string),
      message: (formData.get("message") as string) || "",
      timestamp: new Date().toLocaleString()
    };

    const updatedFeedbacks = [...feedbacks, newFeedback];
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));
    alert("Thank you for your feedback!");
    e.currentTarget.reset();
  };

  const deleteLead = (id: number) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    localStorage.setItem("leads", JSON.stringify(updated));
  };

  const deleteFeedback = (id: number) => {
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem("feedbacks", JSON.stringify(updated));
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now() };
    const updated = [...services, newService];
    setServices(updated);
    localStorage.setItem("services", JSON.stringify(updated));
  };

  const deleteService = (id: number) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem("services", JSON.stringify(updated));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now() };
    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  const deleteProject = (id: number) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50">
        <Logo />
        <motion.div 
          className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="h-full bg-sky-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 font-sans cursor-none">
      {/* Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-6 h-6 bg-sky-500 rounded-full pointer-events-none z-[9999] blur-[2px] opacity-60 hidden md:block"
        animate={{ 
          x: cursorPos.x - 12, 
          y: cursorPos.y - 12,
          scale: 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />

      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 z-[2000] origin-left" style={{ scaleX }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[1000] backdrop-blur-xl border-b border-white/5 bg-[#020617]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo onClick={handleLogoClick} />

          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide text-white/70">
            {['Home', 'Services', 'Work', 'Feedback', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-sky-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-sky-500 transition-all group-hover:w-full" />
              </a>
            ))}
            {isAdminVisible && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <GlowButton onClick={() => setIsAdminOpen(true)} variant="ghost" className="px-4 py-1.5 border border-amber-500/30 rounded-lg text-xs text-amber-400 hover:text-amber-300">
                  <Lock size={14} className="mr-2" /> Admin Panel
                </GlowButton>
              </motion.div>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[900] bg-[#020617] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold">
              {['Home', 'Services', 'Work', 'Feedback', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white/80 hover:text-sky-400 transition-colors"
                >
                  {item}
                </a>
              ))}
              {isAdminVisible && (
                <GlowButton onClick={() => { setIsAdminOpen(true); setIsMenuOpen(false); }} variant="secondary" className="mt-4 border-amber-500/30 text-amber-400">
                  <Lock size={18} className="mr-2" /> Admin Dashboard
                </GlowButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                Premium Digital Solutions
              </span>
              <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[0.95]">
                We build websites that <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
                  Grow Your Business
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium">
                Modern high-performance web applications designed to convert visitors into loyal customers. Scalable, secure, and stunning.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GlowButton onClick={() => window.open('https://wa.me/919173491275', '_blank')}>
                  Get Free Consultation <Rocket size={18} />
                </GlowButton>
                <GlowButton variant="secondary" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Portfolio
                </GlowButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Our Expertise</h2>
                <p className="text-white/40 max-w-md">Comprehensive solutions tailored to elevate your business presence in the digital landscape.</p>
              </div>
              <ChevronRight className="hidden md:block text-white/20" size={48} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-sky-500/30 transition-all hover:bg-sky-500/[0.02] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                    {idx % 3 === 0 ? <Layout className="text-sky-400" /> : idx % 3 === 1 ? <Globe className="text-indigo-400" /> : <Zap className="text-purple-400" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">{service.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sky-400 font-bold">{service.price}</span>
                    <span className="text-xs uppercase tracking-widest text-white/20">{service.category}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="work" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Recent Projects</h2>
              <div className="w-20 h-1 bg-sky-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <motion.div 
                  key={project.id}
                  className="group relative rounded-3xl overflow-hidden border border-white/10"
                  whileHover={{ y: -10 }}
                >
                  <img src={project.img} alt={project.title} className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 p-10">
                    <span className="text-sky-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 block">{project.category}</span>
                    <h3 className="text-3xl font-bold mb-6">{project.title}</h3>
                    <GlowButton variant="secondary" className="py-2 px-6 text-sm">View Implementation</GlowButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="py-20 px-6 bg-white/[0.01]">
          <div className="max-width: 7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-bold mb-8 tracking-tight">Client <span className="text-sky-400">Voices</span></h2>
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {feedbacks.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center text-white/30">
                      Be the first to share your experience.
                    </div>
                  ) : (
                    feedbacks.map((fb) => (
                      <motion.div 
                        key={fb.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden"
                      >
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < fb.rating ? "#38bdf8" : "none"} className={i < fb.rating ? "text-sky-400" : "text-white/10"} />
                          ))}
                        </div>
                        <p className="text-white/80 leading-relaxed italic mb-6">"{fb.message}"</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white/90">{fb.name}</span>
                          <span className="text-xs text-white/20">{fb.timestamp}</span>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                          <MessageSquare size={100} />
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-8">Share Your Feedback</h3>
                <form onSubmit={submitFeedback} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      name="name" 
                      required 
                      placeholder="Your Name" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors"
                    />
                    <select 
                      name="rating" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors appearance-none"
                    >
                      <option value="5" className="bg-[#020617]">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4" className="bg-[#020617]">⭐⭐⭐⭐ Good</option>
                      <option value="3" className="bg-[#020617]">⭐⭐⭐ Average</option>
                      <option value="2" className="bg-[#020617]">⭐⭐ Poor</option>
                      <option value="1" className="bg-[#020617]">⭐ Bad</option>
                    </select>
                  </div>
                  <textarea 
                    name="message" 
                    placeholder="Describe your experience with our services..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors h-32 resize-none"
                  />
                  <GlowButton className="w-full">
                    Post Review <Send size={18} />
                  </GlowButton>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-[40px] bg-gradient-to-br from-sky-600/20 to-indigo-900/20 border border-white/10 p-12 md:p-20 overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/10 blur-[80px] -z-10" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[100px] -z-10" />
              
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to start?</h2>
                <p className="text-white/60 mb-12 text-lg">Leave your requirements below and our team will get back to you within 24 hours.</p>
                
                <form onSubmit={submitLead} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Name</label>
                      <input name="name" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Phone</label>
                      <input name="phone" required placeholder="+91 00000 00000" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Business Type</label>
                    <input name="business" placeholder="Real Estate, Retail, etc." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Requirements</label>
                    <textarea name="message" placeholder="Briefly describe what you need..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all h-32" />
                  </div>
                  <GlowButton className="w-full py-5 text-lg">
                    Send Proposal Request <Send size={20} />
                  </GlowButton>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <Logo />
            <div className="flex gap-10 text-sm text-white/40 font-medium">
              <a href="mailto:contactforbusiness144@gmail.com" className="hover:text-white transition-colors flex items-center gap-2"><Mail size={16} /> Email</a>
              <a href="tel:+919173491275" className="hover:text-white transition-colors flex items-center gap-2"><Phone size={16} /> Call</a>
              <a href="https://wa.me/919173491275" target="_blank" className="hover:text-white transition-colors flex items-center gap-2"><MessageSquare size={16} /> WhatsApp</a>
            </div>
            <div className="text-[10px] uppercase tracking-[0.5em] text-white/20 mt-10">
              © 2026 GrowSite Studio • Premium Digital Agency
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-4xl max-h-[85vh] bg-[#0f172a] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                    <ShieldCheck className="text-sky-400" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold">Admin Console</h2>
                </div>
                <button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                  <X size={24} />
                </button>
              </div>

              {!isAdminLoggedIn ? (
                <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 uppercase tracking-[0.2em] text-[10px] font-bold text-white/40">Secure Access Point</div>
                  <input 
                    type="password" 
                    placeholder="Enter Admin Key" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all text-center text-2xl tracking-[0.5em] mb-6"
                  />
                  <GlowButton onClick={handleAdminLogin} className="w-full">Initialize Access</GlowButton>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex gap-4 mb-8">
                    <GlowButton variant="secondary" className="flex-1" onClick={() => {}}>
                      <TrendingUp size={18} /> Stats
                    </GlowButton>
                    <GlowButton variant="secondary" className="flex-1" onClick={() => {
                      const data = JSON.stringify({ leads, feedbacks }, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `growsite_data_${new Date().toISOString()}.json`;
                      a.click();
                    }}>
                      <Download size={18} /> Export Data
                    </GlowButton>
                    <GlowButton variant="danger" className="flex-1" onClick={() => setIsAdminLoggedIn(false)}>
                      Sign Out
                    </GlowButton>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-12">
                    {/* Content Management Tabs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                      {['Leads', 'Reviews', 'Services', 'Projects'].map(tab => (
                        <button key={tab} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-sky-500/10 hover:border-sky-500/30 transition-all font-bold text-xs uppercase tracking-widest">{tab}</button>
                      ))}
                    </div>

                    {/* Leads Management */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-sky-400" size={20} /> Active Leads ({leads.length})
                      </h3>
                      <div className="space-y-4">
                        {leads.map(lead => (
                          <div key={lead.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-sky-500/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-bold text-lg">{lead.name}</h4>
                                <span className="text-xs text-white/40 uppercase tracking-widest">{lead.timestamp}</span>
                              </div>
                              <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all"><Edit3 size={16} /></button>
                                <button onClick={() => deleteLead(lead.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 size={16} /></button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-white/60 mb-4">
                              <div className="p-3 rounded-lg bg-white/5">
                                <div className="text-[10px] uppercase opacity-50 mb-1">Phone</div>
                                {lead.phone}
                              </div>
                              <div className="p-3 rounded-lg bg-white/5">
                                <div className="text-[10px] uppercase opacity-50 mb-1">Business</div>
                                {lead.business}
                              </div>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                              {lead.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Management */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Star className="text-yellow-400" size={20} /> Client Reviews ({feedbacks.length})
                      </h3>
                      <div className="space-y-4">
                        {feedbacks.map(fb => (
                          <div key={fb.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-500/30 transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold">{fb.name}</span>
                              <button onClick={() => deleteFeedback(fb.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={16} /></button>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < fb.rating ? "#fbbf24" : "none"} className={i < fb.rating ? "text-yellow-400 border-none" : "text-white/10"} />
                              ))}
                            </div>
                            <p className="text-sm text-white/50 italic">"{fb.message}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Service Management */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Zap className="text-purple-400" size={20} /> Manage Services ({services.length})
                      </h3>
                      <form 
                        className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          addService({
                            title: formData.get("title") as string,
                            price: formData.get("price") as string,
                            desc: formData.get("desc") as string,
                            category: formData.get("category") as string
                          });
                          e.currentTarget.reset();
                        }}
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <input name="title" required placeholder="Service Title" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
                          <input name="price" required placeholder="Price (e.g. ₹999)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
                        </div>
                        <input name="category" required placeholder="Category" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
                        <textarea name="desc" required placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 h-20" />
                        <GlowButton className="w-full py-2">Add Service</GlowButton>
                      </form>
                      <div className="space-y-4">
                        {services.map(s => (
                          <div key={s.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                            <div>
                              <div className="font-bold">{s.title}</div>
                              <div className="text-xs text-white/40">{s.price} • {s.category}</div>
                            </div>
                            <button onClick={() => deleteService(s.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project Management */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Layout className="text-indigo-400" size={20} /> Manage Portfolio ({projects.length})
                      </h3>
                      <form 
                        className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          addProject({
                            title: formData.get("title") as string,
                            category: formData.get("category") as string,
                            img: formData.get("img") as string
                          });
                          e.currentTarget.reset();
                        }}
                      >
                        <input name="title" required placeholder="Project Title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
                        <input name="category" required placeholder="Category" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
                        <input name="img" required placeholder="Image URL" defaultValue="https://picsum.photos/seed/grow/800/600" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
                        <GlowButton className="w-full py-2">Add Project</GlowButton>
                      </form>
                      <div className="grid grid-cols-2 gap-4">
                        {projects.map(p => (
                          <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/5 relative group overflow-hidden">
                            <img src={p.img} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                            <div className="relative z-10 flex justify-between items-start">
                              <div>
                                <div className="font-bold text-sm">{p.title}</div>
                                <div className="text-[10px] text-white/40">{p.category}</div>
                              </div>
                              <button onClick={() => deleteProject(p.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --font-sans: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
        }

        .font-sans {
          font-family: var(--font-sans);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
}
