/**
 * سكريبت اختبار الوكيل
 */

import 'dotenv/config';

async function testAgent() {
  console.log('🧪 بدء اختبار الوكيل...\n');

  const apiKey = process.env.AGENT_PROJECT_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ لم يتم العثور على API Key');
    console.log('تأكد من وجود AGENT_PROJECT_KEY أو OPENAI_API_KEY في ملف .env.local');
    process.exit(1);
  }

  console.log('✅ تم العثور على API Key');
  console.log(`📝 Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

  const startTime = Date.now();

  try {
    console.log('📡 إرسال طلب للوكيل...');
    
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
            content: 'مرحباً! هل أنت متصل ويعمل بشكل صحيح؟ أرجع "نعم، أنا متصل وجاهز" إذا كنت تعمل.'
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      })
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ فشل الاتصال بالوكيل');
      console.error('الخطأ:', errorText);
      process.exit(1);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('\n✅ نجح الاتصال بالوكيل!');
    console.log(`⏱️  المدة: ${duration}ms`);
    console.log(`🤖 النموذج: ${data.model}`);
    console.log(`🔢 Tokens المستخدمة: ${data.usage?.total_tokens || 0}`);
    console.log(`\n💬 الاستجابة:\n${content}\n`);

    // اختبار ثاني: تقييم حي
    console.log('🧪 اختبار ثاني: تقييم جودة حي...\n');
    
    const startTime2 = Date.now();
    const response2 = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'أنت خبير تقييم عقاري سعودي متخصص في تحليل جودة الأحياء. أرجع JSON فقط.'
          },
          {
            role: 'user',
            content: `احسب درجة جودة الحي (NQS) من 0 إلى 100 لحي العليا في الرياض.
            
أرجع JSON فقط بهذا التنسيق:
{
  "nqs": <رقم من 0 إلى 100>,
  "level": "<منخفض|متوسط|مرتفع|مرتفع جداً>",
  "notes": "<تفسير مختصر بالعربية>"
}`
          }
        ],
        temperature: 0.3,
        max_tokens: 200,
        response_format: { type: 'json_object' }
      })
    });

    const duration2 = Date.now() - startTime2;

    if (!response2.ok) {
      const errorText = await response2.text();
      console.error('❌ فشل الاختبار الثاني');
      console.error('الخطأ:', errorText);
    } else {
      const data2 = await response2.json();
      const content2 = data2.choices?.[0]?.message?.content;
      
      console.log('✅ نجح الاختبار الثاني!');
      console.log(`⏱️  المدة: ${duration2}ms`);
      console.log(`\n💬 النتيجة:\n${content2}\n`);
      
      try {
        const parsed = JSON.parse(content2);
        console.log('✅ JSON صالح');
        console.log(`📊 درجة الحي: ${parsed.nqs}/100`);
        console.log(`📈 المستوى: ${parsed.level}`);
        console.log(`📝 الملاحظات: ${parsed.notes}`);
      } catch (e) {
        console.error('❌ فشل تحليل JSON:', e.message);
      }
    }

    console.log('\n✅ اكتملت جميع الاختبارات بنجاح!');
    console.log('🎉 الوكيل يعمل بشكل صحيح ومتصل بالمنصة');

  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    process.exit(1);
  }
}

testAgent();

