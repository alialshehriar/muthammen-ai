/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API تفاصيل المستخدم للوحة الإدارة - user-details.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function لجلب تفاصيل مستخدم كاملة
 * 
 * الاستخدام:
 * - GET /api/admin/user-details?id=123 - جلب تفاصيل مستخدم
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'User ID is required'
    });
  }

  try {
    // Get user basic info
    const userResult = await query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Get user's evaluations
    const evaluationsResult = await query(
      `SELECT 
        id,
        city,
        district,
        property_type,
        area,
        built_area,
        property_age,
        property_condition,
        estimated_value,
        min_value,
        max_value,
        confidence,
        source,
        share_token,
        created_at
      FROM evaluations
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [id]
    );

    // Get user's referrals (people they referred)
    const referralsResult = await query(
      `SELECT 
        id,
        email,
        phone,
        name,
        referral_code,
        created_at,
        last_login,
        status
      FROM users
      WHERE referred_by = $1
      ORDER BY created_at DESC`,
      [user.referral_code]
    );

    // Get user's rewards
    const rewardsResult = await query(
      `SELECT 
        id,
        reward_type,
        points,
        description,
        created_at
      FROM referral_rewards
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [id]
    );

    // Get user's events
    const eventsResult = await query(
      `SELECT 
        id,
        event_type,
        event_data,
        created_at
      FROM events
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 100`,
      [id]
    );

    // Calculate statistics
    const stats = {
      total_evaluations: evaluationsResult.rows.length,
      total_referrals: referralsResult.rows.length,
      total_points: rewardsResult.rows.reduce((sum, r) => sum + parseInt(r.points || 0), 0),
      total_rewards: rewardsResult.rows.length,
      total_events: eventsResult.rows.length,
      avg_evaluation_value: evaluationsResult.rows.length > 0
        ? evaluationsResult.rows.reduce((sum, e) => sum + parseFloat(e.estimated_value || 0), 0) / evaluationsResult.rows.length
        : 0
    };

    return res.status(200).json({
      success: true,
      data: {
        user,
        evaluations: evaluationsResult.rows,
        referrals: referralsResult.rows,
        rewards: rewardsResult.rows,
        events: eventsResult.rows,
        stats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user details',
      details: error.message
    });
  }
}

