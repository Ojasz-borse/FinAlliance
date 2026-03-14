'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';

interface TrainingRound {
    round: number;
    accuracy: number;
    loss: number;
    anomaly_scores?: number[];
    local_accuracies?: number[];
    server_metrics?: {
        num_updates?: number;
        num_filtered?: number;
        confidence?: number;
    };
}

interface UpdateResult {
    status: string;
    bank_id: string;
    update_id: string;
    encrypted: boolean;
    size_bytes: number;
    layers_updated: number;
    timestamp: string;
    message: string;
}

interface LogEntry {
    time: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export default function FederatedPage() {
    const { showToast } = useToast();
    const [activeAction, setActiveAction] = useState<string | null>(null);

    // Train Local
    const [trainingRounds, setTrainingRounds] = useState<TrainingRound[]>([]);
    const [isTraining, setIsTraining] = useState(false);

    // Send Update
    const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null);
    const [selectedBank, setSelectedBank] = useState('BANK_ALPHA');

    // Aggregate
    const [aggregationRounds, setAggregationRounds] = useState<TrainingRound[]>([]);
    const [isAggregating, setIsAggregating] = useState(false);
    const [aggConfig, setAggConfig] = useState({
        aggregation: 'FedAvg',
        num_clients: 3,
        malicious_clients: 1,
        rounds: 3,
        attack_type: 'noise_injection',
        dp_enabled: false,
    });

