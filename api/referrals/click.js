import { query } from '../db.js';
import { isValidRefCode } from '../utils/refCode.js';

/**
 * معالج تسجيل نقرات الإحالة
 * POST /api/referrals/click
 */
export default async function handler(req, res) {
  // السماح فقط بـ POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // تفعيل CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { refCode, path } = req.body;

    // التحقق من كود الإحالة
    if (!refCode || !isValidRefCode(refCode)) {
      return res.status(400).json({ ok: false, error: 'Invalid referral code' });
    }

    // التحقق من وجود كود الإحالة
    const refCheck = await query(
      'SELECT ref_code FROM waitlist_signups WHERE ref_code = $1',
      [refCode]
    );

    if (refCheck.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Referral code not found' });
    }

    // الحصول على IP من الطلب
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
             || req.headers['x-real-ip'] 
             || req.connection?.remoteAddress 
             || null;

    // تسجيل النقرة
    await query(
      `INSERT INTO referral_clicks (ref_code, ip, user_agent, path)
       VALUES ($1, $2, $3, $4)`,
      [
        refCode,
        ip,
        req.headers['user-agent'] || null,
        path || req.headers['referer'] || null
      ]
    );

    // تسجيل حدث referral_click
    await query(
      `INSERT INTO events (event_name, event_props, user_agent, path)
       VALUES ($1, $2, $3, $4)`,
      [
        'referral_click',
        JSON.stringify({ ref_code: refCode, ip }),
        req.headers['user-agent'] || null,
        path || req.headers['referer'] || null
      ]
    );

    return res.status(200).json({
      ok: true,
      message: 'Click recorded'
    });

  } catch (error) {
    console.error('❌ Error recording referral click:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
}

