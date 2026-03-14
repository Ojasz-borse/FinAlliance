'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const navLinks = [
  { label: 'Problem', href: '/#problem' },
  { label: 'Solution', href: '/#solution' },
  { label: 'Innovation', href: '/#innovation' },
  { label: 'Demo', href: '/#demo' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Fraud Check', href: '/fraud-check' },
  { label: 'FL Console', href: '/federated' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Track active section for highlighting
  useEffect(() => {
    const sections = ['problem', 'solution', 'innovation', 'demo'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return activeSection === href.replace('/#', '');
    }
    return false;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-navy-950/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/20'
        : 'bg-transparent'
        }`}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-cyan via-blue to-purple"
        style={{ scaleX }}
      />

      {/* Subtle gradient line at top when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/10 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-blue flex items-center justify-center shadow-lg shadow-cyan/20"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan to-blue opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300" />
            </motion.div>
            <span className="text-xl font-bold gradient-text tracking-tight">FinAlliance</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-0.5 bg-white/[0.03] rounded-2xl px-1.5 py-1 border border-white/[0.04]">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-[13px] font-medium rounded-xl transition-all duration-300 ${active
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/[0.06]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan to-blue text-white shadow-lg shadow-cyan/20 hover:shadow-xl hover:shadow-cyan/30 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Open Dashboard</span>
              <svg className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-950/95 backdrop-blur-2xl border-t border-white/[0.06]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl transition-all duration-200 ${isActive(link.href)
                    ? 'text-white bg-white/[0.06] border border-white/[0.06]'
                    : 'text-slate-400 hover:text-cyan-light hover:bg-white/5'
                    }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 mt-3 text-center font-semibold rounded-xl bg-gradient-to-r from-cyan to-blue text-white shadow-lg shadow-cyan/20"
              >
                Open Dashboard
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
