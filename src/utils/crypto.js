// src/utils/crypto.js

// Derives a cryptographic key from a user's password using PBKDF2
async function getKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a text string using AES-GCM
 */
export async function encryptData(text, password) {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);

  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    enc.encode(text)
  );

  // Package salt, iv, and ciphertext into a single JSON payload
  return JSON.stringify({
    salt: Array.from(salt),
    iv: Array.from(iv),
    cipher: Array.from(new Uint8Array(encryptedContent)),
  });
}

/**
 * Decrypts an AES-GCM encrypted payload using the password
 */
export async function decryptData(encryptedPayloadJson, password) {
  try {
    const payload = JSON.parse(encryptedPayloadJson);
    const salt = new Uint8Array(payload.salt);
    const iv = new Uint8Array(payload.iv);
    const cipher = new Uint8Array(payload.cipher);

    const key = await getKey(password, salt);

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      cipher
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedContent);
  } catch (err) {
    throw new Error('Incorrect password or corrupted data.');
  }
}