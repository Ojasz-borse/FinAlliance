"""Print the results from the most recent training run."""
import pickle
import os
from pathlib import Path

results_dir = Path("results")
pkl_files = sorted(results_dir.glob("fraud_federated_*.pkl"))

if not pkl_files:
    print("No results files found!")
else:
    latest = pkl_files[-1]
    print(f"Loading: {latest}")
    
    with open(latest, "rb") as f:
        data = pickle.load(f)
    
    print(f"\nConfig: {data['config']}")
    print(f"\nResults:")
    print(f"{'Round':<8} {'Accuracy':<12} {'Anomaly':<12} {'Time':<10}")
    print("-" * 42)
    
    for r in data["results"]:
        print(f"{r['round']:<8} {r['accuracy']:<12.2f} {r['avg_anomaly']:<12.3f} {r['round_time']:<10.2f}s")
    
    print(f"\nPer-client anomaly scores (last round):")
    last = data["results"][-1]
    for i, (acc, anom) in enumerate(zip(last["local_accuracies"], last["anomaly_scores"])):
        print(f"  Client {i}: accuracy={acc:.1f}%, anomaly_score={anom:.2f}")
