/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API الحسابات الموحد للوحة الإدارة - accounts.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function لإدارة جميع الحسابات (waitlist + users)
 * 
 * الاستخدام:
 * - GET /api/admin/accounts - جلب جميع الحسابات
 * - POST /api/admin/accounts - إنشاء حساب جديد
 * - PUT /api/admin/accounts - تحديث حساب
 * - DELETE /api/admin/accounts - حذف حساب
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await getAccounts(req, res);
      case 'POST':
        return await createAccount(req, res);
      case 'PUT':
        return await updateAccount(req, res);
      case 'DELETE':
        return await deleteAccount(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in accounts API:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}

// جلب جميع الحسابات (waitlist + users)
async function getAccounts(req, res) {
  const { limit = 100, offset = 0, search, type, status } = req.query;

  try {
    // Get waitlist accounts
    const waitlistQuery = `
      SELECT 
        'waitlist' as account_type,
        id,
        email,
        phone,
        name,
        city,
        ref_code as referral_code,
        referred_by,
        referrals_count,
        reward_tier,
        created_at,
        NULL as last_login,
        'active' as status,
        (SELECT COUNT(*) FROM evaluations WHERE evaluations.visitor_id = waitlist_signups.id::text) as total_evaluations
      FROM waitlist_signups
      ${search ? `WHERE email ILIKE $1 OR phone ILIKE $1 OR name ILIKE $1` : ''}
      ORDER BY created_at DESC
    `;

    // Get registered users
    const usersQuery = `
      SELECT 
        'user' as account_type,
        id,
        email,
        phone,
        name,
        NULL as city,
        referral_code,
        referred_by,
        0 as referrals_count,
        NULL as reward_tier,
        created_at,
        last_login,
        status,
        (SELECT COUNT(*) FROM evaluations WHERE evaluations.user_id = users.id) as total_evaluations
      FROM users
      ${search ? `WHERE email ILIKE $1 OR phone ILIKE $1 OR name ILIKE $1` : ''}
      ORDER BY created_at DESC
    `;

    const searchParam = search ? [`%${search}%`] : [];

    const [waitlistResult, usersResult] = await Promise.all([
      query(waitlistQuery, searchParam),
      query(usersQuery, searchParam)
    ]);

    // Combine and sort by created_at
    let allAccounts = [
      ...waitlistResult.rows,
      ...usersResult.rows
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Filter by type if specified
    if (type) {
      allAccounts = allAccounts.filter(acc => acc.account_type === type);
    }

    // Filter by status if specified
    if (status) {
      allAccounts = allAccounts.filter(acc => acc.status === status);
    }

    // Get statistics
    const totalWaitlist = waitlistResult.rows.length;
    const totalUsers = usersResult.rows.length;
    const totalAccounts = totalWaitlist + totalUsers;

    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM waitlist_signups) as total_waitlist,
        (SELECT COUNT(*) FROM waitlist_signups WHERE created_at >= NOW() - INTERVAL '24 hours') as waitlist_today,
        (SELECT COUNT(*) FROM waitlist_signups WHERE created_at >= NOW() - INTERVAL '7 days') as waitlist_week,
        (SELECT COUNT(*) FROM waitlist_signups WHERE created_at >= NOW() - INTERVAL '30 days') as waitlist_month,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '24 hours') as users_today,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days') as users_week,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') as users_month,
        (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
        (SELECT COUNT(*) FROM users WHERE status = 'suspended') as suspended_users,
        (SELECT COUNT(*) FROM users WHERE last_login >= NOW() - INTERVAL '24 hours') as active_today,
        (SELECT COUNT(*) FROM evaluations) as total_evaluations,
        (SELECT AVG(estimated_value) FROM evaluations) as avg_evaluation_value,
        (SELECT SUM(referrals_count) FROM waitlist_signups) as total_referrals
    `);

    const stats = statsResult.rows[0];

    // Enhanced statistics
    const enhancedStats = {
      overview: {
        total_accounts: parseInt(stats.total_waitlist) + parseInt(stats.total_users),
        total_waitlist: parseInt(stats.total_waitlist),
        total_users: parseInt(stats.total_users),
        active_users: parseInt(stats.active_users),
        suspended_users: parseInt(stats.suspended_users),
        conversion_rate: stats.total_waitlist > 0 
          ? ((parseInt(stats.total_users) / parseInt(stats.total_waitlist)) * 100).toFixed(2) 
          : 0
      },
      growth: {
        today: {
          waitlist: parseInt(stats.waitlist_today),
          users: parseInt(stats.users_today),
          total: parseInt(stats.waitlist_today) + parseInt(stats.users_today)
        },
        week: {
          waitlist: parseInt(stats.waitlist_week),
          users: parseInt(stats.users_week),
          total: parseInt(stats.waitlist_week) + parseInt(stats.users_week)
        },
        month: {
          waitlist: parseInt(stats.waitlist_month),
          users: parseInt(stats.users_month),
          total: parseInt(stats.waitlist_month) + parseInt(stats.users_month)
        }
      },
      engagement: {
        active_today: parseInt(stats.active_today),
        total_evaluations: parseInt(stats.total_evaluations),
        avg_evaluation_value: parseFloat(stats.avg_evaluation_value || 0),
        total_referrals: parseInt(stats.total_referrals || 0),
        avg_evaluations_per_user: stats.total_users > 0 
          ? (parseInt(stats.total_evaluations) / parseInt(stats.total_users)).toFixed(2)
          : 0
      }
    };

    // Pagination
    const paginatedAccounts = allAccounts.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    return res.status(200).json({
      success: true,
      data: {
        accounts: paginatedAccounts,
        pagination: {
          total: allAccounts.length,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(allAccounts.length / parseInt(limit))
        },
        stats: enhancedStats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch accounts',
      details: error.message
    });
  }
}

// إنشاء حساب جديد
async function createAccount(req, res) {
  const { email, phone, name, type = 'user' } = req.body;

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      error: 'Email or phone is required'
    });
  }

  try {
    if (type === 'waitlist') {
      // Create waitlist account
      const refCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const result = await query(
        `INSERT INTO waitlist_signups (email, phone, name, ref_code)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [email, phone, name, refCode]
      );
      return res.status(201).json({
        success: true,
        data: { ...result.rows[0], account_type: 'waitlist' },
        message: 'Waitlist account created successfully'
      });
    } else {
      // Create user account
      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const result = await query(
        `INSERT INTO users (email, phone, name, referral_code, status)
         VALUES ($1, $2, $3, $4, 'active')
         RETURNING *`,
        [email, phone, name, referralCode]
      );
      return res.status(201).json({
        success: true,
        data: { ...result.rows[0], account_type: 'user' },
        message: 'User account created successfully'
      });
    }
  } catch (error) {
    console.error('Error creating account:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create account',
      details: error.message
    });
  }
}

// تحديث حساب
async function updateAccount(req, res) {
  const { id, type, email, phone, name, status } = req.body;

  if (!id || !type) {
    return res.status(400).json({
      success: false,
      error: 'Account ID and type are required'
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
    if (status !== undefined && type === 'user') {
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
    const table = type === 'waitlist' ? 'waitlist_signups' : 'users';
    
    const result = await query(
      `UPDATE ${table} 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: { ...result.rows[0], account_type: type },
      message: 'Account updated successfully'
    });

  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update account',
      details: error.message
    });
  }
}

// حذف حساب
async function deleteAccount(req, res) {
  const { id, type } = req.query;

  if (!id || !type) {
    return res.status(400).json({
      success: false,
      error: 'Account ID and type are required'
    });
  }

  try {
    const table = type === 'waitlist' ? 'waitlist_signups' : 'users';
    const result = await query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete account',
      details: error.message
    });
  }
}

