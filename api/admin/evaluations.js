/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API التقييمات للوحة الإدارة - evaluations.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function للحصول على جميع التقييمات
 * 
 * الاستخدام: GET /api/admin/evaluations?limit=50&offset=0
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  // السماح بـ GET فقط
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { limit = 50, offset = 0, city, minValue, maxValue } = req.query;

    // Build WHERE clause
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (city) {
      conditions.push(`city = $${paramIndex++}`);
      params.push(city);
    }

    if (minValue) {
      conditions.push(`estimated_value >= $${paramIndex++}`);
      params.push(parseFloat(minValue));
    }

    if (maxValue) {
      conditions.push(`estimated_value <= $${paramIndex++}`);
      params.push(parseFloat(maxValue));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM evaluations ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get evaluations
    const evaluationsResult = await query(
      `SELECT 
        id,
        city,
        district,
        property_type,
        area,
        built_area,
        age,
        condition,
        estimated_value,
        min_value,
        max_value,
        confidence,
        analysis,
        recommendations,
        source,
        used_agent,
        created_at
      FROM evaluations
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    // Get statistics
    const statsResult = await query(
      `SELECT 
        COUNT(*) as total_evaluations,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as evaluations_this_week,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as evaluations_this_month,
        AVG(estimated_value) as avg_value,
        MIN(estimated_value) as min_value,
        MAX(estimated_value) as max_value,
        AVG(confidence) as avg_confidence
      FROM evaluations`
    );

    // Get city distribution
    const citiesResult = await query(
      `SELECT 
        city,
        COUNT(*) as count,
        AVG(estimated_value) as avg_value
      FROM evaluations
      GROUP BY city
      ORDER BY count DESC
      LIMIT 10`
    );

    // Get property type distribution
    const typesResult = await query(
      `SELECT 
        property_type,
        COUNT(*) as count,
        AVG(estimated_value) as avg_value
      FROM evaluations
      WHERE property_type IS NOT NULL
      GROUP BY property_type
      ORDER BY count DESC`
    );

    // Get daily activity (last 7 days)
    const dailyActivityResult = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        AVG(estimated_value) as avg_value
      FROM evaluations
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC`
    );

    return res.status(200).json({
      success: true,
      data: {
        evaluations: evaluationsResult.rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: {
          total: parseInt(statsResult.rows[0].total_evaluations),
          thisWeek: parseInt(statsResult.rows[0].evaluations_this_week),
          thisMonth: parseInt(statsResult.rows[0].evaluations_this_month),
          avgValue: parseFloat(statsResult.rows[0].avg_value || 0).toFixed(2),
          minValue: parseFloat(statsResult.rows[0].min_value || 0).toFixed(2),
          maxValue: parseFloat(statsResult.rows[0].max_value || 0).toFixed(2),
          avgConfidence: parseFloat(statsResult.rows[0].avg_confidence || 0).toFixed(2)
        },
        cities: citiesResult.rows,
        propertyTypes: typesResult.rows,
        dailyActivity: dailyActivityResult.rows
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch evaluations',
      details: error.message
    });
  }
}

