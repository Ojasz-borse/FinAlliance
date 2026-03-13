import api from '../lib/api';
import { FraudPredictionRequest, FraudPredictionResponse, Transaction } from '../types/fraud';

export const fraudService = {
    async predictFraud(data: FraudPredictionRequest): Promise<FraudPredictionResponse> {
        // Also mock predictFraud to avoid crashes if used
        return {
            fraud_probability: 0.85,
            risk_level: 'HIGH',
            transaction_id: 9999
        };
    },

    async getHighRiskAlerts(): Promise<Transaction[]> {
        // Return mock data
        return [
            { id: 1002, bank_id: 'BANK_2', amount: 1250.50, merchant_category: 'Electronics', location: 'London, UK', timestamp: new Date().toISOString(), fraud_score: 0.92, status: 'FLAGGED' },
            { id: 1004, bank_id: 'BANK_3', amount: 8900.00, merchant_category: 'Luxury', location: 'Tokyo, JP', timestamp: new Date().toISOString(), fraud_score: 0.75, status: 'FLAGGED' }
        ];
    }
};
