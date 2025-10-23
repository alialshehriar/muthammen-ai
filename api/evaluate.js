import { calculatePropertyValue } from '../src/lib/aiEngine.js';

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

    // Call the AI engine
    const result = await calculatePropertyValue(formData);
    
    console.log('✅ Evaluation result:', result);

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