    // Logs
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const addLog = (message: string, type: LogEntry['type'] = 'info') => {
        const entry: LogEntry = {
            time: new Date().toLocaleTimeString(),
            message,
            type,
        };
        setLogs(prev => [...prev, entry]);
        setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    // ── 1. Train Local Model ──
    const handleTrainLocal = async () => {
        setIsTraining(true);
        setTrainingRounds([]);
        setActiveAction('train');
        addLog('Starting local model training on bank data...', 'info');

        try {
            const response = await fetch('http://localhost:5000/api/train/baseline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ epochs: 3 }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No response stream');

            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.error) {
                                addLog(`Training error: ${data.error}`, 'error');
                                break;
                            }
                            if (data.done) {
                                addLog('Local training complete!', 'success');
                                break;
                            }
                            if (data.epoch !== undefined) {
                                const round: TrainingRound = {
                                    round: data.epoch,
                                    accuracy: data.accuracy || 0,
                                    loss: data.loss || 0,
                                };
                                setTrainingRounds(prev => [...prev, round]);
                                addLog(`Epoch ${data.epoch}: accuracy=${data.accuracy?.toFixed(2)}%, loss=${data.loss?.toFixed(4)}`, 'info');
                            }
                        } catch { /* skip malformed */ }
                    }
                }
            }
            showToast('Local model training complete', 'success');
        } catch (err: any) {
            addLog(`Training failed: ${err.message}`, 'error');
            showToast('Training failed — check console', 'error');
        } finally {
            setIsTraining(false);
        }
    };

    // ── 2. Send Update ──
    const handleSendUpdate = async () => {
        setActiveAction('update');
        addLog(`Encrypting model weights for ${selectedBank}...`, 'info');

        try {
            const res = await fetch('http://localhost:5000/api/federated/send-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bank_id: selectedBank }),
            });
            const data: UpdateResult = await res.json();
            setUpdateResult(data);
            addLog(`Update ${data.update_id} sent: ${data.size_bytes.toLocaleString()} bytes, ${data.layers_updated} layers encrypted`, 'success');
            showToast('Model update sent securely', 'success');
        } catch (err: any) {
            addLog(`Send update failed: ${err.message}`, 'error');
            showToast('Failed to send update', 'error');
        }
    };

    // ── 3. Aggregate Models ──
    const handleAggregate = async () => {
        setIsAggregating(true);
        setAggregationRounds([]);
        setActiveAction('aggregate');
        addLog(`Starting federated aggregation: ${aggConfig.aggregation}, ${aggConfig.num_clients} clients, ${aggConfig.malicious_clients} malicious...`, 'info');

        try {
            const response = await fetch('http://localhost:5000/api/train/federated', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...aggConfig,
                    max_samples: 2000,
                    local_epochs: 1,
                }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error('No response stream');

            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.error) {
                                addLog(`Aggregation error: ${data.error}`, 'error');
                                break;
                            }
                            if (data.done) {
                                addLog(`Federated training complete: ${data.total_rounds} rounds`, 'success');
                                break;
                            }
                            if (data.round !== undefined) {
                                setAggregationRounds(prev => [...prev, data as TrainingRound]);
                                const maliciousDetected = data.anomaly_scores ? 
                                    data.anomaly_scores.filter((s: number) => s > 5).length : 0;
                                addLog(
                                    `Round ${data.round}: accuracy=${data.accuracy}%, anomaly_scores=[${data.anomaly_scores?.map((s: number) => s.toFixed(2)).join(', ')}]${maliciousDetected > 0 ? ` ⚠ ${maliciousDetected} suspicious client(s)` : ''}`,
                                    maliciousDetected > 0 ? 'warning' : 'info'
                                );
                            }
                        } catch { /* skip malformed */ }
                    }
                }
            }
            showToast('Federated aggregation complete', 'success');
        } catch (err: any) {
            addLog(`Aggregation failed: ${err.message}`, 'error');
            showToast('Aggregation failed', 'error');
        } finally {
            setIsAggregating(false);
        }
    };

    // ── 4. Download Global Model ──
    const handleDownload = async () => {
        setActiveAction('download');
        addLog('Requesting global model from aggregation server...', 'info');

        try {
            const res = await fetch('http://localhost:5000/api/federated/download-model');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'global_model_finalliance.pt');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            addLog(`Global model downloaded: ${(blob.size / 1024).toFixed(1)} KB`, 'success');
            showToast('Global model downloaded', 'success');
        } catch (err: any) {
            addLog(`Download failed: ${err.message}`, 'error');
            showToast('Download failed', 'error');
        }
    };

    const logColors = {
        info: 'text-slate-400',
        success: 'text-emerald-400',
        warning: 'text-yellow-400',
        error: 'text-red-400',
    };

    return (
        <div className="min-h-screen bg-navy-950 pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        Federated Learning Console
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Manage the complete federated learning lifecycle — train locally, submit encrypted updates,
                        aggregate across banks, and download the global model.
                    </p>
                </motion.div>

                {/* 4 Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Train Local */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleTrainLocal}
                        disabled={isTraining || isAggregating}
                        className={`p-6 rounded-2xl border text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
                            activeAction === 'train'
                                ? 'border-blue-500/40 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/20'
                        }`}
                    >
                        <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Train Local Model</h3>
                        <p className="text-sm text-slate-400">Run training on internal bank data</p>
                        {isTraining && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-blue-300">
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                Training in progress...
                            </div>
                        )}
                    </motion.button>

                    {/* Send Update */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendUpdate}
                        disabled={isTraining || isAggregating}
                        className={`p-6 rounded-2xl border text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
                            activeAction === 'update'
                                ? 'border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/20'
                        }`}
                    >
                        <div className="p-3 bg-cyan-500/20 rounded-xl w-fit mb-4 group-hover:-translate-y-1 transition-transform">
                            <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Send Update</h3>
                        <p className="text-sm text-slate-400">Upload encrypted weights</p>
                    </motion.button>

                    {/* Aggregate */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAggregate}
                        disabled={isTraining || isAggregating}
                        className={`p-6 rounded-2xl border text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
                            activeAction === 'aggregate'
                                ? 'border-emerald-500/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/20'
                        }`}
                    >
                        <div className="p-3 bg-emerald-500/20 rounded-xl w-fit mb-4 group-hover:rotate-180 transition-transform duration-500">
                            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Aggregate Models</h3>
                        <p className="text-sm text-slate-400">Federated aggregation across banks</p>
                        {isAggregating && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                Aggregating...
                            </div>
                        )}
                    </motion.button>

                    {/* Download */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        disabled={isTraining || isAggregating}
                        className={`p-6 rounded-2xl border text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
                            activeAction === 'download'
                                ? 'border-purple-500/40 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/20'
                        }`}
                    >
                        <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4 group-hover:translate-y-1 transition-transform">
                            <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Download Model</h3>
                        <p className="text-sm text-slate-400">Get global shared weights</p>
                    </motion.button>
                </div>

                {/* Main content: Results + Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Results Panel (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Aggregation Config (shown when aggregate is active) */}
                        <AnimatePresence>
                            {activeAction === 'aggregate' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-navy-950/60 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4">Aggregation Configuration</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Method</label>
                                            <select
                                                value={aggConfig.aggregation}
                                                onChange={e => setAggConfig(p => ({ ...p, aggregation: e.target.value }))}
                                                className="w-full bg-navy-950/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                            >
                                                <option value="FedAvg">FedAvg</option>
                                                <option value="Trimmed Mean">Trimmed Mean</option>
                                                <option value="Median">Median</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Clients</label>
                                            <input type="number" min={2} max={10} value={aggConfig.num_clients}
                                                onChange={e => setAggConfig(p => ({ ...p, num_clients: +e.target.value }))}
                                                className="w-full bg-navy-950/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Malicious</label>
                                            <input type="number" min={0} max={5} value={aggConfig.malicious_clients}
                                                onChange={e => setAggConfig(p => ({ ...p, malicious_clients: +e.target.value }))}
                                                className="w-full bg-navy-950/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Rounds</label>
                                            <input type="number" min={1} max={5} value={aggConfig.rounds}
                                                onChange={e => setAggConfig(p => ({ ...p, rounds: +e.target.value }))}
                                                className="w-full bg-navy-950/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Attack Type</label>
                                            <select
                                                value={aggConfig.attack_type}
                                                onChange={e => setAggConfig(p => ({ ...p, attack_type: e.target.value }))}
                                                className="w-full bg-navy-950/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                            >
                                                <option value="noise_injection">Noise Injection</option>
                                                <option value="label_flipping">Label Flipping</option>
                                                <option value="weight_scaling">Weight Scaling</option>
                                                <option value="random_weights">Random Weights</option>
                                            </select>
                                        </div>
                                        <div className="flex items-end">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={aggConfig.dp_enabled}
                                                    onChange={e => setAggConfig(p => ({ ...p, dp_enabled: e.target.checked }))}
                                                    className="w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-cyan-500/50"
                                                />
                                                <span className="text-sm text-slate-300">Enable Differential Privacy</span>
                                            </label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Send Update Config */}
                        <AnimatePresence>
                            {activeAction === 'update' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-navy-950/60 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4">Select Bank</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {['BANK_ALPHA', 'BANK_BETA', 'BANK_GAMMA', 'BANK_DELTA'].map(bank => (
                                            <button
                                                key={bank}
                                                onClick={() => setSelectedBank(bank)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    selectedBank === bank
                                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 border'
                                                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {bank}
                                            </button>
                                        ))}
                                    </div>
                                    {updateResult && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                                        >
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-slate-400 block text-xs">Update ID</span>
                                                    <span className="text-emerald-300 font-mono">{updateResult.update_id}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-xs">Size</span>
                                                    <span className="text-white">{(updateResult.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-xs">Layers</span>
                                                    <span className="text-white">{updateResult.layers_updated} layers</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-xs">Encrypted</span>
                                                    <span className="text-emerald-400">✓ AES-256</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Training Results Table */}
                        {(trainingRounds.length > 0 || aggregationRounds.length > 0) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-navy-950/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    {aggregationRounds.length > 0 ? 'Federated Training Results' : 'Local Training Results'}
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Round</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Accuracy</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Loss / Norm</th>
                                                {aggregationRounds.length > 0 && (
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Anomaly Scores</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(aggregationRounds.length > 0 ? aggregationRounds : trainingRounds).map((r, idx) => (
                                                <motion.tr
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="py-3 px-4 text-white font-mono">#{r.round}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 h-2 bg-navy-950/50 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-cyan to-blue rounded-full transition-all duration-500"
                                                                    style={{ width: `${Math.min(r.accuracy, 100)}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-cyan-300 font-medium">{r.accuracy}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-300 font-mono">{r.loss.toFixed(3)}</td>
                                                    {aggregationRounds.length > 0 && (
                                                        <td className="py-3 px-4">
                                                            <div className="flex gap-1">
                                                                {r.anomaly_scores?.map((score, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className={`px-2 py-0.5 rounded text-xs font-mono ${
                                                                            score > 5
                                                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                                                : 'bg-emerald-500/10 text-emerald-400'
                                                                        }`}
                                                                    >
                                                                        C{i}: {score.toFixed(2)}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    )}
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* Empty state */}
                        {trainingRounds.length === 0 && aggregationRounds.length === 0 && !updateResult && (
                            <div className="bg-navy-950/40 border border-white/5 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-slate-400 mb-2">No Operations Yet</h3>
                                <p className="text-sm text-slate-500">Click one of the actions above to start the federated learning workflow</p>
                            </div>
                        )}
                    </div>

                    {/* Activity Log (1/3) */}
                    <div className="bg-navy-950/60 border border-white/10 rounded-2xl p-4 backdrop-blur-xl h-[500px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Activity Log</h3>
                            {logs.length > 0 && (
                                <button
                                    onClick={() => setLogs([])}
                                    className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
                            {logs.length === 0 && (
                                <p className="text-slate-600 text-center mt-8">Waiting for activity...</p>
                            )}
                            {logs.map((log, i) => (
                                <div key={i} className={`flex gap-2 px-2 py-1 rounded hover:bg-white/5 ${logColors[log.type]}`}>
                                    <span className="text-slate-600 shrink-0">{log.time}</span>
                                    <span className="break-all">{log.message}</span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
