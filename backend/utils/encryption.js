const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * FIELD-LEVEL ENCRYPTION — AES-256-GCM
 * Used for sensitive clinical data (BP, Sugar, Records)
 */
const encrypt = (text) => {
  if (!text) return null;
  const secret = process.env.ENCRYPTION_KEY || 'sehatai_ultra_secret_key_2024_xyz';
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  // Use PBKDF2 to derive a key from the secret
  const key = crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha512');

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  // Package as: salt:iv:tag:encrypted
  return `${salt.toString('hex')}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

  try {
    const secret = process.env.ENCRYPTION_KEY || 'sehatai_ultra_secret_key_2024_xyz';
    const [saltHex, ivHex, tagHex, encrypted] = encryptedText.split(':');

    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const key = crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha512');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    console.error('Decryption failed:', err.message);
    return '[Encrypted Data]';
  }
};

module.exports = { encrypt, decrypt };
