"""
FedFortress - Federated Learning Defense Platform
A secure distributed learning environment with attack detection and privacy preservation.
"""

__version__ = "1.0.0"

# Main components
from src.models import FraudMLP
from src.client import Client
from src.data import load_creditcard, iid_split, create_dataloaders

__all__ = [
    'FraudMLP',
    'Client',
    'load_creditcard',
    'iid_split',
    'create_dataloaders'
]


