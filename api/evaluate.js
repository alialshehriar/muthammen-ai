import OpenAI from 'openai';
import { ADVANCED_SYSTEM_PROMPT, ADVANCED_USER_PROMPT_TEMPLATE } from './advanced_prompt.js';

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

    // Create user prompt from template
    const userPrompt = ADVANCED_USER_PROMPT_TEMPLATE(formData);

    console.log('🤖 Calling OpenAI API with advanced prompt...');

    // Call OpenAI API with advanced prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: ADVANCED_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000, // Increased for detailed response
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('✅ OpenAI response received (length:', aiResponse.length, 'chars)');

    // Parse the AI response to extract structured data
    const evaluation = parseAIResponse(aiResponse, formData);

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
  const lines = aiResponse.split('\n');
  let estimatedValue = 0;
  let confidence = 85;
  let priceRange = { min: 0, max: 0 };

  // Try to find price mentions in the response
  const priceRegex = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*ريال/g;
  const prices = [];
  let match;

  while ((match = priceRegex.exec(aiResponse)) !== null) {
    const price = parseFloat(match[1].replace(/,/g, ''));
    if (price > 100000) {
      // Reasonable property price
      prices.push(price);
    }
  }

  if (prices.length > 0) {
    // Use the first significant price as estimated value
    estimatedValue = prices[0];
    priceRange.min = Math.round(estimatedValue * 0.92);
    priceRange.max = Math.round(estimatedValue * 1.08);
  } else {
    // Fallback calculation if no price found
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

  // Extract sections from the response
  const analysis = extractSection(aiResponse, 'تحليل');
  const strengths = extractListItems(aiResponse, 'نقاط القوة|القوة');
  const weaknesses = extractListItems(aiResponse, 'نقاط الضعف|الضعف');
  const opportunities = extractListItems(aiResponse, 'الفرص');
  const threats = extractListItems(aiResponse, 'التهديدات');
  const recommendations = extractListItems(aiResponse, 'التوصيات');

  return {
    estimatedValue,
    priceRange,
    confidence,
    analysis: {
      summary: analysis || aiResponse.substring(0, 500) + '...',
      keyFactors: extractKeyFactors(aiResponse),
      strengths: strengths.length > 0 ? strengths : ['موقع جيد', 'مساحة مناسبة'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['يحتاج تقييم ميداني'],
      opportunities: opportunities.length > 0 ? opportunities : ['إمكانية التطوير'],
      threats: threats.length > 0 ? threats : ['تقلبات السوق'],
      marketTrend: 'مستقر',
      fullReport: aiResponse, // Include full AI response
    },
    recommendations: recommendations.length > 0 ? recommendations : ['يُنصح بزيارة ميدانية'],
    adjustments: {
      appliedFactors: extractKeyFactors(aiResponse).map(f => ({
        factor: f.factor,
        impact: f.impact,
        percentage: 5,
      })),
    },
    source: 'gpt-4o',
    usedAgent: true,
    timestamp: new Date().toISOString(),
  };
}

function calculateBasePrice(formData) {
  // Fallback calculation based on basic data
  const cityPrices = {
    'الرياض': 8000,
    'جدة': 7500,
    'الدمام': 6000,
    'مكة': 9000,
    'المدينة': 8500,
    'الطائف': 6500,
    'أبها': 5500,
    'تبوك': 5000,
    'الخبر': 7000,
    'القطيف': 6500,
  };

  const pricePerSqm = cityPrices[formData.city] || 7000;
  const area = parseFloat(formData.area) || 300;

  return Math.round(area * pricePerSqm);
}

function extractSection(text, sectionName) {
  const regex = new RegExp(`##\\s*${sectionName}[^#]*?([\\s\\S]*?)(?=##|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim().substring(0, 500) : null;
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
        if (item && item.length > 10) {
          items.push(item);
        }
      } else if (/^\d+\./.test(trimmed)) {
        const item = trimmed.replace(/^\d+\.\s*/, '').trim();
        if (item && item.length > 10) {
          items.push(item);
        }
      }
    }
  }

  return items.slice(0, 7); // Limit to 7 items
}

function extractKeyFactors(text) {
  const factors = [];

  // Look for common factors mentioned
  const factorPatterns = [
    { name: 'الموقع', keywords: ['موقع', 'المنطقة', 'الحي'], impact: 'مرتفع' },
    { name: 'المساحة', keywords: ['مساحة', 'متر'], impact: 'متوسط' },
    { name: 'العمر', keywords: ['عمر', 'سنة', 'سنوات'], impact: 'متوسط' },
    { name: 'الحالة', keywords: ['حالة', 'صيانة', 'تشطيب'], impact: 'متوسط' },
    { name: 'السوق', keywords: ['سوق', 'طلب', 'عرض'], impact: 'مرتفع' },
    { name: 'البنية التحتية', keywords: ['بنية', 'طريق', 'مترو'], impact: 'إيجابي' },
  ];

  for (const factor of factorPatterns) {
    for (const keyword of factor.keywords) {
      if (text.includes(keyword)) {
        factors.push({
          factor: factor.name,
          impact: factor.impact,
          description: `تأثير ${factor.name} على التقييم`,
        });
        break;
      }
    }
  }

  return factors.slice(0, 5);
}

