'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import SectionParticles from './SectionParticles';

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
        accent: '#06b6d4',
        emoji: '🌐',
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
        accent: '#8b5cf6',
        emoji: '🛡️',
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
        accent: '#10b981',
        emoji: '🔄',
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
        accent: '#3b82f6',
        emoji: '👁️',
    },
];

export default function InnovationSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    return (
        <section id="innovation" className="section-padding relative overflow-hidden" ref={ref}>
            {/* Rich animated background */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/90 to-navy-950" />

            {/* Dynamic canvas particles */}
            <SectionParticles
                colors={['139, 92, 246', '59, 130, 246', '6, 182, 212', '167, 139, 250']}
                count={45}
                speed={0.7}
                glowIntensity={0.9}
            />

            {/* Animated diagonal lines */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent"
                    style={{ top: '30%', left: '-50%', transform: 'rotate(-20deg)' }}
                    animate={{ x: ['-50%', '50%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                    className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-purple/15 to-transparent"
                    style={{ top: '70%', left: '-50%', transform: 'rotate(15deg)' }}
                    animate={{ x: ['50%', '-50%'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-purple-light bg-purple/10 rounded-full border border-purple/20"
                    >
                        ✨ Key Differentiators
                    </motion.span>
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
                            whileHover={{ y: -6, scale: 1.02 }}
                            onHoverStart={() => setHoveredCard(i)}
                            onHoverEnd={() => setHoveredCard(null)}
                            className="group relative cursor-default"
                        >
                            {/* Animated border glow */}
                            <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ 
                                    background: `linear-gradient(135deg, ${item.accent}40, transparent, ${item.accent}20)`,
                                }} />
                            
                            {/* Outer glow */}
                            <div className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                                style={{ backgroundColor: item.accent + '10' }} />

                            <div className="relative glass rounded-2xl p-8 h-full hover:border-transparent transition-all duration-500 overflow-hidden">
                                {/* Background radial glow inside card */}
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ backgroundColor: item.accent + '15' }} />

                                <div className="relative z-10">
                                    {/* Emoji + icon row */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white/90 transition-all duration-300 group-hover:scale-110"
                                            style={{ background: `linear-gradient(135deg, ${item.accent}25, ${item.accent}08)` }}>
                                            {item.icon}
                                        </div>
                                        <span className="text-3xl">{item.emoji}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-light transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-medium mb-3" style={{ color: item.accent }}>{item.subtitle}</p>
                                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>

                                    {/* Animated underline */}
                                    <motion.div
                                        className="h-0.5 rounded-full mt-4"
                                        style={{ backgroundColor: item.accent }}
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={hoveredCard === i ? { width: '40%', opacity: 0.5 } : { width: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                {/* Decorative corners */}
                                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl opacity-5 group-hover:opacity-25 transition-opacity duration-500"
                                    style={{ borderColor: item.accent }} />
                                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-xl opacity-5 group-hover:opacity-25 transition-opacity duration-500"
                                    style={{ borderColor: item.accent }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
