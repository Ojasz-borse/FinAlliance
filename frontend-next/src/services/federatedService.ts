import { FederatedStatus } from '../types/fraud';

export const federatedService = {
    async trainLocal() {
        // Mock network delay
        await new Promise(r => setTimeout(r, 1500));
        return { success: true, message: 'Local training complete' };
    },

    async sendUpdate() {
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, message: 'Update sent securely' };
    },

    async aggregateModels() {
        await new Promise(r => setTimeout(r, 2000));
        return { success: true, message: 'Aggregation complete' };
    },

    async downloadGlobalModel() {
        await new Promise(r => setTimeout(r, 1000));
        // Return a dummy blob 
        return new Blob(['mock model data'], { type: 'application/octet-stream' });
    },

    async getStatus(): Promise<FederatedStatus> {
        return {
            status: 'IDLE',
            current_round: 1,
            total_rounds: 3,
            global_accuracy: 0.95,
            participating_banks: ['BANK_1', 'BANK_2', 'BANK_3']
        };
    }
};
