import api from '../lib/api';
import { FraudPredictionRequest, FraudPredictionResponse, Transaction } from '../types/fraud';

export const fraudService = {
    async predictFraud(data: FraudPredictionRequest): Promise<FraudPredictionResponse> {
        const res = await api.post('/api/fraud/predict', data);
        return res.data;
    },

    async getHighRiskAlerts(): Promise<Transaction[]> {
        const res = await api.get('/api/fraud/high-risk');
        return res.data;
    }
};
