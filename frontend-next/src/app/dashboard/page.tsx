'use client';

import { useEffect, useState } from 'react';
import TransactionTable from '../../components/TransactionTable';
import Link from 'next/link';
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
                        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 rounded">Live Data</span>
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
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 rounded">{highRiskAlerts.length > 0 ? 'Action Required' : 'All Clear'}</span>
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
                        <span className={`text-xs px-2 rounded ${avgRisk < 0.3 ? 'text-emerald-400 bg-emerald-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>{avgRisk < 0.3 ? 'Healthy' : 'Elevated'}</span>
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
                        <Link href="/federated" className="block bg-navy-950/40 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl hover:border-purple-500/40 transition-all group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">FL Console</h2>
                                    <p className="text-xs text-slate-400">Train, aggregate & manage models</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-500 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                            <p className="text-sm text-slate-400">Open the Federated Learning Console to train models, send encrypted updates, run aggregation, and download global weights.</p>
                        </Link>
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
