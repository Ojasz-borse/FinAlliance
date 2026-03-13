'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const innovations = [
    {
        title: 'Federated Fraud Intelligence Network',
        subtitle: 'Secure Aggregation',
        description: 'Banks collaborate without sharing data. Only encrypted model updates are exchanged through secure channels, preserving complete data sovereignty.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
        ),
        gradient: 'from-cyan via-blue to-blue-dark',
        glow: 'rgba(6, 182, 212, 0.15)',
    },
    {
        title: 'Malicious Participant Detection',
        subtitle: 'Byzantine Fault Tolerance',
        description: 'Robust aggregation algorithms automatically detect and filter poisoned model updates from compromised or adversarial participants.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            </svg>
        ),
        gradient: 'from-purple via-purple-light to-blue',
        glow: 'rgba(139, 92, 246, 0.15)',
    },
    {
        title: 'Continuous Learning Feedback Loop',
        subtitle: 'Adaptive Retraining',
        description: 'Confirmed fraud cases from analyst feedback automatically retrain local models, continuously improving detection accuracy over time.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
            </svg>
        ),
        gradient: 'from-emerald via-emerald-light to-cyan',
        glow: 'rgba(16, 185, 129, 0.15)',
    },
    {
        title: 'Cross-Bank Pattern Recognition',
        subtitle: 'Multi-Institution Intelligence',
        description: 'Detects complex fraud networks that operate across multiple institutions — patterns invisible to any single bank operating alone.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        gradient: 'from-blue via-cyan to-emerald',
        glow: 'rgba(59, 130, 246, 0.15)',
    },
];

export default function InnovationSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="innovation" className="section-padding relative" ref={ref}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/50 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-cyan-light bg-cyan/10 rounded-full border border-cyan/20">
                        Key Differentiators
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        What Makes FinAlliance{' '}
                        <span className="gradient-text">Unique?</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Beyond standard federated learning — innovative features designed specifically for
                        the challenges of cross-bank fraud detection.
                    </p>
                </motion.div>

                {/* Innovation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {innovations.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                            className="group relative"
                        >
                            {/* Glow effect background */}
                            <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                                style={{ backgroundColor: item.glow }} />

                            <div className="relative glass rounded-2xl p-8 h-full hover:border-cyan/30 transition-all duration-500">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br mb-5 flex items-center justify-center text-white/90"
                                    style={{ background: `linear-gradient(135deg, ${item.glow}, transparent)` }}>
                                    {item.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-light transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm font-medium text-cyan mb-3">{item.subtitle}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>

                                {/* Decorative corner accent */}
                                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl opacity-10 group-hover:opacity-30 transition-opacity"
                                    style={{ borderColor: item.glow.replace('0.15', '1') }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
