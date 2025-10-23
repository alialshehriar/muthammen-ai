/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Evaluation Share API - share.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Get evaluation by share token and track referral
 * 
 * Usage: GET /api/evaluation/share?token=xxx&ref=xxx
 */

import { query } from '../db.js';
import { isValidShareToken, isValidRefCode } from '../utils/refCode.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, ref } = req.query;

    // Validate token
    if (!token || !isValidShareToken(token)) {
      return res.status(400).json({
        success: false,
        error: 'رمز المشاركة غير صالح'
      });
    }

    // Get evaluation by share token
    const result = await query(
      `SELECT 
        id, city, district, property_type, area, built_area, age, condition,
        estimated_value, min_value, max_value, confidence,
        analysis, recommendations, referral_code, created_at
       FROM evaluations 
       WHERE share_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'التقييم غير موجود'
      });
    }

    const evaluation = result.rows[0];

    // Track referral if ref code is provided and valid
    if (ref && isValidRefCode(ref)) {
      // Store referral code in cookie or session for later use
      // This will be used when the user registers or creates an evaluation
      res.setHeader('Set-Cookie', `ref=${ref}; Path=/; Max-Age=2592000; SameSite=Lax`); // 30 days
    }

    // Return evaluation data
    return res.status(200).json({
      success: true,
      evaluation: {
        id: evaluation.id,
        city: evaluation.city,
        district: evaluation.district,
        propertyType: evaluation.property_type,
        area: evaluation.area,
        builtArea: evaluation.built_area,
        age: evaluation.age,
        condition: evaluation.condition,
        estimatedValue: evaluation.estimated_value,
        priceRange: {
          min: evaluation.min_value,
          max: evaluation.max_value
        },
        confidence: evaluation.confidence,
        analysis: evaluation.analysis,
        recommendations: evaluation.recommendations,
        referralCode: evaluation.referral_code,
        createdAt: evaluation.created_at,
        shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://muthammen.com'}/share/${token}${ref ? `?ref=${ref}` : ''}`
      }
    });

  } catch (error) {
    console.error('❌ Error getting shared evaluation:', error);
    
    return res.status(500).json({ 
      success: false,
      error: 'حدث خطأ أثناء جلب التقييم',
      message: error.message
    });
  }
}

