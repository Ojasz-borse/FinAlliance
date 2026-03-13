'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const barriers = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: 'Privacy Regulations',
        description: 'GDPR, CCPA, and banking regulations strictly prohibit sharing raw customer transaction data between institutions.',
        color: 'from-cyan to-blue',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
        title: 'Customer Confidentiality',
        description: 'Banks have fiduciary duties to protect customer information. Sharing data would breach trust and legal obligations.',
        color: 'from-blue to-purple',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
        ),
        title: 'Regulatory Compliance',
        description: 'Cross-institutional data sharing requires complex regulatory approvals that can take years to establish.',
        color: 'from-purple to-cyan',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
        ),
        title: 'Competitive Restrictions',
        description: 'Banks are competitive entities. Sharing fraud intelligence could reveal business strategies and customer patterns.',
        color: 'from-emerald to-cyan',
    },
];

const fraudTypes = [
    { label: 'Credit Card Fraud', icon: '💳' },
    { label: 'Mule Accounts', icon: '🏦' },
    { label: 'Identity Theft', icon: '🪪' },
    { label: 'Money Laundering', icon: '💰' },
];

export default function ProblemSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="problem" className="section-padding relative" ref={ref}>
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
                        The Challenge
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        The Cross-Bank Fraud{' '}
                        <span className="gradient-text">Detection Problem</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Financial institutions face increasingly sophisticated fraud patterns that span
                        across multiple banks — yet they cannot share the data needed to detect them.
                    </p>
                </motion.div>

                {/* Fraud Types */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    {fraudTypes.map((type, i) => (
                        <motion.div
                            key={type.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/5 hover:border-cyan/30 transition-all duration-300"
                        >
                            <span className="text-xl">{type.icon}</span>
                            <span className="text-sm font-medium text-slate-300">{type.label}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scenario */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="glass rounded-2xl p-8 mb-16 max-w-4xl mx-auto border border-cyan/10"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Real-World Fraud Scenario</h3>
                            <p className="text-slate-400 leading-relaxed">
                                A fraudster opens accounts in <span className="text-cyan-light font-medium">multiple banks</span> and
                                performs small suspicious transactions across them. Individually, each bank sees only
                                partial activity and the transactions appear normal. But{' '}
                                <span className="text-cyan-light font-medium">across all banks</span>, the pattern
                                clearly indicates coordinated fraud. The challenge? Banks{' '}
                                <span className="text-red-400 font-medium">cannot share transaction data</span> to
                                connect these dots.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Barrier Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {barriers.map((barrier, i) => (
                        <motion.div
                            key={barrier.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                            className="group glass rounded-2xl p-6 hover:border-cyan/30 transition-all duration-500 cursor-default"
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${barrier.color} bg-opacity-10 flex items-center justify-center mb-4 text-white/80 group-hover:scale-110 transition-transform duration-300`}
                                style={{ background: `linear-gradient(135deg, ${barrier.color === 'from-cyan to-blue' ? 'rgba(6,182,212,0.15), rgba(59,130,246,0.15)' : barrier.color === 'from-blue to-purple' ? 'rgba(59,130,246,0.15), rgba(139,92,246,0.15)' : barrier.color === 'from-purple to-cyan' ? 'rgba(139,92,246,0.15), rgba(6,182,212,0.15)' : 'rgba(16,185,129,0.15), rgba(6,182,212,0.15)'})` }}>
                                {barrier.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{barrier.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{barrier.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
