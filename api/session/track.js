/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Session Tracking API - track.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Tracks visitor sessions and evaluation limits
 * 
 * Usage: POST /api/session/track
 */

import { query } from '../db.js';
import { generateVisitorId, generateSessionId } from '../utils/refCode.js';

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
    const { visitorId, sessionId, referralCode } = req.body;
    
    // Get IP and user agent from request
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    let finalVisitorId = visitorId;
    let finalSessionId = sessionId;

    // Generate new IDs if not provided
    if (!finalVisitorId) {
      finalVisitorId = generateVisitorId();
    }
    
    if (!finalSessionId) {
      finalSessionId = generateSessionId();
    }

    // Check if visitor session exists
    const existingSession = await query(
      'SELECT * FROM visitor_sessions WHERE visitor_id = $1',
      [finalVisitorId]
    );

    let sessionData;

    if (existingSession.rows.length > 0) {
      // Update existing session
      sessionData = existingSession.rows[0];
      
      // Update session ID and timestamp
      await query(
        `UPDATE visitor_sessions 
         SET session_id = $1, updated_at = CURRENT_TIMESTAMP, ip_address = $2, user_agent = $3
         WHERE visitor_id = $4`,
        [finalSessionId, ipAddress, userAgent, finalVisitorId]
      );
    } else {
      // Create new visitor session
      const result = await query(
        `INSERT INTO visitor_sessions (visitor_id, session_id, ip_address, user_agent)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [finalVisitorId, finalSessionId, ipAddress, userAgent]
      );
      
      sessionData = result.rows[0];
    }

    // Get evaluation count for this visitor
    const evaluationCount = await query(
      'SELECT COUNT(*) as count FROM evaluations WHERE visitor_id = $1',
      [finalVisitorId]
    );

    const count = parseInt(evaluationCount.rows[0].count);
    const maxEvaluations = sessionData.max_evaluations || 1;
    const canEvaluate = count < maxEvaluations;

    // Return session info
    return res.status(200).json({
      success: true,
      session: {
        visitorId: finalVisitorId,
        sessionId: finalSessionId,
        evaluationCount: count,
        maxEvaluations: maxEvaluations,
        canEvaluate: canEvaluate,
        remainingEvaluations: Math.max(0, maxEvaluations - count),
        referralCode: referralCode || null
      }
    });

  } catch (error) {
    console.error('❌ Error tracking session:', error);
    
    return res.status(500).json({ 
      success: false,
      error: 'حدث خطأ أثناء تتبع الجلسة',
      message: error.message
    });
  }
}

