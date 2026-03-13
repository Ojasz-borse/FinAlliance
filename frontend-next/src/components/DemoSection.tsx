'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const pipelineSteps = [
    {
        label: 'Transaction',
        description: 'Incoming financial transaction',
        icon: '💳',
        color: '#06b6d4',
        detail: 'Amount: $2,547.00 | Merchant: Online Electronics | Time: 02:34 AM',
    },
    {
        label: 'Local Bank Model',
        description: 'Bank\'s local fraud model analyzes',
        icon: '🧠',
        color: '#3b82f6',
        detail: 'Running Gradient Boosting + Random Forest ensemble on local features',
    },
    {
        label: 'Encrypted Update',
        description: 'Model gradients encrypted',
        icon: '🔐',
        color: '#8b5cf6',
        detail: 'AES-256 encrypted model parameters shared via secure channel',
    },
    {
        label: 'Federated Server',
        description: 'Aggregation of all bank updates',
        icon: '⚡',
        color: '#10b981',
        detail: 'Trimmed Mean Aggregation across 12 participating institutions',
    },
    {
        label: 'Global Model',
        description: 'Improved model distributed',
        icon: '🌐',
        color: '#06b6d4',
        detail: 'Global model v2.4.1 — incorporating cross-bank fraud patterns',
    },
    {
        label: 'Fraud Score',
        description: 'Transaction scored',
        icon: '🛡️',
        color: '#ef4444',
        detail: 'Fraud Probability: 94.7% — High Risk | Reason: Cross-bank pattern match',
    },
];

export default function DemoSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [activeStep, setActiveStep] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!isInView) return;

        // Auto-start the animation after a short delay when in view
        const timeout = setTimeout(() => {
            setIsPlaying(true);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isInView]);

    useEffect(() => {
        if (!isPlaying) return;

        setActiveStep(-1);
        let step = 0;

        const interval = setInterval(() => {
            if (step >= pipelineSteps.length) {
                step = 0;
                setActiveStep(-1);
                setTimeout(() => {
                    step = 0;
                }, 1000);
                return;
            }
            setActiveStep(step);
            step++;
        }, 1200);

        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleReplay = () => {
        setIsPlaying(false);
        setActiveStep(-1);
        setTimeout(() => setIsPlaying(true), 100);
    };

    return (
        <section id="demo" className="section-padding relative" ref={ref}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/50 to-transparent" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-cyan-light bg-cyan/10 rounded-full border border-cyan/20">
                        Live Demo
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Prototype{' '}
                        <span className="gradient-text">Workflow</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Watch how a transaction flows through the FinAlliance federated learning
                        pipeline in real-time.
                    </p>
                </motion.div>

                {/* Pipeline Flow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="glass rounded-2xl p-6 sm:p-10 border border-cyan/10"
                >
                    {/* Steps */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        {pipelineSteps.map((step, i) => (
                            <div key={step.label} className="relative">
                                {/* Connector line */}
                                {i < pipelineSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 z-0">
                                        <div className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                backgroundColor: activeStep >= i + 1 ? step.color + '60' : 'rgba(255,255,255,0.05)',
                                                boxShadow: activeStep >= i + 1 ? `0 0 10px ${step.color}30` : 'none',
                                            }} />
                                    </div>
                                )}

                                <motion.div
                                    animate={{
                                        scale: activeStep === i ? 1.05 : 1,
                                        borderColor: activeStep === i ? step.color + '60' : 'rgba(255,255,255,0.05)',
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`relative z-10 flex flex-col items-center p-4 rounded-xl border transition-all duration-500 cursor-pointer ${activeStep >= i ? 'bg-white/5' : 'bg-transparent'
                                        }`}
                                    onClick={() => setActiveStep(i)}
                                >
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3 transition-all duration-500 ${activeStep >= i ? 'scale-110' : 'opacity-50'
                                        }`}
                                        style={{
                                            backgroundColor: activeStep >= i ? step.color + '20' : 'rgba(255,255,255,0.03)',
                                            boxShadow: activeStep === i ? `0 0 30px ${step.color}30` : 'none',
                                        }}>
                                        {step.icon}
                                    </div>
                                    <p className={`text-xs font-semibold text-center transition-colors duration-300 ${activeStep >= i ? 'text-white' : 'text-slate-600'
                                        }`}>
                                        {step.label}
                                    </p>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    {/* Active Step Detail */}
                    <div className="min-h-[100px] flex items-center justify-center">
                        {activeStep >= 0 && activeStep < pipelineSteps.length ? (
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center max-w-lg"
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full animate-pulse"
                                        style={{ backgroundColor: pipelineSteps[activeStep].color }} />
                                    <h4 className="text-lg font-bold text-white">{pipelineSteps[activeStep].label}</h4>
                                </div>
                                <p className="text-sm text-slate-400 mb-2">{pipelineSteps[activeStep].description}</p>
                                <p className="text-xs font-mono px-4 py-2 rounded-lg bg-navy-800 text-slate-300 border border-white/5">
                                    {pipelineSteps[activeStep].detail}
                                </p>
                            </motion.div>
                        ) : (
                            <p className="text-slate-600 text-sm">Click a step or wait for the animation to start...</p>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleReplay}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan to-blue text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan/20 transition-all duration-300 hover:scale-105"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
                            </svg>
                            Replay Flow
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
