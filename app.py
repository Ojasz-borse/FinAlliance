import sys
import os
import json
import time

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

import csv
import math
import random
import hashlib
from pathlib import Path

CSV_PATH = Path(__file__).parent / 'data' / 'dataset' / 'creditcard.csv'

# ── API: Health check ──
@app.route('/')
@app.route('/api/status')
def status():
    return jsonify({"status": "ok", "message": "FinAlliance API is running"})

# ── API: Get all transactions (from creditcard.csv) ──
@app.route('/api/transactions/all')
def get_all_transactions():
    try:
        transactions = []
        with open(CSV_PATH, 'r') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                if i >= 50:
                    break
                amount = float(row.get('Amount', 0))
                fraud_class = int(float(row.get('Class', 0)))
                # Generate deterministic bank_id and category from row data
                row_hash = hashlib.md5(str(row.get('V1', str(i))).encode()).hexdigest()
                banks = ['BANK_ALPHA', 'BANK_BETA', 'BANK_GAMMA', 'BANK_DELTA']
                categories = ['Retail', 'Electronics', 'Travel', 'Dining', 'Wire Transfer', 'Crypto']
                locations = ['Mumbai, IN', 'New York, US', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Singapore, SG']
                
                transactions.append({
                    'id': 1000 + i,
                    'bank_id': banks[int(row_hash, 16) % len(banks)],
                    'amount': round(amount, 2),
                    'merchant_category': categories[int(row_hash[:4], 16) % len(categories)],
                    'location': locations[int(row_hash[4:8], 16) % len(locations)],
                    'timestamp': f"2026-03-14T{(i % 24):02d}:{(i * 7 % 60):02d}:00Z",
                    'fraud_score': round(fraud_class * 0.85 + (1 - fraud_class) * random.uniform(0, 0.15), 4),
                    'status': 'FLAGGED' if fraud_class == 1 else 'APPROVED'
                })
        return jsonify(transactions)
    except FileNotFoundError:
        return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── API: High risk alerts ──
@app.route('/api/fraud/high-risk')
def get_high_risk():
    try:
        alerts = []
        with open(CSV_PATH, 'r') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                fraud_class = int(float(row.get('Class', 0)))
                if fraud_class == 1:
                    amount = float(row.get('Amount', 0))
                    row_hash = hashlib.md5(str(row.get('V1', str(i))).encode()).hexdigest()
                    banks = ['BANK_ALPHA', 'BANK_BETA', 'BANK_GAMMA', 'BANK_DELTA']
                    categories = ['Retail', 'Electronics', 'Travel', 'Dining', 'Wire Transfer', 'Crypto']
                    locations = ['Mumbai, IN', 'New York, US', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Singapore, SG']
                    
                    alerts.append({
                        'id': 1000 + i,
                        'bank_id': banks[int(row_hash, 16) % len(banks)],
                        'amount': round(amount, 2),
                        'merchant_category': categories[int(row_hash[:4], 16) % len(categories)],
                        'location': locations[int(row_hash[4:8], 16) % len(locations)],
                        'timestamp': f"2026-03-14T{(i % 24):02d}:{(i * 7 % 60):02d}:00Z",
                        'fraud_score': round(0.75 + random.uniform(0, 0.25), 4),
                        'status': 'FLAGGED'
                    })
                    if len(alerts) >= 20:
                        break
        return jsonify(alerts)
    except FileNotFoundError:
        return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── API: Fraud prediction ──
@app.route('/api/fraud/predict', methods=['POST'])
def predict_fraud():
    data = request.json or {}
    amount = float(data.get('amount', 0))
    category = data.get('merchant_category', 'retail').lower()
    location = data.get('location', '')
    timestamp_str = data.get('timestamp', '')
    
    # Risk scoring heuristics
    risk = 0.0
    
    # Amount-based risk
    if amount > 10000:
        risk += 0.35
    elif amount > 5000:
        risk += 0.25
    elif amount > 2000:
        risk += 0.15
    elif amount > 500:
        risk += 0.05
    
    # Category risk
    high_risk_categories = ['crypto', 'wire transfer', 'transfer', 'electronics']
    medium_risk_categories = ['travel', 'luxury']
    if category in high_risk_categories:
        risk += 0.25
    elif category in medium_risk_categories:
        risk += 0.10
    
    # Time-based risk (late night transactions)
    try:
        from datetime import datetime
        ts = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
        hour = ts.hour
        if 0 <= hour < 6:
            risk += 0.20
        elif 22 <= hour <= 23:
            risk += 0.10
    except:
        pass
    
    # Add slight randomness for realism
    risk += random.uniform(-0.05, 0.10)
    risk = max(0.01, min(0.99, risk))
    
    # Determine risk level
    if risk >= 0.65:
        risk_level = 'HIGH'
    elif risk >= 0.35:
        risk_level = 'MEDIUM'
    else:
        risk_level = 'LOW'
    
    return jsonify({
        'fraud_probability': round(risk, 4),
        'risk_level': risk_level,
        'transaction_id': random.randint(10000, 99999),
        'analysis': {
            'amount_risk': 'High' if amount > 5000 else 'Medium' if amount > 1000 else 'Low',
            'category_risk': 'High' if category in high_risk_categories else 'Normal',
            'time_risk': 'Suspicious' if risk > 0.5 else 'Normal',
        }
    })

# ── API: Federated status ──
@app.route('/api/federated/status')
def federated_status():
    return jsonify({
        'status': 'IDLE',
        'current_round': 0,
        'total_rounds': 5,
        'global_accuracy': 94.2,
        'participating_banks': ['BANK_ALPHA', 'BANK_BETA', 'BANK_GAMMA', 'BANK_DELTA']
    })

# ── API: Client Diagnostic Analyzer ──
@app.route('/api/analyze', methods=['POST'])
def analyze_client():
    import re, io
    code_text = ''
    data_text = ''

    if 'code' in request.files:
        code_text = request.files['code'].read().decode('utf-8', errors='ignore')
    if 'data' in request.files:
        data_text = request.files['data'].read().decode('utf-8', errors='ignore')

    issues = []
    metrics = []
    score = 100

    # ─── CODE ANALYSIS ───────────────────────────────────────────
    if code_text:
        # Learning rate check
        lr_matches = re.findall(r'lr\s*=\s*([\d.e+-]+)', code_text) + \
                     re.findall(r'learning_rate\s*=\s*([\d.e+-]+)', code_text)
        lr_val = None
        for lr in lr_matches:
            try:
                lr_val = float(lr)
                break
            except:
                pass
        if lr_val is not None:
            if lr_val > 0.1:
                issues.append({
                    'severity': 'high',
                    'title': f'Learning Rate Too High ({lr_val})',
                    'description': 'A learning rate above 0.1 causes large gradient updates. The server\'s anomaly detector will flag your update norm as suspicious — similar to a weight-scaling attack.',
                    'fix': 'Set lr = 0.001 or use a scheduler: torch.optim.SGD(params, lr=0.001)'
                })
                score -= 20
            elif lr_val > 0.05:
                issues.append({
                    'severity': 'medium',
                    'title': f'Learning Rate Elevated ({lr_val})',
                    'description': 'Learning rate between 0.05–0.1 may cause elevated update norms in early rounds.',
                    'fix': 'Consider reducing to lr = 0.01 or using lr scheduling.'
                })
                score -= 10
            metrics.append({'icon': '⚡', 'label': 'Learning Rate', 'value': str(lr_val),
                'sub': 'Recommended: 0.001–0.01', 'status': 'danger' if lr_val > 0.1 else 'warning' if lr_val > 0.05 else 'ok'})

        # Batch size check
        bs_matches = re.findall(r'batch_size\s*=\s*(\d+)', code_text)
        bs_val = int(bs_matches[0]) if bs_matches else None
        if bs_val is not None:
            if bs_val < 16:
                issues.append({
                    'severity': 'medium',
                    'title': f'Batch Size Too Small ({bs_val})',
                    'description': 'Tiny batch sizes introduce high gradient variance, making your updates statistically anomalous to the server.',
                    'fix': 'Use batch_size = 32 or higher for stable gradient estimates.'
                })
                score -= 15
            metrics.append({'icon': '📦', 'label': 'Batch Size', 'value': str(bs_val),
                'sub': 'Recommended: ≥ 32', 'status': 'warning' if bs_val < 16 else 'ok'})

        # Local epochs check
        ep_matches = re.findall(r'(?:local_epochs|epochs)\s*=\s*(\d+)', code_text)
        ep_val = int(ep_matches[0]) if ep_matches else None
        if ep_val is not None:
            if ep_val > 5:
                issues.append({
                    'severity': 'high',
                    'title': f'Too Many Local Epochs ({ep_val})',
                    'description': 'Excessive local epochs cause client drift — your model diverges far from the global model, producing updates that look like domain-shift attacks.',
                    'fix': 'Limit local_epochs to 1–3. Consider FedProx regularization.'
                })
                score -= 20
            metrics.append({'icon': '🔄', 'label': 'Local Epochs', 'value': str(ep_val),
                'sub': 'Recommended: 1–3', 'status': 'danger' if ep_val > 5 else 'warning' if ep_val > 3 else 'ok'})

        # Normalization check
        if 'Normalize' not in code_text and 'normalize' not in code_text.lower() and 'transforms' in code_text:
            issues.append({
                'severity': 'medium',
                'title': 'Missing Data Normalization',
                'description': 'You use transforms but no Normalize step. Raw pixel values (0–255) cause gradient magnitudes to be much larger than normalized inputs, triggering anomaly detection.',
                'fix': 'Add: transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])'
            })
            score -= 12

        # NaN / Inf check
        if 'nan' in code_text.lower() or 'inf' in code_text.lower():
            issues.append({
                'severity': 'low',
                'title': 'Possible NaN/Inf Handling',
                'description': 'Found potential nan/inf references. If these occur in training, your model weights become unusable and flagged.',
                'fix': 'Add gradient clipping: torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)'
            })
            score -= 5

        # Gradient clipping check
        has_clip = 'clip_grad' in code_text or 'clip_gradient' in code_text
        metrics.append({'icon': '✂️', 'label': 'Gradient Clipping', 'value': '✓ Yes' if has_clip else '✗ No',
            'sub': 'Prevents exploding updates', 'status': 'ok' if has_clip else 'warning'})
        if not has_clip:
            issues.append({
                'severity': 'medium',
                'title': 'No Gradient Clipping',
                'description': 'Without gradient clipping, a single bad batch can produce huge weight updates that are indistinguishable from a noise injection attack.',
                'fix': 'Add after loss.backward(): torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)'
            })
            score -= 10

    # ─── DATA ANALYSIS ───────────────────────────────────────────
    num_samples = 0
    if data_text:
        lines = [l for l in data_text.strip().split('\n') if l.strip()]
        num_samples = max(0, len(lines) - 1)  # subtract header

        # Sample count
        if num_samples < 100:
            issues.append({
                'severity': 'high',
                'title': f'Very Few Samples ({num_samples} rows)',
                'description': 'With fewer than 100 samples, your model memorizes training data and produces highly specific weight updates that look like targeted poisoning.',
                'fix': 'Collect at least 200–500 representative samples per class.'
            })
            score -= 25
        elif num_samples < 300:
            issues.append({
                'severity': 'medium',
                'title': f'Small Dataset ({num_samples} rows)',
                'description': 'Small datasets cause high variance. Your updates may fluctuate significantly between rounds, appearing suspicious.',
                'fix': 'Aim for 500+ samples. Consider data augmentation.'
            })
            score -= 10

        metrics.append({'icon': '🗄️', 'label': 'Dataset Rows', 'value': str(num_samples),
            'sub': 'Recommended: ≥ 500', 'status': 'danger' if num_samples < 100 else 'warning' if num_samples < 300 else 'ok'})

        # Class imbalance (look at last column for CSV labels)
        try:
            import csv
            reader = csv.reader(io.StringIO(data_text))
            rows = list(reader)
            if len(rows) > 1:
                last_col = [r[-1] for r in rows[1:] if r]
                from collections import Counter
                dist = Counter(last_col)
                total = sum(dist.values())
                if len(dist) > 1:
                    max_ratio = max(dist.values()) / total
                    if max_ratio > 0.7:
                        dominant = max(dist, key=dist.get)
                        issues.append({
                            'severity': 'high',
                            'title': f'Severe Class Imbalance (class "{dominant}" = {max_ratio:.0%})',
                            'description': 'Class imbalance biases gradients toward the majority class. This creates skewed weight updates that anomaly detectors interpret as label-flipping attacks.',
                            'fix': 'Use WeightedRandomSampler or oversample minority classes with augmentation.'
                        })
                        score -= 20
                    elif max_ratio > 0.55:
                        score -= 8
                        issues.append({
                            'severity': 'low',
                            'title': f'Mild Class Imbalance ({max_ratio:.0%} in dominant class)',
                            'description': 'Slight imbalance detected. Monitor class distributions across rounds.',
                            'fix': 'Consider using class_weight in your loss function: nn.CrossEntropyLoss(weight=class_weights)'
                        })
                    n_classes = len(dist)
                    metrics.append({'icon': '⚖️', 'label': 'Class Balance', 'value': f'{n_classes} classes',
                        'sub': f'Dominant: {max_ratio:.0%}', 'status': 'danger' if max_ratio > 0.7 else 'warning' if max_ratio > 0.55 else 'ok'})
        except Exception:
            pass

    # ─── SCORE + SUMMARY ─────────────────────────────────────────
    score = max(0, min(100, score))

    if not issues:
        summary = "Your client configuration looks clean! No major red flags were detected. If you're still being flagged, it may be statistical variance in early rounds — this typically resolves after round 3+."
    elif score >= 60:
        summary = f"I found {len(issues)} issue(s) that explain why your client may appear suspicious. None are intentional — they're common training configuration mistakes. The fixes are straightforward."
    else:
        summary = f"There are {len(issues)} significant issues with your training setup. Your client is likely being flagged due to large update norms and data inconsistencies — not malicious intent. Let's fix these together."

    recommendations = [
        {'title': 'Set Learning Rate to 0.001', 'description': 'Use Adam or SGD with lr=0.001. This is the most common reason for anomalous update norms in federated learning.'},
        {'title': 'Add Gradient Clipping', 'description': 'torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0) prevents any single batch from creating huge weight updates.'},
        {'title': 'Normalize Your Data', 'description': 'Normalize inputs to mean=0, std=1. This stabilizes training and keeps gradient magnitudes in the expected range.'},
        {'title': 'Limit Local Epochs to 1–3', 'description': 'More local epochs = more client drift. Stay close to the global model to avoid being flagged as an outlier.'},
        {'title': 'Balance Your Dataset', 'description': 'Use WeightedRandomSampler or oversampling to ensure each class has similar representation.'},
        {'title': 'Increase Dataset Size', 'description': 'More data = more stable gradients. Aim for at least 500 samples to reduce round-to-round variance.'},
    ]

    # Filter recommendations based on issues found
    relevant_recos = []
    issue_titles = ' '.join(i['title'].lower() for i in issues)
    for rec in recommendations:
        if any(kw in issue_titles for kw in ['learning rate', 'gradient', 'normalize', 'epoch', 'imbalance', 'sample', 'few']):
            relevant_recos.append(rec)
        if len(relevant_recos) >= 4:
            break
    if not relevant_recos:
        relevant_recos = recommendations[:4]

    return jsonify({
        'health_score': score,
        'summary': summary,
        'metrics': metrics,
        'issues': issues,
        'recommendations': relevant_recos[:4],
    })


# ── API: Run Baseline Training (SSE) ──
@app.route('/api/train/baseline', methods=['POST'])
def run_baseline_training():
    data = request.json or {}
    epochs = min(int(data.get('epochs', 3)), 5)

    def generate():
        try:
            from src.baseline import train_baseline
            for result in train_baseline(epochs=epochs):
                yield f"data: {json.dumps(result)}\n\n"
                time.sleep(0.05)
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            import traceback
            yield f"data: {json.dumps({'error': str(e), 'traceback': traceback.format_exc()})}\n\n"

    return Response(generate(), mimetype='text/event-stream',
                    headers={'Cache-Control': 'no-cache',
                             'X-Accel-Buffering': 'no',
                             'Connection': 'keep-alive'})

# ── API: Run Federated Training (SSE) ──
@app.route('/api/train/federated', methods=['POST'])
def run_federated_training_api():
    data = request.json or {}

    max_samples = int(data.get('max_samples', 10000))
    # Automatically use quick_mode for smaller sample counts (fast demo)
    quick_mode = max_samples <= 2000

    config = {
        'aggregation':       data.get('aggregation', 'FedAvg'),
        'num_clients':       int(data.get('num_clients', 3)),
        'malicious_clients': int(data.get('malicious_clients', 1)),
        'rounds':            min(int(data.get('rounds', 3)), 5),
        'quick_mode':        quick_mode,
        'max_samples':       max_samples,
        'local_epochs':      int(data.get('local_epochs', 1)),
        'dp_enabled':        bool(data.get('dp_enabled', False)),
        'dp_epsilon':        float(data.get('dp_epsilon', 1.0)),
        'attack_type':       data.get('attack_type', 'noise_injection'),
    }

    def generate():
        try:
            from src.main import run_federated_training, save_training_results
            all_results = []
            for update in run_federated_training(**config):
                all_results.append(update)
                yield f"data: {json.dumps(update)}\n\n"
                time.sleep(0.05)

            # Save results (non-fatal if it fails)
            try:
                saved_path = save_training_results(
                    results=all_results,
                    aggregation=config['aggregation'],
                    num_clients=config['num_clients'],
                    malicious_clients=config['malicious_clients'],
                    rounds=config['rounds'],
                    quick_mode=config['quick_mode'],
                    max_samples=config['max_samples'],
                    dp_enabled=config['dp_enabled'],
                    dp_epsilon=config['dp_epsilon'],
                )
                yield f"data: {json.dumps({'done': True, 'saved_path': str(saved_path), 'total_rounds': len(all_results)})}\n\n"
            except Exception:
                yield f"data: {json.dumps({'done': True, 'total_rounds': len(all_results)})}\n\n"

        except Exception as e:
            import traceback
            yield f"data: {json.dumps({'error': str(e), 'traceback': traceback.format_exc()})}\n\n"

    return Response(generate(), mimetype='text/event-stream',
                    headers={'Cache-Control': 'no-cache',
                             'X-Accel-Buffering': 'no',
                             'Connection': 'keep-alive'})
# ── API: Simulate sending encrypted model update ──
@app.route('/api/federated/send-update', methods=['POST'])
def send_model_update():
    """Simulate encrypting and sending local model weights to the aggregation server."""
    import hashlib
    data = request.json or {}
    bank_id = data.get('bank_id', 'BANK_ALPHA')
    
    # Simulate processing
    time.sleep(1)
    
    # Generate a realistic update hash
    update_hash = hashlib.sha256(f"{bank_id}_{time.time()}".encode()).hexdigest()[:16]
    
    return jsonify({
        'status': 'success',
        'bank_id': bank_id,
        'update_id': f"UPD-{update_hash.upper()}",
        'encrypted': True,
        'size_bytes': 2457600,
        'layers_updated': 6,
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'message': f'Encrypted model update from {bank_id} submitted to aggregation server'
    })

# ── API: Download global model ──
@app.route('/api/federated/download-model')
def download_global_model():
    """Generate and return the current global model as a downloadable file."""
    import struct
    
    # Create a realistic model binary header + random weights
    model_data = bytearray()
    # Header
    model_data.extend(b'FINALLIANCE_MODEL_v1.0\x00')
    # Metadata
    model_data.extend(struct.pack('I', 6))  # num layers
    model_data.extend(struct.pack('I', 30))  # input features
    model_data.extend(struct.pack('I', 2))   # output classes
    # Simulated weights (small binary blob)
    import random
    for _ in range(1024):
        model_data.extend(struct.pack('f', random.gauss(0, 0.1)))
    
    return Response(
        bytes(model_data),
        mimetype='application/octet-stream',
        headers={'Content-Disposition': 'attachment; filename=global_model_finalliance.pt'}
    )


if __name__ == '__main__':
    print("\n[FinAlliance API Server]")
    print("   Frontend: http://localhost:3000")
    print("   API:      http://localhost:5000/api/status\n")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True, use_reloader=False)
