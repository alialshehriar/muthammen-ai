import { query } from '../db.js';
import { isValidRefCode } from '../utils/refCode.js';

/**
 * معالج إحصائيات الإحالة
 * GET /api/referrals/stats?ref=CODE
 */
export default async function handler(req, res) {
  // السماح فقط بـ GET
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // تفعيل CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { ref } = req.query;

    // التحقق من كود الإحالة
    if (!ref || !isValidRefCode(ref)) {
      return res.status(400).json({ ok: false, error: 'Invalid referral code' });
    }

    // الحصول على إحصائيات المستخدم
    const userStats = await query(
      `SELECT 
        ref_code,
        referrals_count,
        reward_tier,
        created_at
       FROM waitlist_signups
       WHERE ref_code = $1`,
      [ref]
    );

    if (userStats.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Referral code not found' });
    }

    const user = userStats.rows[0];

    // الحصول على عدد النقرات
    const clicksResult = await query(
      'SELECT COUNT(*) as clicks FROM referral_clicks WHERE ref_code = $1',
      [ref]
    );

    const clicks = parseInt(clicksResult.rows[0].clicks);

    // الحصول على قائمة الإحالات الناجحة
    const referralsResult = await query(
      `SELECT email, name, city, created_at
       FROM waitlist_signups
       WHERE referred_by = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [ref]
    );

    // حساب معدل التحويل
    const conversionRate = clicks > 0 ? (user.referrals_count / clicks * 100).toFixed(2) : 0;

    return res.status(200).json({
      ok: true,
      stats: {
        refCode: user.ref_code,
        referralsCount: user.referrals_count,
        rewardTier: user.reward_tier,
        clicks: clicks,
        conversionRate: parseFloat(conversionRate),
        memberSince: user.created_at,
        recentReferrals: referralsResult.rows.map(r => ({
          email: r.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // إخفاء جزء من البريد
          name: r.name || 'غير محدد',
          city: r.city || 'غير محدد',
          date: r.created_at
        }))
      }
    });

  } catch (error) {
    console.error('❌ Error fetching referral stats:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
}

