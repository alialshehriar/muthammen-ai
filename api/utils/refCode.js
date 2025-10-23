/**
 * توليد كود إحالة فريد
 * يستخدم Base62 (A-Z, a-z, 0-9) لتوليد كود قصير وسهل القراءة
 */

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * توليد رقم عشوائي آمن
 * @param {number} min - الحد الأدنى
 * @param {number} max - الحد الأقصى
 * @returns {number} رقم عشوائي
 */
function secureRandom(min, max) {
  const range = max - min;
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return min + (randomBuffer[0] % range);
}

/**
 * تحويل رقم إلى Base62
 * @param {number} num - الرقم المراد تحويله
 * @returns {string} النص بصيغة Base62
 */
function toBase62(num) {
  if (num === 0) return BASE62_CHARS[0];
  
  let result = '';
  while (num > 0) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

/**
 * توليد كود إحالة فريد
 * @param {number} length - طول الكود (افتراضي 8)
 * @returns {string} كود الإحالة
 */
export function generateRefCode(length = 8) {
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = secureRandom(0, BASE62_CHARS.length);
    code += BASE62_CHARS[randomIndex];
  }
  return code;
}

/**
 * توليد كود إحالة من timestamp + عشوائي
 * @returns {string} كود الإحالة
 */
export function generateRefCodeFromTimestamp() {
  const timestamp = Date.now();
  const random = secureRandom(0, 999999);
  const combined = timestamp * 1000000 + random;
  return toBase62(combined);
}

/**
 * التحقق من صحة كود الإحالة
 * @param {string} code - الكود المراد التحقق منه
 * @returns {boolean} صحيح إذا كان الكود صالحاً
 */
export function isValidRefCode(code) {
  if (!code || typeof code !== 'string') return false;
  if (code.length < 6 || code.length > 12) return false;
  
  // التحقق من أن جميع الأحرف من Base62
  for (let char of code) {
    if (!BASE62_CHARS.includes(char)) return false;
  }
  
  return true;
}

/**
 * توليد كود إحالة فريد مع محاولات متعددة
 * @param {Function} checkExists - دالة للتحقق من وجود الكود
 * @param {number} maxAttempts - عدد المحاولات القصوى
 * @returns {Promise<string>} كود الإحالة الفريد
 */
export async function generateUniqueRefCode(checkExists, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateRefCode(8);
    const exists = await checkExists(code);
    if (!exists) {
      return code;
    }
  }
  
  // إذا فشلت جميع المحاولات، استخدم timestamp
  return generateRefCodeFromTimestamp();
}

/**
 * Generate a unique share token for evaluation sharing
 * @returns {string} 32 character hex string
 */
export function generateShareToken() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a visitor ID for anonymous users
 * @returns {string} UUID v4 format
 */
export function generateVisitorId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate a session ID
 * @returns {string} 24 character hex string
 */
export function generateSessionId() {
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate share token format
 * @param {string} token - The token to validate
 * @returns {boolean} true if valid
 */
export function isValidShareToken(token) {
  if (!token || typeof token !== 'string') return false;
  return /^[a-f0-9]{32}$/.test(token);
}

export default {
  generateRefCode,
  generateRefCodeFromTimestamp,
  isValidRefCode,
  generateUniqueRefCode,
  generateShareToken,
  generateVisitorId,
  generateSessionId,
  isValidShareToken
};

