'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ClassCard from '@/components/ClassCard';
import TrainingPanel, { TrainConfig } from '@/components/TrainingPanel';
import PredictionPreview from '@/components/PredictionPreview';
import api from '@/lib/api';

interface Sample {
    amount: number;
    merchant_category: string;
    location: string;
    timestamp: string;
}

interface PredictionResult {
    probabilities: Record<string, number>;
    predicted_class: string;
    risk_level: string;
}

const CLASS_COLORS = ['bg-emerald-500', 'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'];

export default function ModelTrainerPage() {
    const [classes, setClasses] = useState<Record<string, Sample[]>>({
        Legitimate: [],
        Fraudulent: [],
    });
    const [accuracy, setAccuracy] = useState(0);
    const [status, setStatus] = useState('IDLE');
    const [isTraining, setIsTraining] = useState(false);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [newClassName, setNewClassName] = useState('');

    const handleAddSamples = useCallback(async (className: string, samples: Sample[]) => {
        try {
            await api.post('/trainer/add-samples', {
                class_name: className,
                samples,
            });
            setClasses(prev => ({
                ...prev,
                [className]: [...(prev[className] || []), ...samples],
            }));
        } catch (err) {
            console.error('Failed to add samples:', err);
        }
    }, []);

    const handleGenerateSamples = useCallback(async (className: string) => {
        try {
            const res = await api.post(`/trainer/generate-samples?class_name=${encodeURIComponent(className)}&count=20`);
            const generated: Sample[] = res.data.samples || [];
            setClasses(prev => ({
                ...prev,
                [className]: [...(prev[className] || []), ...generated],
            }));
        } catch (err) {
            console.error('Failed to generate samples:', err);
        }
    }, []);

    const handleTrain = useCallback(async (config: TrainConfig) => {
        setIsTraining(true);
        try {
            const res = await api.post('/trainer/train', config);
            if (res.data.error) {
                alert(res.data.error);
            } else {
                setAccuracy(res.data.accuracy);
                setStatus('TRAINED');
            }
        } catch (err: any) {
            console.error('Training failed:', err);
            alert(err?.response?.data?.error || 'Training failed');
        } finally {
            setIsTraining(false);
        }
    }, []);

    const handlePredict = useCallback(async (data: { amount: number; merchant_category: string; location: string; timestamp: string }) => {
        setIsPredicting(true);
        try {
            const res = await api.post('/trainer/predict', data);
            if (res.data.error) {
                alert(res.data.error);
            } else {
                setPrediction(res.data);
            }
        } catch (err) {
            console.error('Prediction failed:', err);
        } finally {
            setIsPredicting(false);
        }
    }, []);

    const handleReset = useCallback(async () => {
        try {
            await api.post('/trainer/reset');
            setClasses({ Legitimate: [], Fraudulent: [] });
            setAccuracy(0);
            setStatus('IDLE');
            setPrediction(null);
        } catch (err) {
            console.error('Reset failed:', err);
        }
    }, []);

    const handleAddClass = () => {
        const name = newClassName.trim();
        if (!name || classes[name]) return;
        setClasses(prev => ({ ...prev, [name]: [] }));
        api.post('/trainer/add-class', { class_name: name }).catch(() => { });
        setNewClassName('');
    };

    return (
        <div className="min-h-screen bg-[#0a0b14] pt-24 pb-12 px-4">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Fraud Model Trainer
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Train a custom fraud detection model — add samples, configure, and predict in real-time
                    </p>
                </motion.div>
            </div>

            {/* 3-Panel Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px_320px] gap-6">
                {/* LEFT — Classes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Transaction Classes
                        </h2>
                    </div>

                    {Object.entries(classes).map(([name, samples], idx) => (
                        <ClassCard
                            key={name}
                            name={name}
                            samples={samples}
                            onAddSamples={handleAddSamples}
                            onGenerateSamples={handleGenerateSamples}
                            color={CLASS_COLORS[idx % CLASS_COLORS.length]}
                        />
                    ))}

                    {/* Add Class */}
                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            placeholder="New class name..."
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
                            className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-dashed border-white/15 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/40"
                        />
                        <button
                            onClick={handleAddClass}
                            className="px-4 py-2.5 bg-white/5 border border-dashed border-white/15 rounded-xl text-slate-400 hover:text-white hover:border-blue-500/40 transition-all text-sm"
                        >
                            + Add Class
                        </button>
                    </div>
                </div>

                {/* CENTER — Training */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5">
                    <TrainingPanel
                        onTrain={handleTrain}
                        onReset={handleReset}
                        accuracy={accuracy}
                        status={status}
                        isTraining={isTraining}
                    />
                </div>

                {/* RIGHT — Preview */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5">
                    <PredictionPreview
                        onPredict={handlePredict}
                        result={prediction}
                        isLoading={isPredicting}
                        modelReady={status === 'TRAINED'}
                    />
                </div>
            </div>
        </div>
    );
}
