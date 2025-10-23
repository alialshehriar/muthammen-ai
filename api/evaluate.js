import OpenAI from 'openai';
import { query } from './db.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
});

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
    const formData = req.body;
    
    console.log('📥 Received evaluation request:', formData);

    // Validate required fields
    if (!formData.area || !formData.city) {
      return res.status(400).json({ 
        error: 'المساحة والمدينة مطلوبة',
        message: 'Area and city are required fields'
      });
    }

    // Build comprehensive prompt
    const systemPrompt = `أنت مُثمّن - خبير تقييم عقاري معتمد متخصص في السوق السعودي.

مهمتك: تقديم تقييم عقاري دقيق وشامل ومفصل يتضمن:

1. **القيمة التقديرية** للعقار بالريال السعودي
2. **نطاق السعر** (الحد الأدنى والأعلى)
3. **مستوى الثقة** في التقييم (%)
4. **تحليل شامل** يتضمن:
   - ملخص التقييم
   - العوامل الرئيسية المؤثرة (5-7 عوامل)
   - نقاط القوة (5-7 نقاط)
   - نقاط الضعف (3-5 نقاط)
   - الفرص المستقبلية (3-5 نقاط)
   - التهديدات المحتملة (2-4 نقاط)
   - اتجاه السوق (صاعد/مستقر/هابط)
5. **التوصيات العملية** (5-7 توصيات)
6. **التعديلات المطبقة** مع النسب المئوية

**مهم جداً**:
- استخدم أرقام محددة ودقيقة
- قدم أمثلة واقعية من السوق
- اشرح كل خطوة في التقييم
- اذكر المصادر والبيانات الداعمة
- كن شاملاً ومفصلاً (1000-1500 كلمة)

**بيانات السوق السعودي 2025**:
- الرياض: متوسط سعر المتر 7000-9000 ريال (حسب الحي)
- جدة: متوسط سعر المتر 6000-8000 ريال
- الدمام/الخبر: متوسط سعر المتر 5000-7000 ريال
- النمو السنوي: 5-8% في المناطق الحيوية
- تأثير رؤية 2030: إيجابي جداً على المناطق القريبة من المشاريع الكبرى

**صيغة الرد**:
قدم ردك بصيغة منظمة تحتوي على الأقسام التالية:

## القيمة التقديرية
[القيمة بالريال]

## نطاق السعر
الحد الأدنى: [القيمة]
الحد الأعلى: [القيمة]

## مستوى الثقة
[النسبة المئوية]%

## ملخص التقييم
[ملخص شامل 200-300 كلمة]

## العوامل الرئيسية المؤثرة
1. [العامل الأول]: [التأثير] - [الوصف]
2. [العامل الثاني]: [التأثير] - [الوصف]
...

## نقاط القوة
- [نقطة القوة الأولى مع التفاصيل]
- [نقطة القوة الثانية مع التفاصيل]
...

## نقاط الضعف
- [نقطة الضعف الأولى مع التفاصيل]
- [نقطة الضعف الثانية مع التفاصيل]
...

## الفرص المستقبلية
- [الفرصة الأولى مع التفاصيل]
- [الفرصة الثانية مع التفاصيل]
...

## التهديدات المحتملة
- [التهديد الأول مع التفاصيل]
- [التهديد الثاني مع التفاصيل]
...

## اتجاه السوق
[صاعد/مستقر/هابط] - [التفسير]

## التوصيات
1. [التوصية الأولى مع التفاصيل]
2. [التوصية الثانية مع التفاصيل]
...`;

    const userPrompt = `أريد تقييماً عقارياً شاملاً ومفصلاً للعقار التالي:

### المعلومات الأساسية:
- **المدينة**: ${formData.city}
- **الحي**: ${formData.district || 'غير محدد'}
- **نوع العقار**: ${formData.propertyType || 'غير محدد'}
- **مساحة الأرض**: ${formData.area} م²
- **مساحة البناء**: ${formData.builtArea || 'غير محدد'} م²
- **عمر العقار**: ${formData.age || 'غير محدد'}
- **حالة العقار**: ${formData.condition || 'غير محدد'}

### التفاصيل الإضافية:
${formData.floors ? `- **عدد الطوابق**: ${formData.floors}` : ''}
${formData.bedrooms ? `- **عدد الغرف**: ${formData.bedrooms}` : ''}
${formData.bathrooms ? `- **عدد الحمامات**: ${formData.bathrooms}` : ''}
${formData.finishing ? `- **نوع التشطيب**: ${formData.finishing}` : ''}
${formData.view ? `- **الإطلالة**: ${formData.view}` : ''}
${formData.direction ? `- **الاتجاه**: ${formData.direction}` : ''}
${formData.streetWidth ? `- **عرض الشارع**: ${formData.streetWidth}` : ''}
${formData.parking ? `- **مواقف السيارات**: ${formData.parking}` : ''}

### المرافق:
${formData.elevator ? '- يوجد مصعد' : ''}
${formData.pool ? '- يوجد حمام سباحة' : ''}
${formData.garden ? '- يوجد حديقة' : ''}
${formData.maidRoom ? '- يوجد غرفة خادمة' : ''}

${formData.notes ? `### ملاحظات إضافية:\n${formData.notes}` : ''}

