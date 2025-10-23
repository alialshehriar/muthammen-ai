/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API اختبارات الصحة - health.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function لاختبار صحة النظام بالكامل
 * 
 * الاختبارات:
 * 1. Database Connection - الاتصال بقاعدة البيانات
 * 2. AI Agent - وكيل الذكاء الاصطناعي
 * 3. API Endpoints - نقاط النهاية الرئيسية
 * 4. Environment Variables - متغيرات البيئة
 * 
 * المخرج: { success: true, tests: {...}, summary: {...} }
 */

import { query } from './db.js';

export default async function handler(req, res) {
  const startTime = Date.now();
  const tests = {
    database: { status: 'pending', message: '', duration: 0 },
    agent: { status: 'pending', message: '', duration: 0 },
    env: { status: 'pending', message: '', duration: 0 },
    tables: { status: 'pending', message: '', duration: 0 }
  };

  // 1. اختبار قاعدة البيانات
  try {
    const dbStart = Date.now();
    const result = await query('SELECT NOW() as current_time');
    tests.database.duration = Date.now() - dbStart;
    
    if (result.rows && result.rows.length > 0) {
      tests.database.status = 'success';
      tests.database.message = `Connected successfully (${tests.database.duration}ms)`;
    } else {
      tests.database.status = 'failed';
      tests.database.message = 'No response from database';
    }
  } catch (error) {
    tests.database.status = 'error';
    tests.database.message = error.message;
  }

  // 2. اختبار الجداول
  try {
    const tablesStart = Date.now();
    const tables = ['waitlist_signups', 'referral_clicks', 'events'];
    const tableChecks = [];

    for (const table of tables) {
      try {
        const result = await query(`SELECT COUNT(*) as count FROM ${table}`);
        tableChecks.push({
          table,
          status: 'success',
          count: parseInt(result.rows[0].count)
        });
      } catch (error) {
        tableChecks.push({
          table,
          status: 'error',
          error: error.message
        });
      }
    }

    tests.tables.duration = Date.now() - tablesStart;
    const allSuccess = tableChecks.every(t => t.status === 'success');
    
    if (allSuccess) {
      tests.tables.status = 'success';
      tests.tables.message = `All tables accessible`;
      tests.tables.details = tableChecks;
    } else {
      tests.tables.status = 'failed';
      tests.tables.message = 'Some tables are not accessible';
      tests.tables.details = tableChecks;
    }
  } catch (error) {
    tests.tables.status = 'error';
    tests.tables.message = error.message;
  }

  // 3. اختبار وكيل الذكاء الاصطناعي
  try {
    const agentStart = Date.now();
    const apiKey = process.env.AGENT_PROJECT_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      tests.agent.status = 'failed';
      tests.agent.message = 'API Key not found';
    } else {
      // اختبار بسيط للوكيل
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'user', content: 'Test' }
          ],
          max_tokens: 5
        })
      });

      tests.agent.duration = Date.now() - agentStart;

      if (response.ok) {
        const data = await response.json();
        tests.agent.status = 'success';
        tests.agent.message = `Agent operational (${tests.agent.duration}ms)`;
        tests.agent.model = data.model;
      } else {
        const errorText = await response.text();
        tests.agent.status = 'failed';
        tests.agent.message = `Agent error: ${response.status}`;
        tests.agent.error = errorText.substring(0, 200);
      }
    }
  } catch (error) {
    tests.agent.status = 'error';
    tests.agent.message = error.message;
  }

  // 4. اختبار متغيرات البيئة
  try {
    const envStart = Date.now();
    const requiredEnvs = [
      'DATABASE_URL',
      'SITE_URL'
    ];
    
    const optionalEnvs = [
      'AGENT_PROJECT_KEY',
      'OPENAI_API_KEY',
      'ADMIN_PASS'
    ];

    const envChecks = {
      required: [],
      optional: []
    };

    // فحص المتغيرات المطلوبة
    for (const env of requiredEnvs) {
      envChecks.required.push({
        name: env,
        status: process.env[env] ? 'found' : 'missing'
      });
    }

    // فحص المتغيرات الاختيارية
    for (const env of optionalEnvs) {
      envChecks.optional.push({
        name: env,
        status: process.env[env] ? 'found' : 'missing'
      });
    }

    tests.env.duration = Date.now() - envStart;
    const allRequiredFound = envChecks.required.every(e => e.status === 'found');
    
    if (allRequiredFound) {
      tests.env.status = 'success';
      tests.env.message = 'All required environment variables found';
      tests.env.details = envChecks;
    } else {
      tests.env.status = 'failed';
      tests.env.message = 'Some required environment variables are missing';
      tests.env.details = envChecks;
    }
  } catch (error) {
    tests.env.status = 'error';
    tests.env.message = error.message;
  }

  // الملخص
  const totalDuration = Date.now() - startTime;
  const successCount = Object.values(tests).filter(t => t.status === 'success').length;
  const failedCount = Object.values(tests).filter(t => t.status === 'failed').length;
  const errorCount = Object.values(tests).filter(t => t.status === 'error').length;
  const totalTests = Object.keys(tests).length;

  const summary = {
    total: totalTests,
    success: successCount,
    failed: failedCount,
    error: errorCount,
    duration: totalDuration,
    status: failedCount === 0 && errorCount === 0 ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString()
  };

  return res.status(200).json({
    success: true,
    tests,
    summary
  });
}

