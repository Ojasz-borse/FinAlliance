'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import SectionParticles from './SectionParticles';

const steps = [
    {
        number: '01',
        title: 'Input Layer',
        subtitle: 'Banks Collect Transaction Data',
        description: 'Transaction amount, timestamp, merchant type, and behavioral patterns are collected locally at each bank.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
        ),
        color: '#06b6d4',
    },
    {
        number: '02',
        title: 'Local Model Training',
        subtitle: 'Banks Train Fraud Models Locally',
        description: 'Each bank trains a fraud detection model on its own data. No raw data ever leaves the institution.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
        color: '#3b82f6',
    },
    {
        number: '03',
        title: 'Secure Model Update Sharing',
        subtitle: 'Encrypted Updates Sent to Server',
        description: 'Only encrypted model gradients and weights are shared — never raw transaction data or customer information.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
            </svg>
        ),
        color: '#8b5cf6',
    },
    {
        number: '04',
        title: 'Federated Aggregation',
        subtitle: 'Server Combines Model Updates',
        description: 'The federated server uses secure aggregation algorithms (Trimmed Mean, Median) to combine updates from all banks.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
            </svg>
        ),
        color: '#10b981',
    },
    {
        number: '05',
        title: 'Global Model Distribution',
        subtitle: 'Improved Model Shared Back',
        description: 'The aggregated global model, now containing insights from all banks, is securely distributed back to each institution.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
        ),
        color: '#06b6d4',
    },
    {
        number: '06',
        title: 'Fraud Detection',
        subtitle: 'Real-Time Fraud Scoring',
        description: 'Transactions are scored with fraud probability using the globally improved model, catching cross-bank patterns.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        color: '#3b82f6',
    },
];

export default function SolutionSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);

    return (
        <section id="solution" className="section-padding relative overflow-hidden" ref={ref}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />

            {/* Dynamic canvas particles */}
            <SectionParticles
                colors={['6, 182, 212', '59, 130, 246', '139, 92, 246']}
                count={45}
                speed={0.6}
                glowIntensity={0.85}
            />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-cyan-light bg-cyan/10 rounded-full border border-cyan/20"
                    >
                        🔗 Our Solution
                    </motion.span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        FinAlliance{' '}
                        <span className="gradient-text">Federated Learning</span>{' '}
                        System
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        A six-stage pipeline that enables collaborative fraud detection while keeping
                        all sensitive data within each institution&apos;s boundaries.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line with animated glow */}
                    <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan/40 via-blue/40 to-purple/40" />
                        <motion.div
                            className="absolute top-0 w-full h-20 bg-gradient-to-b from-cyan to-transparent"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            style={{ opacity: 0.6 }}
                        />
                    </div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                            className={`relative flex items-start mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                } flex-row`}
                            onMouseEnter={() => setHoveredStep(i)}
                            onMouseLeave={() => setHoveredStep(null)}
                        >
                            {/* Timeline dot with pulse */}
                            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                                <div className="w-4 h-4 rounded-full border-2"
                                    style={{ borderColor: step.color, backgroundColor: step.color + '30', boxShadow: `0 0 20px ${step.color}40` }} />
                                {hoveredStep === i && (
                                    <motion.div
                                        className="absolute inset-0 -m-2 rounded-full"
                                        style={{ borderColor: step.color, border: `2px solid ${step.color}40` }}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                )}
                            </div>

                            {/* Content card */}
                            <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                <motion.div
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    className="relative group"
                                >
                                    {/* Card glow */}
                                    <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                                        style={{ backgroundColor: step.color + '15' }} />
                                    
                                    <div className="relative glass rounded-2xl p-6 group hover:border-cyan/30 transition-all duration-500">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: step.color + '15', color: step.color }}>
                                                {step.icon}
                                            </div>
                                            <span className="text-xs font-mono font-bold px-2 py-1 rounded-md"
                                                style={{ backgroundColor: step.color + '15', color: step.color }}>
                                                STEP {step.number}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-light transition-colors">{step.title}</h3>
                                        <p className="text-sm font-medium mb-2" style={{ color: step.color }}>{step.subtitle}</p>
                                        <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>

                                        {/* Decorative corner */}
                                        <div className="absolute top-3 right-3 w-6 h-6 border-t border-r rounded-tr-lg opacity-10 group-hover:opacity-40 transition-opacity"
                                            style={{ borderColor: step.color }} />
                                        <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l rounded-bl-lg opacity-10 group-hover:opacity-40 transition-opacity"
                                            style={{ borderColor: step.color }} />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
