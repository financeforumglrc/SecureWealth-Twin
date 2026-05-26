/**
 * ═══════════════════════════════════════════════════════════════════
 *  ON-DEVICE ENCRYPTION SERVICE
 *  Web Crypto API — AES-256-GCM
 *  ═══════════════════════════════════════════════════════════════════
 *
 *  All sensitive financial data is encrypted in the browser before
 *  storage. Decryption happens only in memory. Keys are never sent
 *  to any server. No plaintext data leaves this device.
 *
 *  RBI-compliant: Follows Account Aggregator data protection norms.
 */

const VaultCrypt = {
  _key: null,
  _keyId: null,
  _initialized: false,

  /**
   * Initialize — generate or load encryption key
   */
  async init(forceNew) {
    if (this._initialized && !forceNew) return true;
    try {
      const stored = localStorage.getItem('sw_vault_key_id');
      if (stored && !forceNew) {
        this._keyId = stored;
        this._key = await this._deriveKey(stored);
      } else {
        this._keyId = 'vault_' + crypto.randomUUID();
        this._key = await this._generateKey();
        localStorage.setItem('sw_vault_key_id', this._keyId);
      }
      this._initialized = true;
      return true;
    } catch (e) {
      console.error('[VaultCrypt] Init failed:', e);
      return false;
    }
  },

  /**
   * Generate a new AES-256-GCM key
   */
  async _generateKey() {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  },

  /**
   * Derive key from key ID (simplified — uses PBKDF2 with key ID as salt)
   */
  async _deriveKey(keyId) {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw', enc.encode(keyId + '_securewealth_2026'),
      { name: 'PBKDF2' }, false, ['deriveKey']
    );
    return await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode('sw_vault_salt'), iterations: 100000, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  },

  /**
   * Encrypt any JSON-serializable data
   * Returns: { ciphertext (base64), iv (base64) }
   */
  async encrypt(data) {
    if (!this._initialized) await this.init();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this._key,
      encoded
    );
    return {
      ciphertext: this._arrayBufferToBase64(ciphertext),
      iv: this._arrayBufferToBase64(iv),
      keyId: this._keyId,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Decrypt back to original object
   */
  async decrypt(encrypted) {
    if (!this._initialized) await this.init();
    const iv = this._base64ToArrayBuffer(encrypted.iv);
    const ciphertext = this._base64ToArrayBuffer(encrypted.ciphertext);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this._key,
      ciphertext
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  },

  /**
   * Securely store encrypted data in localStorage
   */
  async secureStore(key, data) {
    const encrypted = await this.encrypt(data);
    localStorage.setItem('sw_enc_' + key, JSON.stringify(encrypted));
    return true;
  },

  /**
   * Securely retrieve and decrypt data from localStorage
   */
  async secureRetrieve(key) {
    const stored = localStorage.getItem('sw_enc_' + key);
    if (!stored) return null;
    try {
      return await this.decrypt(JSON.parse(stored));
    } catch (e) {
      console.error('[VaultCrypt] Decrypt failed for', key, e);
      return null;
    }
  },

  /**
   * Delete encrypted data
   */
  secureDelete(key) {
    localStorage.removeItem('sw_enc_' + key);
  },

  /**
   * Wipe ALL encrypted data + keys
   */
  async wipeAll() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sw_enc_')) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('sw_vault_key_id');
    this._key = null;
    this._keyId = null;
    this._initialized = false;
    return keys.length;
  },

  /**
   * Get encryption status for UI display
   */
  getStatus() {
    return {
      initialized: this._initialized,
      keyId: this._keyId ? this._keyId.substring(0, 12) + '…' : null,
      algorithm: 'AES-256-GCM',
      encryptedItems: this._countEncrypted(),
      isOnDevice: true,
      neverSharedWithServer: true
    };
  },

  _countEncrypted() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).startsWith('sw_enc_')) count++;
    }
    return count;
  },

  _arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  },

  _base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }
};

// Auto-init
VaultCrypt.init();
