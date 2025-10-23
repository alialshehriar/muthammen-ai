import OpenAI from 'openai';

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

    // Build the prompt for GPT
    const prompt = `أنت خبير تقييم عقاري في السعودية. قيّم العقار التالي:

المساحة: ${formData.area} م²
المدينة: ${formData.city}
${formData.district ? `الحي: ${formData.district}` : ''}
${formData.propertyType ? `نوع العقار: ${formData.propertyType}` : ''}
${formData.propertyAge ? `عمر العقار: ${formData.propertyAge}` : ''}
${formData.bedrooms ? `عدد الغرف: ${formData.bedrooms}` : ''}
${formData.bathrooms ? `عدد دورات المياه: ${formData.bathrooms}` : ''}
${formData.floors ? `عدد الأدوار: ${formData.floors}` : ''}
${formData.hasGarage ? `يوجد موقف سيارات: ${formData.hasGarage}` : ''}
${formData.hasGarden ? `يوجد حديقة: ${formData.hasGarden}` : ''}
${formData.hasPool ? `يوجد مسبح: ${formData.hasPool}` : ''}
${formData.hasElevator ? `يوجد مصعد: ${formData.hasElevator}` : ''}
${formData.finishing ? `مستوى التشطيب: ${formData.finishing}` : ''}
${formData.view ? `الإطلالة: ${formData.view}` : ''}
${formData.streetWidth ? `عرض الشارع: ${formData.streetWidth}` : ''}
${formData.nearbyServices ? `الخدمات القريبة: ${formData.nearbyServices.join(', ')}` : ''}

أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي، بالشكل التالي:
{
  "estimatedValue": القيمة_التقديرية_بالريال,
  "priceRange": {
    "min": الحد_الأدنى,
    "max": الحد_الأقصى
  },
  "confidence": نسبة_الثقة_من_0_إلى_100,
  "analysis": {
    "summary": "ملخص_التقييم",
    "keyFactors": [
      {"factor": "العامل", "impact": "التأثير", "description": "الوصف"}
    ],
    "strengths": ["نقطة_قوة_1", "نقطة_قوة_2"],
    "weaknesses": ["نقطة_ضعف_1", "نقطة_ضعف_2"],
    "marketTrend": "اتجاه_السوق"
  },
  "recommendations": ["توصية_1", "توصية_2", "توصية_3"],
  "source": "gpt",
  "usedAgent": true
}`;

    console.log('🤖 Calling OpenAI API...');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير تقييم عقاري محترف في السعودية. تقدم تقييمات دقيقة ومفصلة للعقارات بناءً على عوامل السوق المحلية.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0].message.content;
    console.log('✅ OpenAI response:', responseText);

    // Parse the JSON response
    const result = JSON.parse(responseText);

    // Ensure all required fields exist
    if (!result.estimatedValue) {
      throw new Error('Invalid response from OpenAI: missing estimatedValue');
    }

    // Return the result
    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Error in evaluation:', error);
    
    return res.status(500).json({ 
      error: 'حدث خطأ أثناء التقييم',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

