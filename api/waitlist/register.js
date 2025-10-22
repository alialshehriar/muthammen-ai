import { query } from '../db.js';
import { generateUniqueRefCode, isValidRefCode } from '../utils/refCode.js';

/**
 * معالج التسجيل في Waitlist
 * POST /api/waitlist/register
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
    const { email, name, city, phone, refCode: referredByCode, honeypot } = req.body;

    // التحقق من honeypot (حماية من البوتات)
    if (honeypot && honeypot.trim() !== '') {
      console.log('🤖 Bot detected via honeypot');
      return res.status(400).json({ ok: false, error: 'Invalid submission' });
    }

    // التحقق من البريد الإلكتروني
    if (!email || !email.trim()) {
      return res.status(400).json({ ok: false, error: 'Email is required' });
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email format' });
    }

    // التحقق من كود الإحالة إذا تم إدخاله
    let validReferredBy = null;
    if (referredByCode && referredByCode.trim()) {
      if (!isValidRefCode(referredByCode)) {
        return res.status(400).json({ ok: false, error: 'Invalid referral code format' });
      }

      // التحقق من وجود كود الإحالة في قاعدة البيانات
      const refCheck = await query(
        'SELECT ref_code FROM waitlist_signups WHERE ref_code = $1',
        [referredByCode.trim()]
      );

      if (refCheck.rows.length === 0) {
        return res.status(400).json({ ok: false, error: 'Referral code not found' });
      }

      validReferredBy = referredByCode.trim();
    }

    // التحقق من وجود البريد مسبقاً
    const existingUser = await query(
      'SELECT id, ref_code, referrals_count, reward_tier FROM waitlist_signups WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    let userRefCode, referralsCount, rewardTier;

    if (existingUser.rows.length > 0) {
      // المستخدم موجود مسبقاً - تحديث البيانات
      const user = existingUser.rows[0];
      userRefCode = user.ref_code;
      
      // تحديث البيانات الاختيارية
      const updateResult = await query(
        `UPDATE waitlist_signups 
         SET name = COALESCE($1, name),
             city = COALESCE($2, city),
             phone = COALESCE($3, phone)
         WHERE email = $4
         RETURNING referrals_count, reward_tier`,
        [name?.trim() || null, city?.trim() || null, phone?.trim() || null, email.toLowerCase().trim()]
      );

      referralsCount = updateResult.rows[0].referrals_count;
      rewardTier = updateResult.rows[0].reward_tier;

    } else {
      // مستخدم جديد - إنشاء سجل جديد
      
      // توليد كود إحالة فريد
      userRefCode = await generateUniqueRefCode(async (code) => {
        const result = await query(
          'SELECT ref_code FROM waitlist_signups WHERE ref_code = $1',
          [code]
        );
        return result.rows.length > 0;
      });

      // إدراج المستخدم الجديد
      const insertResult = await query(
        `INSERT INTO waitlist_signups (email, name, city, phone, ref_code, referred_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, ref_code, referrals_count, reward_tier`,
        [
          email.toLowerCase().trim(),
          name?.trim() || null,
          city?.trim() || null,
          phone?.trim() || null,
          userRefCode,
          validReferredBy
        ]
      );

      const newUser = insertResult.rows[0];
      userRefCode = newUser.ref_code;
      referralsCount = newUser.referrals_count;
      rewardTier = newUser.reward_tier;

      // إذا كان هناك كود إحالة، تحديث عداد الإحالات
      if (validReferredBy) {
        await query('SELECT bump_referrals($1)', [validReferredBy]);
        
        // تسجيل حدث referral_signup
        await query(
          `INSERT INTO events (event_name, event_props, user_agent, path)
           VALUES ($1, $2, $3, $4)`,
          [
            'referral_signup',
            JSON.stringify({ ref_code: validReferredBy, new_user_email: email }),
            req.headers['user-agent'] || null,
            req.headers['referer'] || null
          ]
        );
      }

      // تسجيل حدث waitlist_submit
      await query(
        `INSERT INTO events (event_name, event_props, user_agent, path)
         VALUES ($1, $2, $3, $4)`,
        [
          'waitlist_submit',
          JSON.stringify({ email, has_referral: !!validReferredBy }),
          req.headers['user-agent'] || null,
          req.headers['referer'] || null
        ]
      );
    }

    // إرجاع النتيجة
    return res.status(200).json({
      ok: true,
      refCode: userRefCode,
      stats: {
        referralsCount,
        rewardTier
      },
      message: existingUser.rows.length > 0 ? 'Profile updated' : 'Successfully registered'
    });

  } catch (error) {
    console.error('❌ Error in waitlist registration:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
}

