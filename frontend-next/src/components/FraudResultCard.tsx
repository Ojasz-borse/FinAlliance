'use client';

import { motion } from 'framer-motion';
import { FraudPredictionResponse } from '../types/fraud';

interface FraudResultCardProps {
    result: FraudPredictionResponse;
}

export default function FraudResultCard({ result }: FraudResultCardProps) {
    const { fraud_probability, risk_level } = result;

    // Determine color based on risk level
    const isHighRisk = risk_level === 'HIGH';
    const isMediumRisk = risk_level === 'MEDIUM';
    const isLowRisk = risk_level === 'LOW';

    const colorClasses = {
        bg: isHighRisk ? 'bg-red-500/20' : isMediumRisk ? 'bg-yellow-500/20' : 'bg-emerald-500/20',
        border: isHighRisk ? 'border-red-500/30' : isMediumRisk ? 'border-yellow-500/30' : 'border-emerald-500/30',
        text: isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-yellow-400' : 'text-emerald-400',
        progress: isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-yellow-500' : 'bg-emerald-500',
    };

    const percent = Math.round(fraud_probability * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border backdrop-blur-xl ${colorClasses.bg} ${colorClasses.border}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Analysis Result</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colorClasses.text} ${colorClasses.border} bg-navy-950/50`}>
                    {risk_level} RISK
                </span>
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-300">Fraud Probability</span>
                    <span className={`text-3xl font-bold ${colorClasses.text}`}>
                        {percent}%
                    </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="h-3 w-full bg-navy-950/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${colorClasses.progress}`}
                    />
                </div>
            </div>

            <div className="text-sm text-slate-300 bg-navy-950/30 p-4 rounded-xl border border-white/5">
                {isHighRisk && "This transaction exhibits strong indicators of fraudulent activity consistent with known cross-bank fraud patterns."}
                {isMediumRisk && "This transaction shows some unusual patterns. Manual review is recommended before clearing."}
                {isLowRisk && "This transaction appears legitimate based on current federated intelligence."}
            </div>
        </motion.div>
    );
}
