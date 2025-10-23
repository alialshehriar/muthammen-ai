/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API الحصول على جميع المسجلين - all.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function للحصول على قائمة كاملة بجميع المسجلين في الانتظار
 * 
 * المخرج: { success: true, signups: [...] }
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  // السماح بـ GET فقط
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // الحصول على جميع المسجلين
    const result = await query(
      `SELECT 
        id,
        email,
        name,
        city,
        phone,
        ref_code,
        referred_by,
        referrals_count,
        reward_tier,
        created_at
      FROM waitlist_signups
      ORDER BY created_at DESC`
    );

    // إرجاع النتيجة
    return res.status(200).json({
      success: true,
      signups: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch waitlist',
      details: error.message
    });
  }
}

