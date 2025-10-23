/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API سجل اختبارات الوكيل - logs.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function للحصول على سجل اختبارات واستجابات الوكيل
 * 
 * المدخل: { limit?: number }
 * المخرج: { success: true, logs: [...], stats: {...} }
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  // السماح بـ GET فقط
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit) || 50;

    // الحصول على آخر السجلات
    const logsResult = await query(
      `SELECT 
        id,
        event_name,
        event_props,
        created_at
      FROM events
      WHERE event_name = 'agent_test'
      ORDER BY created_at DESC
      LIMIT $1`,
      [limit]
    );

    // حساب الإحصائيات
    const statsResult = await query(
      `SELECT 
        COUNT(*) as total_tests,
        COUNT(*) FILTER (WHERE event_props->>'status' = 'success') as successful_tests,
        COUNT(*) FILTER (WHERE event_props->>'status' = 'failed') as failed_tests,
        COUNT(*) FILTER (WHERE event_props->>'status' = 'error') as error_tests,
        AVG((event_props->>'duration')::numeric) as avg_duration,
        MAX(created_at) as last_test_time
      FROM events
      WHERE event_name = 'agent_test'`
    );

    const stats = statsResult.rows[0] || {
      total_tests: 0,
      successful_tests: 0,
      failed_tests: 0,
      error_tests: 0,
      avg_duration: 0,
      last_test_time: null
    };

    // حساب نسبة النجاح
    const successRate = stats.total_tests > 0 
      ? ((stats.successful_tests / stats.total_tests) * 100).toFixed(2)
      : 0;

    // تنسيق السجلات
    const logs = logsResult.rows.map(row => ({
      id: row.id,
      status: row.event_props.status,
      response: row.event_props.response?.substring(0, 200) || null,
      error: row.event_props.error?.substring(0, 200) || null,
      duration: row.event_props.duration,
      model: row.event_props.model,
      tokensUsed: row.event_props.tokensUsed,
      timestamp: row.created_at
    }));

    // إرجاع النتيجة
    return res.status(200).json({
      success: true,
      logs,
      stats: {
        totalTests: parseInt(stats.total_tests),
        successfulTests: parseInt(stats.successful_tests),
        failedTests: parseInt(stats.failed_tests),
        errorTests: parseInt(stats.error_tests),
        successRate: parseFloat(successRate),
        avgDuration: Math.round(parseFloat(stats.avg_duration) || 0),
        lastTestTime: stats.last_test_time,
        status: stats.successful_tests > 0 ? 'operational' : 'down'
      }
    });

  } catch (error) {
    console.error('Error fetching agent logs:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch logs',
      details: error.message
    });
  }
}

