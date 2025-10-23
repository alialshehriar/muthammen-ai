/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API المستخدمين للوحة الإدارة - users.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function لإدارة المستخدمين
 * 
 * الاستخدام:
 * - GET /api/admin/users - جلب جميع المستخدمين
 * - POST /api/admin/users - إنشاء مستخدم جديد
 * - PUT /api/admin/users/:id - تحديث مستخدم
 * - DELETE /api/admin/users/:id - حذف مستخدم
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await getUsers(req, res);
      case 'POST':
        return await createUser(req, res);
      case 'PUT':
        return await updateUser(req, res);
      case 'DELETE':
        return await deleteUser(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in users API:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}

// جلب جميع المستخدمين
async function getUsers(req, res) {
  const { limit = 100, offset = 0, search, status } = req.query;

  try {
    // Build WHERE clause
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR name ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get users with stats
    const usersResult = await query(
      `SELECT 
        u.id,
        u.email,
        u.phone,
        u.name,
        u.referral_code,
        u.referred_by,
        u.status,
        u.created_at,
        u.last_login,
        COUNT(DISTINCT e.id) as total_evaluations,
        COUNT(DISTINCT r.id) as total_referrals,
        0 as total_points
      FROM users u
      LEFT JOIN evaluations e ON e.user_id = u.id
      LEFT JOIN users r ON r.referred_by = u.referral_code
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    // Get statistics
    const statsResult = await query(
      `SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as new_today,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_this_week,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_this_month,
        COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '24 hours') as active_today,
        COUNT(*) FILTER (WHERE status = 'active') as active_users,
        COUNT(*) FILTER (WHERE status = 'suspended') as suspended_users
      FROM users`
    );

    return res.status(200).json({
      success: true,
      data: {
        users: usersResult.rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: statsResult.rows[0]
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
}

// إنشاء مستخدم جديد
async function createUser(req, res) {
  const { email, phone, name, password } = req.body;

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      error: 'Email or phone is required'
    });
  }

  try {
    // Generate unique referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const result = await query(
      `INSERT INTO users (email, phone, name, password_hash, referral_code, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, email, phone, name, referral_code, created_at`,
      [email, phone, name, password || null, referralCode]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message
    });
  }
}

// تحديث مستخدم
async function updateUser(req, res) {
  const { id } = req.query;
  const { email, phone, name, status } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'User ID is required'
    });
  }

  try {
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      params.push(phone);
    }
    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      params.push(name);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    params.push(id);
    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, email, phone, name, status, updated_at`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    });
  }
}

// حذف مستخدم
async function deleteUser(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'User ID is required'
    });
  }

  try {
    const result = await query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
}

