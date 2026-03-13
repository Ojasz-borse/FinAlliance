'use client';

import { useState } from 'react';
import { useFraudPrediction } from '../hooks/useFraudPrediction';
import { useToast } from './Toast';

interface FraudFormProps {
    onPredict: (data: any) => void;
}

export default function FraudForm({ onPredict }: FraudFormProps) {
    const { predict, loading } = useFraudPrediction();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        amount: '',
        merchant_category: 'electronics',
        location: '',
        timestamp: new Date().toISOString().slice(0, 16),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.location) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const payload = {
                bank_id: 'BANK_A', // Hardcoded for demo purposes
                amount: parseFloat(formData.amount),
                merchant_category: formData.merchant_category,
                location: formData.location,
                timestamp: new Date(formData.timestamp).toISOString(),
            };

            const result = await predict(payload);
            onPredict(result);
            showToast('Transaction analysis complete.', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Failed to analyze transaction', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Transaction Amount ($)
                    </label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="e.g. 25000"
                        className="w-full bg-navy-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
                        required
                        step="0.01"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Merchant Category
                    </label>
                    <select
                        name="merchant_category"
                        value={formData.merchant_category}
                        onChange={handleChange}
                        className="w-full bg-navy-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all appearance-none"
                    >
                        <option value="electronics">Electronics</option>
                        <option value="retail">Retail</option>
                        <option value="travel">Travel</option>
                        <option value="dining">Dining</option>
                        <option value="crypto">Cryptocurrency</option>
                        <option value="transfer">Wire Transfer</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai"
                        className="w-full bg-navy-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Timestamp
                    </label>
                    <input
                        type="datetime-local"
                        name="timestamp"
                        value={formData.timestamp}
                        onChange={handleChange}
                        className="w-full bg-navy-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all [color-scheme:dark]"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-cyan to-blue text-white font-medium hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Analyze Transaction
                    </>
                )}
            </button>
        </form>
    );
}
