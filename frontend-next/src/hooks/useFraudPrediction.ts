import { useState } from 'react';
import { fraudService } from '../services/fraudService';
import { FraudPredictionRequest, FraudPredictionResponse } from '../types/fraud';
import axios from 'axios';

export function useFraudPrediction() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FraudPredictionResponse | null>(null);

    const predict = async (data: FraudPredictionRequest) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fraudService.predictFraud(data);
            setResult(response);
            return response;
        } catch (err) {
            const message = axios.isAxiosError(err) && err.response?.data?.detail
                ? err.response.data.detail
                : 'Failed to predict fraud risk. Please try again.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setResult(null);
        setError(null);
        setLoading(false);
    };

    return {
        predict,
        result,
        loading,
        error,
        reset,
    };
}
