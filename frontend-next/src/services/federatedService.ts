import api from '../lib/api';
import { FederatedStatus } from '../types/fraud';

export const federatedService = {
    async trainLocal() {
        const res = await api.post('/api/train/baseline', { epochs: 3 });
        return res.data;
    },

    async sendUpdate() {
        // Simulated — in production this would submit model weights
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, message: 'Encrypted update sent to server' };
    },

    async aggregateModels() {
        const res = await api.post('/api/train/federated', {
            aggregation: 'FedAvg',
            num_clients: 3,
            malicious_clients: 1,
            rounds: 3,
            max_samples: 2000,
        });
        return res.data;
    },

    async downloadGlobalModel() {
        await new Promise(r => setTimeout(r, 1000));
        return new Blob(['model data'], { type: 'application/octet-stream' });
    },

    async getStatus(): Promise<FederatedStatus> {
        const res = await api.get('/api/federated/status');
        return res.data;
    }
};
