'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Database, Server, Smartphone, Lock, ShieldCheck, Activity } from 'lucide-react';

const steps = [
    {
        icon: <Database className="w-6 h-6" />,
        title: "1. Local Training",
        description: "Instead of sending your transactions to a centralized server, the fraud detection model is downloaded to your institution's local servers."
    },
    {
        icon: <Lock className="w-6 h-6" />,
        title: "2. Privacy-Preserving Updates",
        description: "The model learns from your sensitive transaction data locally. Only the model's learned insights (weight updates) leave your network, never the actual data."
    },
    {
        icon: <Server className="w-6 h-6" />,
        title: "3. Secure Aggregation",
        description: "Our robust central server securely aggregates these updates from hundreds of financial institutions using advanced differential privacy."
    },
    {
        icon: <Activity className="w-6 h-6" />,
        title: "4. Global Intelligence",
        description: "A smarter, globally-aware fraud model is continuously distributed back to all participants, protecting everyone from emerging threats."
    }
];

export default function ArchitectureSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="architecture" className="py-24 relative overflow-hidden" ref={ref}>
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-cyan-light bg-cyan/10 rounded-full border border-cyan/20">
                        System Design
                    </span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        How FedFortress <span className="gradient-text">Works</span>
                    </motion.h2>
                    <p className="text-slate-400 text-lg">
                        Our decentralized architecture keeps your sensitive financial data on your local devices while collectively training a powerful global fraud detection model.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Steps */}
                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-6 items-start"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-900/40 to-blue-900/40 flex items-center justify-center border border-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-light">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right side - Visual Representation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden glass border border-cyan/10 p-8 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
                            {/* Diagram Background effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 z-0" />
                            
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-8">
                                <div className="p-4 rounded-xl bg-navy-800 text-center border border-cyan/30 shadow-lg w-48">
                                    <Server className="w-12 h-12 mx-auto text-cyan-light mb-2" />
                                    <h4 className="font-bold text-white">Global Server</h4>
                                    <p className="text-xs text-slate-400">Aggregates updates</p>
                                </div>

                                <div className="flex gap-4 items-center justify-center w-full">
                                    <div className="w-px h-8 bg-gradient-to-b from-cyan/50 to-transparent"></div>
                                </div>

                                <div className="flex justify-around w-full gap-4">
                                    <div className="p-3 rounded-lg bg-navy-800 text-center border border-navy-700 flex-1">
                                        <Database className="w-8 h-8 mx-auto text-blue-400 mb-1" />
                                        <p className="text-xs font-semibold text-slate-300">Bank Data A</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-navy-800 text-center border border-navy-700 flex-1">
                                        <Lock className="w-8 h-8 mx-auto text-purple-400 mb-1" />
                                        <p className="text-xs font-semibold text-slate-300">Local Train</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-navy-800 text-center border border-navy-700 flex-1">
                                        <ShieldCheck className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
                                        <p className="text-xs font-semibold text-slate-300">Secure Comm</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating achievement/stat card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-6 -left-6 glass p-4 rounded-xl border border-cyan/20 shadow-xl flex items-center gap-4 z-20"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Zero Data Exposure</p>
                                <p className="text-xs text-slate-400">100% Privacy Preserved</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
