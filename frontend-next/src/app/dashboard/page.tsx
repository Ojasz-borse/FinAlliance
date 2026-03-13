'use client';

import { useEffect, useState } from 'react';
import TransactionTable from '../../components/TransactionTable';
import FederatedPanel from '../../components/FederatedPanel';
import { transactionService } from '../../services/transactionService';
import { fraudService } from '../../services/fraudService';
import { Transaction } from '../../types/fraud';
import { useToast } from '../../components/Toast';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [highRiskAlerts, setHighRiskAlerts] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Using Promise.allSettled to handle partial failures gracefully if backend endpoints are missing
                const [txRes, alertsRes] = await Promise.allSettled([
                    transactionService.getAllTransactions(),
                    fraudService.getHighRiskAlerts()
                ]);

                if (txRes.status === 'fulfilled') {
                    setTransactions(txRes.value);
                } else {
                    console.error('Failed to fetch transactions', txRes.reason);
                }

                if (alertsRes.status === 'fulfilled') {
                    setHighRiskAlerts(alertsRes.value);
                } else {
                    console.error('Failed to fetch high risk alerts', alertsRes.reason);
                }

            } catch (err) {
                showToast('Failed to load dashboard data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showToast]);

    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const avgRisk = transactions.length > 0
        ? transactions.reduce((sum, tx) => sum + (tx.fraud_score || 0), 0) / transactions.length
        : 0;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                    Global Intelligence Dashboard
                </h1>
                <p className="text-slate-400">Monitor cross-bank activities and federated learning status.</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-navy-950/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Total Transactions</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">{transactions.length}</h3>
                        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 rounded">+12%</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-navy-950/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
                    <p className="text-sm font-medium text-slate-400 mb-1">High Risk Alerts</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-red-400">{highRiskAlerts.length}</h3>
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 rounded">Requires Review</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-navy-950/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Average Risk Score</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-emerald-400">{(avgRisk * 100).toFixed(1)}%</h3>
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 rounded">Healthy</span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                            <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">View All →</button>
                        </div>
                        <TransactionTable transactions={transactions} isLoading={loading} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                High Risk Alerts
                            </h2>
                        </div>
                        <TransactionTable transactions={highRiskAlerts} isLoading={loading} />
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <FederatedPanel />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-navy-950/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Network Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Connected Nodes</span>
                                <span className="text-sm font-medium text-white">4 Active</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Global Model Version</span>
                                <span className="text-sm font-mono text-cyan-400">v1.4.2</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Last Aggregation</span>
                                <span className="text-sm text-slate-300">2 hours ago</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
