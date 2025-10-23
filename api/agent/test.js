/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API اختبار الوكيل - test.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serverless Function لاختبار اتصال وكيل الذكاء الاصطناعي
 * 
 * المدخل: { testMessage?: string }
 * المخرج: { success: true, response, duration, timestamp } أو { success: false, error }
 */

import { query } from '../db.js';

export default async function handler(req, res) {
  // السماح بـ GET و POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    // قراءة المفتاح من البيئة
    const apiKey = process.env.AGENT_PROJECT_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ No API key configured');
      return res.status(200).json({ 
        success: false, 
        error: 'Agent not configured - No API key found',
        timestamp: new Date().toISOString()
      });
    }

    // رسالة الاختبار
    const testMessage = req.body?.testMessage || req.query?.testMessage || 
      'مرحباً! هل أنت متصل ويعمل بشكل صحيح؟ أرجع "نعم، أنا متصل وجاهز" إذا كنت تعمل.';

    // الاتصال بالوكيل
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'أنت وكيل ذكاء اصطناعي لمنصة مُثمّن العقارية. أجب بإيجاز واحترافية.'
          },
          {
            role: 'user',
            content: testMessage
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      })
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Agent API error:', errorText);
      
      // حفظ الفشل في قاعدة البيانات
      try {
        await query(
          `INSERT INTO events (event_name, event_props) VALUES ($1, $2)`,
          [
            'agent_test',
            JSON.stringify({
              status: 'failed',
              error: errorText.substring(0, 500),
              duration,
              timestamp: new Date().toISOString()
            })
          ]
        );
      } catch (dbError) {
        console.error('Failed to log error to database:', dbError);
      }
      
      return res.status(200).json({ 
        success: false, 
        error: 'Agent request failed',
        details: errorText.substring(0, 200),
        duration,
        timestamp: new Date().toISOString()
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(200).json({ 
        success: false, 
        error: 'No response from agent',
        duration,
        timestamp: new Date().toISOString()
      });
    }

    // حفظ النجاح في قاعدة البيانات
    try {
      await query(
        `INSERT INTO events (event_name, event_props) VALUES ($1, $2)`,
        [
          'agent_test',
          JSON.stringify({
            status: 'success',
            response: content.substring(0, 500),
            duration,
            model: data.model,
            tokensUsed: data.usage?.total_tokens || 0,
            timestamp: new Date().toISOString()
          })
        ]
      );
    } catch (dbError) {
      console.error('Failed to log success to database:', dbError);
    }

    // إرجاع النتيجة
    return res.status(200).json({
      success: true,
      response: content,
      duration,
      model: data.model,
      tokensUsed: data.usage?.total_tokens || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Unexpected error in agent test:', error);
    
    // حفظ الخطأ في قاعدة البيانات
    try {
      await query(
        `INSERT INTO events (event_name, event_props) VALUES ($1, $2)`,
        [
          'agent_test',
          JSON.stringify({
            status: 'error',
            error: error.message,
            duration,
            timestamp: new Date().toISOString()
          })
        ]
      );
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }
    
    return res.status(200).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message,
      duration,
      timestamp: new Date().toISOString()
    });
  }
}

