'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TrainingPanelProps {
    onTrain: (config: TrainConfig) => void;
    onReset: () => void;
    accuracy: number;
    status: string;
    isTraining: boolean;
}

export interface TrainConfig {
    model_type: string;
    n_estimators: number;
    max_depth: number;
    learning_rate: number;
}

export default function TrainingPanel({ onTrain, onReset, accuracy, status, isTraining }: TrainingPanelProps) {
    const [modelType, setModelType] = useState('gradient_boosting');
    const [estimators, setEstimators] = useState(100);
    const [maxDepth, setMaxDepth] = useState(5);
    const [learningRate, setLearningRate] = useState(0.1);
    const [showAdvanced, setShowAdvanced] = useState(true);

    const handleTrain = () => {
        onTrain({
            model_type: modelType,
            n_estimators: estimators,
            max_depth: maxDepth,
            learning_rate: learningRate,
        });
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
                Training
            </h2>

            {/* Train Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTrain}
                disabled={isTraining}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all mb-6 ${isTraining
                    ? 'bg-blue-600/50 cursor-wait'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20'
                    }`}
            >
                {isTraining ? (
                    <span className="flex items-center justify-center gap-2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Training Model...
                    </span>
                ) : status === 'TRAINED' ? (
                    'Retrain Model'
                ) : (
                    'Train Model'
                )}
            </motion.button>

            {/* Accuracy Display */}
            {status === 'TRAINED' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                >
                    <div className="text-sm text-emerald-400 mb-1">Model Accuracy</div>
                    <div className="text-3xl font-bold text-white">{(accuracy * 100).toFixed(1)}%</div>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${accuracy * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                        />
                    </div>
                </motion.div>
            )}

            {/* Advanced Settings */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-sm text-slate-400 hover:text-white transition-colors mb-4"
            >
                <span className="font-medium">Advanced</span>
                <motion.svg
                    animate={{ rotate: showAdvanced ? 180 : 0 }}
                    className="w-4 h-4"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            {showAdvanced && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5 flex-1"
                >
                    {/* Model Type */}
                    <div>
                        <label className="text-sm text-slate-400 mb-2 block">Model Type</label>
                        <select
                            value={modelType}
                            onChange={(e) => setModelType(e.target.value)}
                            className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                        >
                            <option value="gradient_boosting">Gradient Boosting</option>
                            <option value="random_forest">Random Forest</option>
                        </select>
                    </div>

                    {/* Estimators */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-slate-400">Estimators</label>
                            <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{estimators}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="500"
                            step="10"
                            value={estimators}
                            onChange={(e) => setEstimators(parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    {/* Max Depth */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-slate-400">Max Depth</label>
                            <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{maxDepth}</span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={maxDepth}
                            onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    {/* Learning Rate */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-slate-400">Learning Rate</label>
                            <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{learningRate}</span>
                        </div>
                        <input
                            type="range"
                            min="0.001"
                            max="1"
                            step="0.001"
                            value={learningRate}
                            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>
                </motion.div>
            )}

            {/* Reset Button */}
            <button
                onClick={onReset}
                className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-red-400 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reset Defaults
            </button>
        </div>
    );
}
