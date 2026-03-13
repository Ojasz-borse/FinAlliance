'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const principles = [
    {
        title: 'Privacy Protection',
        description: 'Raw transaction data never leaves the bank premises. Only encrypted model parameters are shared, ensuring complete data sovereignty.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
        color: '#06b6d4',
    },
    {
        title: 'Bias Monitoring',
        description: 'Continuously evaluate fraud predictions across customer demographic segments to identify and mitigate potential algorithmic biases.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
        ),
        color: '#8b5cf6',
    },
    {
        title: 'Human Oversight',
        description: 'Fraud analysts validate every high-confidence alert. The system augments human judgment — it never replaces it.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
        color: '#10b981',
    },
    {
        title: 'Explainable Predictions',
        description: 'Every fraud probability score comes with clear reasons — feature contributions, risk factors, and confidence levels that analysts can understand.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
            </svg>
        ),
        color: '#3b82f6',
    },
    {
        title: 'Audit Logging',
        description: 'Complete system transparency for regulators. Every model update, aggregation decision, and prediction is logged and traceable.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
        ),
        color: '#f59e0b',
    },
];

export default function ResponsibleAISection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="responsible-ai" className="section-padding relative" ref={ref}>
            <div className="absolute inset-0 bg-grid opacity-15" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-emerald-light bg-emerald/10 rounded-full border border-emerald/20">
                        Ethics & Governance
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Responsible AI{' '}
                        <span className="gradient-text">by Design</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        FinAlliance is built with responsibility at its core — ensuring fairness,
                        transparency, and human control at every step.
                    </p>
                </motion.div>

                {/* Principle Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {principles.map((principle, i) => (
                        <motion.div
                            key={principle.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                            className={`glass rounded-2xl p-6 group hover:border-cyan/30 transition-all duration-500 ${i >= 3 ? 'sm:col-span-1 lg:col-span-1' : ''
                                }`}
                        >
                            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                style={{ backgroundColor: principle.color + '15', color: principle.color }}>
                                {principle.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-light transition-colors">
                                {principle.title}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{principle.description}</p>

                            {/* Animated bottom dot */}
                            <div className="mt-4 flex gap-1">
                                <div className="w-8 h-1 rounded-full transition-all duration-500 group-hover:w-12"
                                    style={{ backgroundColor: principle.color + '40' }} />
                                <div className="w-2 h-1 rounded-full"
                                    style={{ backgroundColor: principle.color + '20' }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
