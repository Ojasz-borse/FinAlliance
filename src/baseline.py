import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Subset
import numpy as np
from src.models.simple_model import FraudMLP
from src.data.data_utils import load_creditcard

def train_baseline(epochs=5):
    """
    Centralized baseline training for Credit Card Fraud Detection.
    Yields results after each epoch for live display.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load credit card data
    dataset = load_creditcard(max_samples=10000)
    
    # Split into train/test (80/20)
    dataset_size = len(dataset)
    indices = list(range(dataset_size))
    np.random.shuffle(indices)
    split = int(np.floor(0.2 * dataset_size))
    train_indices, test_indices = indices[split:], indices[:split]

    train_dataset = Subset(dataset, train_indices)
    test_dataset = Subset(dataset, test_indices)

    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

    model = FraudMLP().to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

    print("Starting Centralized Training on Credit Card Fraud Data...")

    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for features, labels in train_loader:
            features, labels = features.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(features)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

        train_accuracy = 100 * correct / total
        avg_loss = running_loss / len(train_loader)

        # Yield results for live display
        yield {
            "epoch": epoch + 1,
            "loss": avg_loss,
            "accuracy": train_accuracy
        }

    # Final Evaluation
    model.eval()
    correct = 0
    total = 0

    with torch.no_grad():
        for features, labels in test_loader:
            features, labels = features.to(device), labels.to(device)
            outputs = model(features)
            _, predicted = torch.max(outputs, 1)

            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    test_accuracy = 100 * correct / total
    print(f"Final Test Accuracy: {test_accuracy:.2f}%")
    
    yield {
        "epoch": epochs,
        "loss": avg_loss,
        "accuracy": test_accuracy,
        "test_accuracy": test_accuracy
    }


def run_centralized_training(epochs=3):
    """Run centralized training and return final accuracy."""
    results = list(train_baseline(epochs))
    return results[-1].get('accuracy', 0) if results else 0
