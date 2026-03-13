"""
Simple CNN Model for CIFAR-10
A lightweight convolutional neural network for image classification.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


# Removed SimpleCNN and SimpleMLP


class FraudMLP(nn.Module):
    """
    MLP for tabular credit card fraud detection.
    Designed for the Kaggle creditcard.csv dataset (30 features → binary classification).
    """
    
    def __init__(self, input_dim=30, num_classes=2):
        super(FraudMLP, self).__init__()
        
        self.fc1 = nn.Linear(input_dim, 128)
        self.bn1 = nn.BatchNorm1d(128)
        
        self.fc2 = nn.Linear(128, 64)
        self.bn2 = nn.BatchNorm1d(64)
        
        self.fc3 = nn.Linear(64, 32)
        self.bn3 = nn.BatchNorm1d(32)
        
        self.fc4 = nn.Linear(32, num_classes)
        
        self.dropout = nn.Dropout(0.3)
    
    def forward(self, x):
        x = F.relu(self.bn1(self.fc1(x)))
        x = self.dropout(x)
        x = F.relu(self.bn2(self.fc2(x)))
        x = self.dropout(x)
        x = F.relu(self.bn3(self.fc3(x)))
        x = self.dropout(x)
        x = self.fc4(x)
        return x

