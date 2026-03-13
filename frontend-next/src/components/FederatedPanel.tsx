'use client';

import { useState } from 'react';
import { useToast } from './Toast';
import { federatedService } from '../services/federatedService';

export default function FederatedPanel() {
    const { showToast } = useToast();
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const handleAction = async (actionId: string, actionFn: () => Promise<any>, successMsg: string) => {
        try {
            setLoadingAction(actionId);
            await actionFn();
            showToast(successMsg, 'success');
        } catch (err: any) {
            showToast(`Failed: ${err.message || 'Server error'}`, 'error');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDownload = async () => {
        try {
            setLoadingAction('download');
            const blob = await federatedService.downloadGlobalModel();

            // Create download link
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'global_model.pt');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            showToast('Global model downloaded successfully', 'success');
        } catch (err: any) {
            showToast('Failed to download model', 'error');
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="bg-navy-950/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 shrink-0 rounded-lg border border-purple-500/30">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Federated Admin</h2>
                    <p className="text-sm text-slate-400">Manage FL cluster and models</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Train Local Model */}
                <button
                    onClick={() => handleAction('train', federatedService.trainLocal, 'Local training started')}
                    disabled={loadingAction !== null}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium text-slate-200">Train Local Model</span>
                    <span className="text-xs text-slate-400 mt-1">Run on internal data</span>
                </button>

                {/* Send Model Update */}
                <button
                    onClick={() => handleAction('update', federatedService.sendUpdate, 'Encrypted model sent to server')}
                    disabled={loadingAction !== null}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-6 h-6 text-cyan-400 mb-2 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-medium text-slate-200">Send Update</span>
                    <span className="text-xs text-slate-400 mt-1">Upload weights securely</span>
                </button>

                {/* Aggregate Models */}
                <button
                    onClick={() => handleAction('aggregate', federatedService.aggregateModels, 'Models successfully aggregated')}
                    disabled={loadingAction !== null}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-6 h-6 text-emerald-400 mb-2 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="font-medium text-emerald-100">Aggregate Models</span>
                    <span className="text-xs text-emerald-400/70 mt-1">Combine node updates</span>
                </button>

                {/* Download Global Model */}
                <button
                    onClick={handleDownload}
                    disabled={loadingAction !== null}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-6 h-6 text-purple-400 mb-2 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="font-medium text-purple-100">Get Global Model</span>
                    <span className="text-xs text-purple-400/70 mt-1">Download shared weights</span>
                </button>
            </div>

            {loadingAction && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center gap-2 text-sm text-blue-200">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing federated action...
                </div>
            )}
        </div>
    );
}
