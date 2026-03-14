'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import SectionParticles from './SectionParticles';

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
                setTimeout(() => { step = 0; }, 1000);
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
        <section id="demo" className="section-padding relative overflow-hidden" ref={ref}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />

            {/* Dynamic canvas particles */}
            <SectionParticles
                colors={['16, 185, 129', '6, 182, 212', '52, 211, 153']}
                count={40}
                speed={0.6}
                glowIntensity={0.85}
            />

            {/* Animated circuit lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent"
                    style={{ top: '25%', width: '150%', left: '-25%' }}
                    animate={{ x: ['-25%', '25%', '-25%'] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute h-px bg-gradient-to-r from-transparent via-cyan/25 to-transparent"
                    style={{ bottom: '25%', width: '150%', left: '-25%' }}
                    animate={{ x: ['25%', '-25%', '25%'] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
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
                        className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-emerald-light bg-emerald/10 rounded-full border border-emerald/20"
                    >
                        🚀 Live Demo
                    </motion.span>
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
                    className="relative"
                >
                    {/* Outer glow behind card */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan/[0.03] via-blue/[0.05] to-emerald/[0.03] rounded-3xl blur-2xl" />
                    
                    <div className="relative glass rounded-2xl p-6 sm:p-10 border border-cyan/10">
                        {/* Steps */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            {pipelineSteps.map((step, i) => (
                                <div key={step.label} className="relative">
                                    {/* Connector line */}
                                    {i < pipelineSteps.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 z-0 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    backgroundColor: activeStep >= i + 1 ? step.color + '60' : 'rgba(255,255,255,0.05)',
                                                    boxShadow: activeStep >= i + 1 ? `0 0 10px ${step.color}30` : 'none',
                                                }} />
                                            {/* Animated data pulse along connector */}
                                            {activeStep === i + 1 && (
                                                <motion.div
                                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-1 rounded-full"
                                                    style={{ backgroundColor: step.color, boxShadow: `0 0 8px ${step.color}` }}
                                                    initial={{ left: '-10%' }}
                                                    animate={{ left: '110%' }}
                                                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                                                />
                                            )}
                                        </div>
                                    )}

                                    <motion.div
                                        animate={{
                                            scale: activeStep === i ? 1.05 : 1,
                                            borderColor: activeStep === i ? step.color + '60' : activeStep > i ? step.color + '30' : 'rgba(255,255,255,0.05)',
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={`relative z-10 flex flex-col items-center p-4 rounded-xl border transition-all duration-500 cursor-pointer ${activeStep >= i ? 'bg-white/5' : 'bg-transparent'
                                            }`}
                                        onClick={() => setActiveStep(i)}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {/* Active pulse ring */}
                                        {activeStep === i && (
                                            <motion.div
                                                className="absolute inset-0 rounded-xl border"
                                                style={{ borderColor: step.color + '40' }}
                                                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                        )}
                                        
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3 transition-all duration-500 ${activeStep >= i ? 'scale-110' : 'opacity-40'
                                            }`}
                                            style={{
                                                backgroundColor: activeStep >= i ? step.color + '20' : 'rgba(255,255,255,0.03)',
                                                boxShadow: activeStep === i ? `0 0 30px ${step.color}40, 0 0 60px ${step.color}15` : 'none',
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
                        <div className="min-h-[120px] flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {activeStep >= 0 && activeStep < pipelineSteps.length ? (
                                    <motion.div
                                        key={activeStep}
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.35 }}
                                        className="text-center max-w-lg"
                                    >
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <motion.div 
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: pipelineSteps[activeStep].color, boxShadow: `0 0 8px ${pipelineSteps[activeStep].color}` }}
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                            <h4 className="text-lg font-bold text-white">{pipelineSteps[activeStep].label}</h4>
                                        </div>
                                        <p className="text-sm text-slate-400 mb-2">{pipelineSteps[activeStep].description}</p>
                                        <p className="text-xs font-mono px-4 py-2.5 rounded-lg bg-navy-800/80 text-slate-300 border border-white/5 backdrop-blur-sm">
                                            {pipelineSteps[activeStep].detail}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-slate-500 text-sm"
                                    >
                                        Click a step or wait for the animation to start...
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center mt-6">
                            <motion.button
                                onClick={handleReplay}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)' }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan to-blue text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan/20 transition-all duration-300"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
                                </svg>
                                Replay Flow
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
