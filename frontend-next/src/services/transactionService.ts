import api from '../lib/api';
import { Transaction } from '../types/fraud';

export const transactionService = {
    async getAllTransactions(): Promise<Transaction[]> {
        const res = await api.get('/api/transactions/all');
        return res.data;
    }
};
