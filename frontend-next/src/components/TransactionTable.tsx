'use client';

import { Transaction } from '../types/fraud';

interface TransactionTableProps {
    transactions: Transaction[];
    isLoading?: boolean;
}

export default function TransactionTable({ transactions, isLoading = false }: TransactionTableProps) {

    const getScoreColor = (score?: number) => {
        if (score === undefined) return 'text-slate-400';
        if (score >= 0.75) return 'text-red-400 font-bold';
        if (score >= 0.4) return 'text-yellow-400';
        return 'text-emerald-400';
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'FLAGGED':
            case 'DECLINED':
                return <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-semibold">FLAGGED</span>;
            case 'APPROVED':
                return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-xs font-semibold">APPROVED</span>;
            default:
                return <span className="px-2 py-1 bg-navy-600 border border-white/10 text-slate-300 rounded text-xs font-semibold">PENDING</span>;
        }
    };

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-navy-950/30 backdrop-blur-md">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-slate-400 bg-navy-900/50 border-b border-white/5 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 font-medium tracking-wider">Tx ID</th>
                        <th className="px-4 py-3 font-medium tracking-wider">Bank Node</th>
                        <th className="px-4 py-3 font-medium tracking-wider text-right">Amount</th>
                        <th className="px-4 py-3 font-medium tracking-wider">Merchant</th>
                        <th className="px-4 py-3 font-medium tracking-wider">Location</th>
                        <th className="px-4 py-3 font-medium tracking-wider text-right">Risk Score</th>
                        <th className="px-4 py-3 font-medium tracking-wider text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                                <div className="inline-flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading transactions...
                                </div>
                            </td>
                        </tr>
                    ) : transactions.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                No transactions found.
                            </td>
                        </tr>
                    ) : (
                        transactions.map((tx) => {
                            const isSuspicious = tx.fraud_score && tx.fraud_score >= 0.75;
                            return (
                                <tr
                                    key={tx.id}
                                    className={`hover:bg-white/5 transition-colors ${isSuspicious ? 'bg-red-950/10' : ''
                                        }`}
                                >
                                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{String(tx.id).padStart(6, '0')}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            {tx.bank_id}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-white">
                                        ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 capitalize">{tx.merchant_category}</td>
                                    <td className="px-4 py-3 text-slate-400">{tx.location}</td>
                                    <td className={`px-4 py-3 text-right ${getScoreColor(tx.fraud_score)}`}>
                                        {tx.fraud_score !== undefined ? (tx.fraud_score * 100).toFixed(1) + '%' : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {getStatusBadge(tx.status)}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
