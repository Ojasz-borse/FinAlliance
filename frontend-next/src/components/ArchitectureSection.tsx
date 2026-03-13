'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const components = [
    {
        title: 'Bank Nodes',
        description: 'Multiple financial institutions participate as nodes, each processing their own transaction data independently.',
        icon: '🏦',
        color: '#06b6d4',
    },
    {
        title: 'Local Fraud Models',
        description: 'Each bank trains ML models (Gradient Boosting, Random Forest) on their local transaction data.',
        icon: '🧠',
        color: '#3b82f6',
    },
    {
        title: 'Encrypted Model Updates',
        description: 'Model gradients and weights are encrypted before transmission — no raw data is ever shared.',
        icon: '🔐',
        color: '#8b5cf6',
    },
    {
        title: 'Federated Aggregation Server',
        description: 'Central server aggregates model updates using robust methods (Trimmed Mean, Median) to build global intelligence.',
        icon: '⚡',
        color: '#10b981',
    },
    {
        title: 'Global Model Distribution',
        description: 'The improved global model is securely distributed back to each participating bank for enhanced detection.',
        icon: '🌐',
        color: '#06b6d4',
    },
    {
        title: 'Fraud Detection Pipeline',
        description: 'Real-time scoring of transactions using the federated model, generating fraud probability scores with explanations.',
        icon: '🛡️',
        color: '#3b82f6',
    },
];

export default function ArchitectureSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="architecture" className="section-padding relative" ref={ref}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/30 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-cyan-light bg-cyan/10 rounded-full border border-cyan/20">
                        System Design
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        System{' '}
                        <span className="gradient-text">Architecture</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        A privacy-preserving federated learning architecture that enables cross-bank
                        fraud detection without compromising data security.
                    </p>
                </motion.div>

                {/* Architecture Diagram */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="glass rounded-2xl p-4 sm:p-8 border border-cyan/10 max-w-4xl mx-auto">
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-navy-950">
                            <Image
                                src="/images/architecture.png"
                                alt="FinAlliance System Architecture Diagram"
                                fill
                                className="object-contain"
                                priority
                            />
                            {/* Animated glow overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {/* Component Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {components.map((comp, i) => (
                        <motion.div
                            key={comp.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                            className="glass rounded-2xl p-6 group hover:border-cyan/30 transition-all duration-500"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                    style={{ backgroundColor: comp.color + '15' }}>
                                    {comp.icon}
                                </div>
                                <div className="w-px h-8 opacity-20"
                                    style={{ backgroundColor: comp.color }} />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-light transition-colors">
                                {comp.title}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{comp.description}</p>

                            {/* Bottom accent line */}
                            <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                                style={{ backgroundColor: comp.color + '40' }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
