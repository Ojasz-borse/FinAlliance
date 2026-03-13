import api from '../lib/api';
import { FederatedStatus } from '../types/fraud';

export const federatedService = {
    async trainLocal() {
        const response = await api.post('/federated/train-local');
        return response.data;
    },

    async sendUpdate() {
        const response = await api.post('/federated/send-update');
        return response.data;
    },

    async aggregateModels() {
        const response = await api.post('/federated/aggregate');
        return response.data;
    },

    async downloadGlobalModel() {
        // Return blob for download
        const response = await api.get('/federated/global-model', {
            responseType: 'blob',
        });
        return response.data;
    },

    async getStatus(): Promise<FederatedStatus> {
        const response = await api.get<FederatedStatus>('/federated/status');
        return response.data;
    }
};
