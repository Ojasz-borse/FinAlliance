export interface Transaction {
    id: number;
    bank_id: string;
    amount: number;
    merchant_category: string;
    location: string;
    timestamp: string;
    fraud_score?: number;
    status?: 'PENDING' | 'APPROVED' | 'DECLINED' | 'FLAGGED';
}

export interface FraudPredictionRequest {
    bank_id: string;
    amount: number;
    merchant_category: string;
    location: string;
    timestamp: string;
}

export interface FraudPredictionResponse {
    fraud_probability: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    transaction_id?: number;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        username: string;
        role: string;
        bank_id?: string;
    };
}

export interface FederatedStatus {
    status: 'IDLE' | 'TRAINING' | 'AGGREGATING' | 'ERROR';
    current_round: number;
    total_rounds: number;
    global_accuracy: number;
    participating_banks: string[];
}
