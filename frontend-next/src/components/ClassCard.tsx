'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sample {
    amount: number;
    merchant_category: string;
    location: string;
    timestamp: string;
}

interface ClassCardProps {
    name: string;
    samples: Sample[];
    onAddSamples: (className: string, samples: Sample[]) => void;
    onGenerateSamples: (className: string) => void;
    color: string;
}

const MERCHANTS = ['electronics', 'retail', 'travel', 'dining', 'crypto', 'transfer', 'groceries', 'entertainment', 'healthcare', 'utilities'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'New York', 'London', 'Singapore', 'Dubai', 'Shanghai'];

export default function ClassCard({ name, samples, onAddSamples, onGenerateSamples, color }: ClassCardProps) {
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('electronics');
    const [location, setLocation] = useState('Mumbai');

    const handleAdd = () => {
        if (!amount) return;
        const now = new Date().toISOString().slice(0, 19);
        onAddSamples(name, [{
            amount: parseFloat(amount),
            merchant_category: merchant,
            location: location,
            timestamp: now,
        }]);
        setAmount('');
        setShowForm(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 mb-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${color}`} />
                    <h3 className="text-lg font-semibold text-white">{name}</h3>
                </div>
                <span className="text-sm text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                    {samples.length} samples
                </span>
            </div>

            {/* Sample Preview */}
            {samples.length > 0 && (
                <div className="mb-3 flex gap-2 flex-wrap">
                    {samples.slice(-4).map((s, i) => (
                        <div
                            key={i}
                            className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300"
                        >
                            <span className="text-white font-mono">${s.amount.toLocaleString()}</span>
                            <span className="text-slate-500 ml-1">· {s.merchant_category}</span>
                        </div>
                    ))}
                    {samples.length > 4 && (
                        <div className="text-xs bg-white/5 rounded-lg px-3 py-2 text-slate-500 flex items-center">
                            +{samples.length - 4} more
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add
                </button>
                <button
                    onClick={() => onGenerateSamples(name)}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Generate
                </button>
            </div>

            {/* Add Sample Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                            <input
                                type="number"
                                placeholder="Amount ($)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                            />
                            <select
                                value={merchant}
                                onChange={(e) => setMerchant(e.target.value)}
                                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                            >
                                {MERCHANTS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                            >
                                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <button
                                onClick={handleAdd}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Add Sample
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