---

قدم تقييماً شاملاً ومفصلاً باللغة العربية.`;

    console.log('🤖 Calling OpenAI API...');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('✅ OpenAI response received (length:', aiResponse.length, 'chars)');

    // Parse the AI response to extract structured data
    const evaluation = parseAIResponse(aiResponse, formData);

    // Save evaluation to database
    try {
      await saveEvaluationToDatabase(formData, evaluation);
      console.log('✅ Evaluation saved to database');
    } catch (dbError) {
      console.error('❌ Failed to save evaluation to database:', dbError);
      // Continue anyway - don't fail the request if DB save fails
    }

    // Return the result
    return res.status(200).json(evaluation);

  } catch (error) {
    console.error('❌ Error in evaluation:', error);
    
    return res.status(500).json({ 
      error: 'حدث خطأ أثناء التقييم',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

function parseAIResponse(aiResponse, formData) {
  // Extract structured data from AI response
  let estimatedValue = 0;
  let confidence = 85;
  let priceRange = { min: 0, max: 0 };

  // Try to find price mentions in the response
  const priceRegex = /(\d{1,3}(?:[,،]\d{3})*(?:\.\d+)?)\s*ريال/g;
  const prices = [];
  let match;

  while ((match = priceRegex.exec(aiResponse)) !== null) {
    const priceStr = match[1].replace(/[,،]/g, '');
    const price = parseFloat(priceStr);
    if (price > 100000 && price < 100000000) {
      prices.push(price);
    }
  }

  if (prices.length > 0) {
    estimatedValue = prices[0];
    priceRange.min = Math.round(estimatedValue * 0.92);
    priceRange.max = Math.round(estimatedValue * 1.08);
  } else {
    // Fallback calculation
    const basePrice = calculateBasePrice(formData);
    estimatedValue = basePrice;
    priceRange.min = Math.round(basePrice * 0.92);
    priceRange.max = Math.round(basePrice * 1.08);
  }

  // Extract confidence level
  const confidenceMatch = aiResponse.match(/مستوى الثقة[:\s]*(\d+)%/);
  if (confidenceMatch) {
    confidence = parseInt(confidenceMatch[1]);
  }

  // Extract sections
  const summary = extractSection(aiResponse, 'ملخص التقييم') || aiResponse.substring(0, 500) + '...';
  const keyFactors = extractKeyFactors(aiResponse);
  const strengths = extractListItems(aiResponse, 'نقاط القوة');
  const weaknesses = extractListItems(aiResponse, 'نقاط الضعف');
  const opportunities = extractListItems(aiResponse, 'الفرص');
  const threats = extractListItems(aiResponse, 'التهديدات');
  const recommendations = extractListItems(aiResponse, 'التوصيات');
  const marketTrend = extractMarketTrend(aiResponse);

  return {
    estimatedValue,
    priceRange,
    confidence,
    analysis: {
      summary,
      keyFactors: keyFactors.length > 0 ? keyFactors : [
        { factor: 'الموقع', impact: 'مرتفع', description: 'موقع العقار في ' + formData.city },
        { factor: 'المساحة', impact: 'متوسط', description: 'مساحة الأرض ' + formData.area + ' م²' },
      ],
      strengths: strengths.length > 0 ? strengths : ['موقع ممتاز', 'مساحة مناسبة'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['يحتاج تقييم ميداني'],
      opportunities: opportunities.length > 0 ? opportunities : ['إمكانية التطوير'],
      threats: threats.length > 0 ? threats : ['تقلبات السوق'],
      marketTrend: marketTrend || 'مستقر',
      fullReport: aiResponse,
    },
    recommendations: recommendations.length > 0 ? recommendations : ['يُنصح بزيارة ميدانية'],
    adjustments: {
      appliedFactors: keyFactors.slice(0, 5).map((f, i) => ({
        factor: f.factor,
        impact: f.impact,
        percentage: 5 + i,
      })),
    },
    source: 'gpt-4o',
    usedAgent: true,
    timestamp: new Date().toISOString(),
  };
}

function calculateBasePrice(formData) {
  const cityPrices = {
    'الرياض': 8000,
    'جدة': 7000,
    'الدمام': 6000,
    'الخبر': 6500,
    'مكة المكرمة': 9000,
    'المدينة المنورة': 8500,
    'الطائف': 6500,
    'أبها': 5500,
    'تبوك': 5000,
  };

  const pricePerSqm = cityPrices[formData.city] || 7000;
  const area = parseFloat(formData.area) || 300;

  return Math.round(area * pricePerSqm);
}

function extractSection(text, sectionName) {
  const regex = new RegExp(`##\\s*${sectionName}[^#]*?([\\s\\S]*?)(?=##|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function extractListItems(text, sectionName) {
  const items = [];
  const regex = new RegExp(`##\\s*${sectionName}[^#]*?([\\s\\S]*?)(?=##|$)`, 'i');
  const match = text.match(regex);

  if (match) {
    const section = match[1];
    const lines = section.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        const item = trimmed.substring(1).trim();
        if (item && item.length > 5) {
          items.push(item);
        }
      } else if (/^\d+\./.test(trimmed)) {
        const item = trimmed.replace(/^\d+\.\s*/, '').trim();
        if (item && item.length > 5) {
          items.push(item);
        }
      }
    }
  }

  return items.slice(0, 7);
}

