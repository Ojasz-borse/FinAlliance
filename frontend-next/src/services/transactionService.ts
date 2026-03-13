import api from '../lib/api';
import { Transaction } from '../types/fraud';

export const transactionService = {
    async getAllTransactions(): Promise<Transaction[]> {
        const response = await api.get<Transaction[]>('/transactions/all');
        return response.data;
    }
};
