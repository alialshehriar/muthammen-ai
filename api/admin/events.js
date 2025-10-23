/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API الأحداث للوحة الإدارة - events.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function للحصول على جميع الأحداث
 * 
 * الاستخدام: GET /api/admin/events?limit=100&offset=0
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  // السماح بـ GET فقط
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { limit = 100, offset = 0, type, user_id } = req.query;

    // Build WHERE clause
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (type) {
      conditions.push(`event_type = $${paramIndex++}`);
      params.push(type);
    }

    if (user_id) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(user_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM events ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get events
    const eventsResult = await query(
      `SELECT 
        id,
        event_type,
        event_data,
        user_id,
        session_id,
        ip_address,
        user_agent,
        created_at
      FROM events
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    // Get event type statistics
    const statsResult = await query(
      `SELECT 
        event_type,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as last_24h,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as last_7d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as last_30d
      FROM events
      GROUP BY event_type
      ORDER BY count DESC`
    );

    // Get daily activity (last 7 days)
    const dailyActivityResult = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM events
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC`
    );

    // Get hourly activity (last 24 hours)
    const hourlyActivityResult = await query(
      `SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        COUNT(*) as count
      FROM events
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY hour ASC`
    );

    return res.status(200).json({
      success: true,
      data: {
        events: eventsResult.rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: statsResult.rows,
        dailyActivity: dailyActivityResult.rows,
        hourlyActivity: hourlyActivityResult.rows
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      details: error.message
    });
  }
}

