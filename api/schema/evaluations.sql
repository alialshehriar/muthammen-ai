-- جدول التقييمات العقارية
CREATE TABLE IF NOT EXISTS evaluations (
  id SERIAL PRIMARY KEY,
  
  -- معلومات العقار الأساسية
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  property_type VARCHAR(50),
  area DECIMAL(10, 2),
  built_area DECIMAL(10, 2),
  age VARCHAR(50),
  condition VARCHAR(50),
  
  -- تفاصيل العقار
  floors INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  living_rooms INTEGER,
  majlis INTEGER,
  finishing_type VARCHAR(50),
  view_type VARCHAR(50),
  direction VARCHAR(50),
  street_width VARCHAR(50),
  street_type VARCHAR(50),
  facades_count INTEGER,
  is_corner BOOLEAN DEFAULT FALSE,
  
  -- الموقع
  distance_to_services VARCHAR(50),
  distance_to_schools VARCHAR(50),
  distance_to_hospitals VARCHAR(50),
  distance_to_malls VARCHAR(50),
  public_transport VARCHAR(50),
  
  -- المرافق
  has_parking BOOLEAN DEFAULT FALSE,
  parking_spaces INTEGER,
  has_elevator BOOLEAN DEFAULT FALSE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_garden BOOLEAN DEFAULT FALSE,
  has_maid_room BOOLEAN DEFAULT FALSE,
  has_driver_room BOOLEAN DEFAULT FALSE,
  has_storage BOOLEAN DEFAULT FALSE,
  has_ac BOOLEAN DEFAULT FALSE,
  has_kitchen BOOLEAN DEFAULT FALSE,
  
  -- نتائج التقييم
  estimated_value DECIMAL(15, 2),
  min_value DECIMAL(15, 2),
  max_value DECIMAL(15, 2),
  confidence INTEGER,
  
  -- التحليل (JSON)
  analysis JSONB,
  recommendations JSONB,
  
  -- معلومات إضافية
  source VARCHAR(50) DEFAULT 'gpt',
  used_agent BOOLEAN DEFAULT TRUE,
  
  -- معلومات المستخدم (اختياري)
  user_email VARCHAR(255),
  user_id INTEGER,
  
  -- التوقيت
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_evaluations_city ON evaluations(city);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_email ON evaluations(user_email);

-- فهرس للبحث في JSON
CREATE INDEX IF NOT EXISTS idx_evaluations_analysis ON evaluations USING GIN (analysis);

