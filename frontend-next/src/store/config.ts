import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConfigState {
  // Training
  num_clients: number
  malicious_clients: number
  rounds: number
  local_epochs: number
  max_samples: number
  
  // Security
  attack_type: 'noise_injection' | 'label_flipping' | 'weight_scaling' | 'random_weights'
  
  // Privacy
  dp_enabled: boolean
  dp_epsilon: number
  
  // Aggregation
  aggregation: 'FedAvg' | 'Trimmed Mean' | 'Median'
  
  // Actions
  setNumClients: (value: number) => void
  setMaliciousClients: (value: number) => void
  setRounds: (value: number) => void
  setLocalEpochs: (value: number) => void
  setMaxSamples: (value: number) => void
  setAttackType: (value: ConfigState['attack_type']) => void
  setDpEnabled: (value: boolean) => void
  setDpEpsilon: (value: number) => void
  setAggregation: (value: ConfigState['aggregation']) => void
  reset: () => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // Defaults
      num_clients: 5,
      malicious_clients: 1,
      rounds: 5,
      local_epochs: 1,
      max_samples: 5000,
      attack_type: 'noise_injection',
      dp_enabled: true,
      dp_epsilon: 1.0,
      aggregation: 'FedAvg' as const,

      setNumClients: (value) => set({ num_clients: value }),
      setMaliciousClients: (value) => {
        const maxMal = Math.max(0, get().num_clients - 1)
        set({ malicious_clients: Math.min(value, maxMal) })
      },
      setRounds: (value) => set({ rounds: value }),
      setLocalEpochs: (value) => set({ local_epochs: value }),
      setMaxSamples: (value) => set({ max_samples: value }),
      setAttackType: (value) => set({ attack_type: value }),
      setDpEnabled: (value) => set({ dp_enabled: value }),
      setDpEpsilon: (value) => set({ dp_epsilon: value }),
      setAggregation: (value) => set({ aggregation: value }),
      
      reset: () => set({
        num_clients: 5,
        malicious_clients: 1,
        rounds: 5,
        local_epochs: 1,
        max_samples: 5000,
        attack_type: 'noise_injection',
        dp_enabled: true,
        dp_epsilon: 1.0,
        aggregation: 'FedAvg',
      }),
    }),
    {
      name: 'fedfortress-config',
    }
  )
)

