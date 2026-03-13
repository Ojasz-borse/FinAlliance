'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const users = [
    {
        role: 'Fraud Risk Analysts',
        description: 'Investigate and assess fraud alerts, validate suspicious transactions, and provide feedback to improve detection accuracy.',
        icon: '🔍',
        tasks: ['Investigate flagged transactions', 'Validate fraud probability scores', 'Provide retraining feedback'],
        color: '#06b6d4',
    },
    {
        role: 'Fraud Detection Teams',
        description: 'Manage and operate real-time fraud detection pipelines, ensuring swift response to emerging fraud patterns.',
        icon: '🛡️',
        tasks: ['Monitor real-time alerts', 'Configure detection thresholds', 'Respond to fraud incidents'],
        color: '#3b82f6',
    },
    {
        role: 'Financial Institutions',
        description: 'Participate in the federated learning network to benefit from cross-bank intelligence while maintaining full data sovereignty.',
        icon: '🏦',
        tasks: ['Deploy local models', 'Share encrypted updates', 'Receive global model'],
        color: '#8b5cf6',
    },
    {
        role: 'Regulatory Monitoring Teams',
        description: 'Oversee compliance, audit fraud detection processes, and ensure the system meets regulatory requirements.',
        icon: '📋',
        tasks: ['Audit system decisions', 'Review bias reports', 'Ensure compliance'],
        color: '#10b981',
    },
];

export default function UsersSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="users" className="section-padding relative" ref={ref}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/40 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-cyan-light bg-cyan/10 rounded-full border border-cyan/20">
                        Target Users
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Who Uses{' '}
                        <span className="gradient-text">FinAlliance?</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Designed for the people who fight financial fraud every day — giving them
                        cross-institutional intelligence they&apos;ve never had before.
                    </p>
                </motion.div>

                {/* User Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {users.map((user, i) => (
                        <motion.div
                            key={user.role}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
                            className="glass rounded-2xl p-6 group hover:border-cyan/30 transition-all duration-500"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                    style={{ backgroundColor: user.color + '15' }}>
                                    {user.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-light transition-colors">
                                    {user.role}
                                </h3>
                            </div>

                            <p className="text-sm text-slate-400 leading-relaxed mb-4">{user.description}</p>

                            <div className="space-y-2">
                                {user.tasks.map((task) => (
                                    <div key={task} className="flex items-center gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: user.color }} />
                                        <span className="text-slate-300">{task}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Workflow Explanation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="glass rounded-2xl p-8 max-w-4xl mx-auto border border-cyan/10"
                >
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-3">How FinAlliance Changes the Workflow</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto mb-6">
                            Today, fraud analysts monitor transaction alerts but only see data within their own bank.
                            Suspicious patterns that span multiple institutions remain invisible.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-xs text-red-400 font-semibold mb-1">Without FinAlliance</p>
                                <p className="text-sm text-slate-400">Single-bank visibility only</p>
                            </div>

                            <svg className="w-6 h-6 text-slate-600 rotate-90 sm:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>

                            <div className="px-5 py-3 rounded-xl bg-emerald/10 border border-emerald/20">
                                <p className="text-xs text-emerald-light font-semibold mb-1">With FinAlliance</p>
                                <p className="text-sm text-slate-400">Cross-bank pattern detection</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
