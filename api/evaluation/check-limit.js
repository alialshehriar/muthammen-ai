/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Check Evaluation Limit API - check-limit.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Check if user/visitor can create more evaluations
 * 
 * Usage: POST /api/evaluation/check-limit
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { visitorId, userEmail } = req.body;

    // Check if user is registered
    if (userEmail) {
      // Check registered user limits
      const userResult = await query(
        'SELECT evaluation_count, max_evaluations FROM users WHERE email = $1',
        [userEmail]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        const canEvaluate = user.evaluation_count < user.max_evaluations;
        
        return res.status(200).json({
          success: true,
          canEvaluate: canEvaluate,
          evaluationCount: user.evaluation_count,
          maxEvaluations: user.max_evaluations,
          remainingEvaluations: Math.max(0, user.max_evaluations - user.evaluation_count),
          isRegistered: true
        });
      }
    }

    // Check visitor limits
    if (visitorId) {
      // Count evaluations for this visitor
      const evaluationResult = await query(
        'SELECT COUNT(*) as count FROM evaluations WHERE visitor_id = $1',
        [visitorId]
      );

      const count = parseInt(evaluationResult.rows[0].count);
      const maxEvaluations = 1; // Visitors get only 1 evaluation
      const canEvaluate = count < maxEvaluations;

      return res.status(200).json({
        success: true,
        canEvaluate: canEvaluate,
        evaluationCount: count,
        maxEvaluations: maxEvaluations,
        remainingEvaluations: Math.max(0, maxEvaluations - count),
        isRegistered: false,
        message: canEvaluate ? null : 'لقد استخدمت تقييمك المجاني. سجّل للحصول على 3 تقييمات إضافية!'
      });
    }

    // No visitor ID or email provided
    return res.status(400).json({
      success: false,
      error: 'يجب توفير معرف الزائر أو البريد الإلكتروني'
    });

  } catch (error) {
    console.error('❌ Error checking evaluation limit:', error);
    
    return res.status(500).json({ 
      success: false,
      error: 'حدث خطأ أثناء التحقق من حد التقييمات',
      message: error.message
    });
  }
}

