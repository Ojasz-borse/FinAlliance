'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const models = [
    {
        title: 'Federated Learning',
        description: 'Enables collaborative model training across multiple banks without sharing raw data. Each institution keeps its data local while contributing to a shared global model.',
        why: 'Preserves data privacy while enabling cross-institutional intelligence — the core of FinAlliance.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
        ),
        color: '#06b6d4',
        tag: 'Core Framework',
    },
    {
        title: 'Gradient Boosting',
        description: 'Sequentially builds decision trees, each correcting errors of the previous one. Exceptional at finding complex non-linear patterns in transaction data.',
        why: 'State-of-the-art performance on tabular financial data with built-in feature importance.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        color: '#3b82f6',
        tag: 'Classification',
    },
    {
        title: 'Random Forest',
        description: 'Ensemble of decision trees that vote on predictions. Provides robust fraud detection with natural resistance to overfitting and noisy data.',
        why: 'Handles mixed feature types in banking data and provides reliable baseline performance.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0L12 17.25 6.429 14.25m11.142 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25" />
            </svg>
        ),
        color: '#10b981',
        tag: 'Ensemble',
    },
    {
        title: 'Anomaly Detection',
        description: 'Identifies unusual transaction patterns that deviate from normal behavior. Critical for detecting new, previously unseen fraud strategies.',
        why: 'Catches zero-day fraud patterns that supervised models might miss in financial data.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        color: '#f59e0b',
        tag: 'Unsupervised',
    },
    {
        title: 'Robust Aggregation',
        description: 'Uses Trimmed Mean and Median Aggregation to combine model updates. Filters outliers and protects against poisoned updates from malicious participants.',
        why: 'Essential for security — prevents adversarial attacks on the federated learning process.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        color: '#8b5cf6',
        tag: 'Security',
    },
];

export default function AIModelsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="ai-models" className="section-padding relative" ref={ref}>
            <div className="absolute inset-0 dot-pattern opacity-30" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-cyan-light bg-cyan/10 rounded-full border border-cyan/20">
                        AI / ML Stack
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        AI Techniques{' '}
                        <span className="gradient-text">Used</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Purpose-built for financial tabular data — combining federated learning with
                        proven ML techniques for robust cross-bank fraud detection.
                    </p>
                </motion.div>

                {/* Model Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {models.map((model, i) => (
                        <motion.div
                            key={model.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                            className={`glass rounded-2xl p-6 group hover:border-cyan/30 transition-all duration-500 ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                                }`}
                        >
                            {/* Tag */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: model.color + '15', color: model.color }}>
                                    {model.icon}
                                </div>
                                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full"
                                    style={{ backgroundColor: model.color + '15', color: model.color }}>
                                    {model.tag}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-light transition-colors">
                                {model.title}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                {model.description}
                            </p>

                            {/* Why section */}
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Why This Technique?</p>
                                <p className="text-sm text-slate-300">{model.why}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Aggregation Methods Callout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-12 glass rounded-2xl p-8 max-w-4xl mx-auto border border-purple/20"
                >
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="w-14 h-14 rounded-xl bg-purple/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Robust Aggregation Methods</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                FinAlliance employs two key aggregation strategies to ensure the integrity of the federated model:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-purple/5 border border-purple/10">
                                    <h4 className="font-semibold text-purple-light text-sm mb-1">Trimmed Mean Aggregation</h4>
                                    <p className="text-xs text-slate-400">Removes extreme values before averaging, eliminating the influence of outlier model updates.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-purple/5 border border-purple/10">
                                    <h4 className="font-semibold text-purple-light text-sm mb-1">Median Aggregation</h4>
                                    <p className="text-xs text-slate-400">Uses the median of updates instead of mean, providing stronger resistance to Byzantine failures.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
