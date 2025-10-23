/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API قائمة الانتظار للوحة الإدارة - waitlist.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function لإدارة قائمة الانتظار
 * 
 * الاستخدام:
 * - GET /api/admin/waitlist - جلب جميع المسجلين في قائمة الانتظار
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get all waitlist signups with statistics
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

    // Calculate statistics
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as today,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as week,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as month,
        SUM(referrals_count) as total_referrals,
        AVG(referrals_count) as avg_referrals
      FROM waitlist_signups
    `);

    const stats = statsResult.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        entries: result.rows,
        stats: {
          total: parseInt(stats.total),
          today: parseInt(stats.today),
          week: parseInt(stats.week),
          month: parseInt(stats.month),
          total_referrals: parseInt(stats.total_referrals || 0),
          avg_referrals: parseFloat(stats.avg_referrals || 0).toFixed(2)
        }
      },
      timestamp: new Date().toISOString()
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

