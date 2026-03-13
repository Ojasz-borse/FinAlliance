'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const techStack = [
    'Next.js',
    'Federated Learning',
    'Machine Learning',
    'Secure Aggregation',
    'TypeScript',
    'TailwindCSS',
];

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <footer ref={ref} className="relative border-t border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-navy-900/50" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-blue flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold gradient-text">FinAlliance</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                Collaborative AI Fraud Detection Across Banks Without Sharing Sensitive Data
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple/10 border border-purple/20">
                                <span className="w-2 h-2 rounded-full bg-purple animate-pulse" />
                                <span className="text-xs font-medium text-purple-light">Hackathon Project</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h4>
                            <ul className="space-y-2">
                                {['Problem', 'Solution', 'Architecture', 'AI Models', 'Innovation', 'Responsible AI'].map((link) => (
                                    <li key={link}>
                                        <a
                                            href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="text-sm text-slate-500 hover:text-cyan-light transition-colors duration-200"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-white/5 rounded-lg border border-white/5 hover:border-cyan/20 hover:text-cyan-light transition-all duration-200"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-600">
                            © {new Date().getFullYear()} FinAlliance. Built for hackathon demonstration purposes.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                            <span>Built with</span>
                            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>by Team FinAlliance</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
