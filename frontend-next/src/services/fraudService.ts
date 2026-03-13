import api from '../lib/api';
import { FraudPredictionRequest, FraudPredictionResponse, Transaction } from '../types/fraud';

export const fraudService = {
    async predictFraud(data: FraudPredictionRequest): Promise<FraudPredictionResponse> {
        const response = await api.post<FraudPredictionResponse>('/fraud/predict', data);
        return response.data;
    },

    async getHighRiskAlerts(): Promise<Transaction[]> {
        const response = await api.get<Transaction[]>('/fraud/high-risk');
        return response.data;
    }
};
