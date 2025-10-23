/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API إحصائيات لوحة الإدارة - stats.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function للحصول على إحصائيات شاملة للوحة الإدارة
 * 
 * المخرج: { success: true, stats: {...} }
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  // السماح بـ GET فقط
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // إحصائيات المستخدمين
    const usersResult = await query(
      `SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_week,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_month
      FROM waitlist_signups`
    );

    // إحصائيات الإحالات
    const referralsResult = await query(
      `SELECT 
        COUNT(*) as total_referrals,
        COUNT(DISTINCT referred_by) as active_referrers,
        SUM(referrals_count) as total_referral_count
      FROM waitlist_signups
      WHERE referred_by IS NOT NULL`
    );

    // إحصائيات نقرات الإحالة
    const clicksResult = await query(
      `SELECT 
        COUNT(*) as total_clicks,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as clicks_week
      FROM referral_clicks`
    );

    // إحصائيات الأحداث
    const eventsResult = await query(
      `SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as events_week,
        COUNT(DISTINCT event_name) as unique_event_types
      FROM events`
    );

    // أكثر الأحداث شيوعاً
    const topEventsResult = await query(
      `SELECT 
        event_name,
        COUNT(*) as count
      FROM events
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY event_name
      ORDER BY count DESC
      LIMIT 10`
    );

    // توزيع المستخدمين حسب المدينة
    const citiesResult = await query(
      `SELECT 
        city,
        COUNT(*) as count
      FROM waitlist_signups
      WHERE city IS NOT NULL
      GROUP BY city
      ORDER BY count DESC
      LIMIT 10`
    );

    // توزيع المكافآت
    const rewardsResult = await query(
      `SELECT 
        reward_tier,
        COUNT(*) as count
      FROM waitlist_signups
      GROUP BY reward_tier
      ORDER BY 
        CASE reward_tier
          WHEN 'diamond' THEN 1
          WHEN 'gold' THEN 2
          WHEN 'silver' THEN 3
          WHEN 'bronze' THEN 4
          ELSE 5
        END`
    );

    // أكثر المحيلين نشاطاً
    const topReferrersResult = await query(
      `SELECT 
        email,
        name,
        ref_code,
        referrals_count,
        reward_tier
      FROM waitlist_signups
      WHERE referrals_count > 0
      ORDER BY referrals_count DESC
      LIMIT 10`
    );

    // نشاط المستخدمين الأسبوعي (آخر 7 أيام)
    const weeklyActivityResult = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as signups
      FROM waitlist_signups
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC`
    );

    // معدل التحويل (Clicks → Signups)
    const conversionResult = await query(
      `SELECT 
        (SELECT COUNT(*) FROM waitlist_signups WHERE referred_by IS NOT NULL) as referral_signups,
        (SELECT COUNT(*) FROM referral_clicks) as total_clicks`
    );

    const conversionRate = conversionResult.rows[0].total_clicks > 0
      ? ((conversionResult.rows[0].referral_signups / conversionResult.rows[0].total_clicks) * 100).toFixed(2)
      : 0;

    // إرجاع النتيجة
    return res.status(200).json({
      success: true,
      stats: {
        users: {
          total: parseInt(usersResult.rows[0].total_users),
          newThisWeek: parseInt(usersResult.rows[0].new_users_week),
          newThisMonth: parseInt(usersResult.rows[0].new_users_month)
        },
        referrals: {
          total: parseInt(referralsResult.rows[0].total_referrals),
          activeReferrers: parseInt(referralsResult.rows[0].active_referrers),
          totalReferralCount: parseInt(referralsResult.rows[0].total_referral_count || 0)
        },
        clicks: {
          total: parseInt(clicksResult.rows[0].total_clicks),
          thisWeek: parseInt(clicksResult.rows[0].clicks_week)
        },
        events: {
          total: parseInt(eventsResult.rows[0].total_events),
          thisWeek: parseInt(eventsResult.rows[0].events_week),
          uniqueTypes: parseInt(eventsResult.rows[0].unique_event_types)
        },
        conversion: {
          rate: parseFloat(conversionRate),
          signups: parseInt(conversionResult.rows[0].referral_signups),
          clicks: parseInt(conversionResult.rows[0].total_clicks)
        },
        topEvents: topEventsResult.rows,
        cities: citiesResult.rows,
        rewards: rewardsResult.rows,
        topReferrers: topReferrersResult.rows,
        weeklyActivity: weeklyActivityResult.rows
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch stats',
      details: error.message
    });
  }
}

