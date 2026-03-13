'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FraudForm from '../../components/FraudForm';
import FraudResultCard from '../../components/FraudResultCard';
import { FraudPredictionResponse } from '../../types/fraud';

export default function FraudCheckPage() {
    const [result, setResult] = useState<FraudPredictionResponse | null>(null);

    const handlePredict = (data: FraudPredictionResponse) => {
        setResult(data);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan to-purple mb-4">
                        Fraud Risk Assessment
                    </h1>
                    <p className="text-lg text-slate-400">
                        Analyze a transaction against the FinAlliance federated intelligence network in real-time.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-navy-950/40 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/50"
                    >
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Transaction Details
                        </h2>
                        <FraudForm onPredict={handlePredict} />
                    </motion.div>

                    {/* Results Section */}
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 opacity-0 md:opacity-100 hidden md:flex">
                            Analysis Results
                        </h2>
                        <div className="flex-1 relative">
                            <AnimatePresence mode="wait">
                                {result ? (
                                    <FraudResultCard key="result" result={result} />
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full min-h-[300px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-navy-950/20 backdrop-blur-sm"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-navy-900 border border-white/5 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-300 mb-2">Awaiting Transaction</h3>
                                        <p className="text-sm text-slate-500">Provide transaction details on the left to securely assess fraud risk using the federated model.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
