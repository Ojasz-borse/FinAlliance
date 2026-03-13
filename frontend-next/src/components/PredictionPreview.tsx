'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PredictionResult {
    probabilities: Record<string, number>;
    predicted_class: string;
    risk_level: string;
}

interface PredictionPreviewProps {
    onPredict: (data: { amount: number; merchant_category: string; location: string; timestamp: string }) => void;
    result: PredictionResult | null;
    isLoading: boolean;
    modelReady: boolean;
}

const MERCHANTS = ['electronics', 'retail', 'travel', 'dining', 'crypto', 'transfer', 'groceries', 'entertainment', 'healthcare', 'utilities'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'New York', 'London', 'Singapore', 'Dubai', 'Shanghai'];

const CLASS_COLORS: Record<string, string> = {
    'Legitimate': '#22c55e',
    'Fraudulent': '#ef4444',
};

const RISK_COLORS: Record<string, string> = {
    LOW: '#22c55e',
    MEDIUM: '#eab308',
    HIGH: '#ef4444',
};

export default function PredictionPreview({ onPredict, result, isLoading, modelReady }: PredictionPreviewProps) {
    const [amount, setAmount] = useState('15000');
    const [merchant, setMerchant] = useState('crypto');
    const [location, setLocation] = useState('Shanghai');

    const handlePredict = () => {
        const now = new Date().toISOString().slice(0, 19);
        onPredict({
            amount: parseFloat(amount) || 0,
            merchant_category: merchant,
            location: location,
            timestamp: now,
        });
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Preview
            </h2>

            {/* Input Section */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-3">Test Transaction</label>
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Amount ($)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                    />
                    <select
                        value={merchant}
                        onChange={(e) => setMerchant(e.target.value)}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                        {MERCHANTS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePredict}
                    disabled={!modelReady || isLoading}
                    className={`w-full mt-4 py-2.5 rounded-xl font-medium text-sm transition-all ${modelReady
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-500 hover:to-pink-400 shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {isLoading ? 'Classifying...' : modelReady ? 'Classify Transaction' : 'Train Model First'}
                </motion.button>
            </div>

            {/* Output Section */}
            <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10">
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-4">Output</label>

                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {/* Risk Badge */}
                            <div className="text-center mb-4">
                                <span
                                    className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
                                    style={{
                                        color: RISK_COLORS[result.risk_level] || '#fff',
                                        backgroundColor: `${RISK_COLORS[result.risk_level]}20`,
                                        border: `1px solid ${RISK_COLORS[result.risk_level]}40`,
                                    }}
                                >
                                    {result.risk_level} RISK
                                </span>
                            </div>

                            {/* Probability Bars */}
                            {Object.entries(result.probabilities).map(([cls, prob]) => (
                                <div key={cls} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium" style={{ color: CLASS_COLORS[cls] || '#94a3b8' }}>
                                            {cls}
                                        </span>
                                        <span className="text-sm font-mono text-white">
                                            {(prob * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${prob * 100}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: CLASS_COLORS[cls] || '#6366f1' }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Predicted Class */}
                            <div className="mt-4 pt-4 border-t border-white/10 text-center">
                                <div className="text-xs text-slate-500 mb-1">Predicted Class</div>
                                <div className="text-lg font-bold" style={{ color: CLASS_COLORS[result.predicted_class] || '#fff' }}>
                                    {result.predicted_class}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-8 text-slate-500"
                        >
                            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            <p className="text-sm">Train a model and classify<br />a transaction to see results</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
