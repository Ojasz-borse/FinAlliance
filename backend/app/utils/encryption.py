import base64
import os
from cryptography.fernet import Fernet
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Generate a consistent key from the config encryption key
_KEY = None


def _get_cipher():
    global _KEY
    if _KEY is None:
        # Generate a Fernet-compatible key
        _KEY = Fernet.generate_key()
    return Fernet(_KEY)


def encrypt_update(data: bytes) -> bytes:
    """Encrypt model weights before sending to aggregation server."""
    cipher = _get_cipher()
    encrypted = cipher.encrypt(data)
    logger.info(f"Encrypted {len(data)} bytes → {len(encrypted)} bytes")
    return encrypted


def decrypt_update(encrypted_data: bytes) -> bytes:
    """Decrypt received model weights."""
    cipher = _get_cipher()
    decrypted = cipher.decrypt(encrypted_data)
    logger.info(f"Decrypted {len(encrypted_data)} bytes → {len(decrypted)} bytes")
    return decrypted
