/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Utility لتسجيل الأحداث - logEvent.js
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { query } from '../db.js';

/**
 * تسجيل حدث في قاعدة البيانات
 * @param {string} eventType - نوع الحدث (evaluation_created, user_registered, referral_clicked, etc.)
 * @param {object} eventData - بيانات الحدث
 * @param {string} userId - معرف المستخدم (اختياري)
 * @param {string} sessionId - معرف الجلسة (اختياري)
 * @param {object} req - كائن الطلب للحصول على IP و User Agent
 */
export async function logEvent(eventType, eventData = {}, userId = null, sessionId = null, req = null) {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.connection?.remoteAddress || null) : null;
    const userAgent = req ? req.headers['user-agent'] : null;

    await query(
      `INSERT INTO events (event_type, event_data, user_id, session_id, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [eventType, JSON.stringify(eventData), userId, sessionId, ipAddress, userAgent]
    );

    return { success: true };
  } catch (error) {
    console.error('Error logging event:', error);
    return { success: false, error: error.message };
  }
}

/**
 * أنواع الأحداث المدعومة
 */
export const EVENT_TYPES = {
  // تقييمات
  EVALUATION_CREATED: 'evaluation_created',
  EVALUATION_VIEWED: 'evaluation_viewed',
  EVALUATION_SHARED: 'evaluation_shared',
  
  // مستخدمين
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  
  // إحالات
  REFERRAL_CLICKED: 'referral_clicked',
  REFERRAL_CONVERTED: 'referral_converted',
  REWARD_EARNED: 'reward_earned',
  
  // قائمة الانتظار
  WAITLIST_JOINED: 'waitlist_joined',
  
  // عام
  PAGE_VIEW: 'page_view',
  FORM_SUBMITTED: 'form_submitted',
  ERROR_OCCURRED: 'error_occurred'
};

