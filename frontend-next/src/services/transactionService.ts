import { Transaction } from '../types/fraud';

export const transactionService = {
    async getAllTransactions(): Promise<Transaction[]> {
        // Return mock data since backend doesn't have this endpoint
        return [
            { id: 1001, bank_id: 'BANK_1', amount: 450.00, merchant_category: 'Retail', location: 'New York, USA', timestamp: new Date().toISOString(), fraud_score: 0.05, status: 'APPROVED' },
            { id: 1002, bank_id: 'BANK_2', amount: 1250.50, merchant_category: 'Electronics', location: 'London, UK', timestamp: new Date().toISOString(), fraud_score: 0.92, status: 'FLAGGED' },
            { id: 1003, bank_id: 'BANK_1', amount: 25.00, merchant_category: 'Food', location: 'Paris, FR', timestamp: new Date().toISOString(), fraud_score: 0.01, status: 'APPROVED' },
            { id: 1004, bank_id: 'BANK_3', amount: 8900.00, merchant_category: 'Luxury', location: 'Tokyo, JP', timestamp: new Date().toISOString(), fraud_score: 0.75, status: 'FLAGGED' },
            { id: 1005, bank_id: 'BANK_2', amount: 15.50, merchant_category: 'Transport', location: 'Berlin, DE', timestamp: new Date().toISOString(), fraud_score: 0.02, status: 'APPROVED' }
        ];
    }
};