function extractKeyFactors(text) {
  const factors = [];
  const factorSection = extractSection(text, 'العوامل الرئيسية المؤثرة');
  
  if (factorSection) {
    const lines = factorSection.split('\n');
    for (const line of lines) {
      const match = line.match(/(\d+)\.\s*([^:]+):\s*([^-]+)\s*-\s*(.+)/);
      if (match) {
        factors.push({
          factor: match[2].trim(),
          impact: match[3].trim(),
          description: match[4].trim(),
        });
      }
    }
  }

  return factors;
}

function extractMarketTrend(text) {
  const trendMatch = text.match(/##\s*اتجاه السوق[^#]*?([\\s\\S]*?)(?=##|$)/i);
  if (trendMatch) {
    const trendText = trendMatch[1].trim();
    if (trendText.includes('صاعد')) return 'صاعد';
    if (trendText.includes('هابط')) return 'هابط';
    return 'مستقر';
  }
  return 'مستقر';
}

async function saveEvaluationToDatabase(formData, evaluation) {
  const sql = `
    INSERT INTO evaluations (
      city, district, property_type, area, built_area, age, condition,
      floors, bedrooms, bathrooms, living_rooms, majlis,
      finishing_type, view_type, direction, street_width, street_type,
      facades_count, is_corner,
      distance_to_services, distance_to_schools, distance_to_hospitals,
      distance_to_malls, public_transport,
      has_parking, parking_spaces, has_elevator, has_pool, has_garden,
      has_maid_room, has_driver_room, has_storage, has_ac, has_kitchen,
      estimated_value, min_value, max_value, confidence,
      analysis, recommendations,
      source, used_agent
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17,
      $18, $19,
      $20, $21, $22, $23, $24,
      $25, $26, $27, $28, $29,
      $30, $31, $32, $33, $34,
      $35, $36, $37, $38,
      $39, $40,
      $41, $42
    )
    RETURNING id
  `;

  const values = [
    formData.city,
    formData.district,
    formData.propertyType,
    parseFloat(formData.area) || null,
    parseFloat(formData.builtArea) || null,
    formData.age,
    formData.condition,
    parseInt(formData.floors) || null,
    parseInt(formData.bedrooms) || null,
    parseInt(formData.bathrooms) || null,
    parseInt(formData.livingRooms) || null,
    parseInt(formData.majlis) || null,
    formData.finishingType,
    formData.viewType,
    formData.direction,
    formData.streetWidth,
    formData.streetType,
    parseInt(formData.facadesCount) || null,
    formData.isCorner === 'true' || formData.isCorner === true,
    formData.distanceToServices,
    formData.distanceToSchools,
    formData.distanceToHospitals,
    formData.distanceToMalls,
    formData.publicTransport,
    formData.parking === 'true' || formData.parking === true,
    parseInt(formData.parkingSpaces) || null,
    formData.elevator === 'true' || formData.elevator === true,
    formData.pool === 'true' || formData.pool === true,
    formData.garden === 'true' || formData.garden === true,
    formData.maidRoom === 'true' || formData.maidRoom === true,
    formData.driverRoom === 'true' || formData.driverRoom === true,
    formData.storage === 'true' || formData.storage === true,
    formData.ac === 'true' || formData.ac === true,
    formData.kitchen === 'true' || formData.kitchen === true,
    evaluation.estimatedValue,
    evaluation.priceRange.min,
    evaluation.priceRange.max,
    evaluation.confidence,
    JSON.stringify(evaluation.analysis),
    JSON.stringify(evaluation.recommendations),
    evaluation.source,
    evaluation.usedAgent
  ];

  const result = await query(sql, values);
  return result.rows[0];
}

