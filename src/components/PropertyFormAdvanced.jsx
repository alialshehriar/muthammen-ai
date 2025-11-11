import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2 } from 'lucide-react';

export default function PropertyFormAdvanced({ onSubmit, isLoading }) {
  // استخدام useRef للحصول على القيم مباشرة من DOM
  const formRef = useRef(null);
  
  // استخدام useState لحفظ البيانات عند التنقل بين التبويبات
  const [formData, setFormData] = useState({});
  
  // دالة لتحديث البيانات
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue;
    
    // Handle different input types
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      // Convert to number, or keep empty string if invalid
      newValue = value === '' ? '' : Number(value);
    } else {
      newValue = value;
    }
    
    console.log(`🔄 تحديث حقل: ${name} = ${newValue} (type: ${type})`);
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      console.log('📊 بيانات النموذج المحدثة:', updated);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // جمع البيانات مباشرة من DOM لضمان الحصول على أحدث القيم
    const form = formRef.current;
    const formElements = form.elements;
    
    const collectedData = {};
    
    // جمع جميع الحقول من النموذج
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.name) {
        console.log(`🔧 Processing element: name="${element.name}", type="${element.type}", value="${element.value}"`);
        if (element.type === 'checkbox') {
          collectedData[element.name] = element.checked;
          console.log(`✅ Added ${element.name} (checkbox):`, collectedData[element.name]);
        } else if (element.type === 'number') {
          collectedData[element.name] = element.value === '' ? '' : Number(element.value);
          console.log(`✅ Added ${element.name} (number):`, collectedData[element.name]);
        } else if (element.value) {
          console.log(`🎯 About to add ${element.name} with value:`, element.value);
          collectedData[element.name] = element.value;
          console.log(`✅ Added ${element.name} (value):`, collectedData[element.name]);
          console.log(`📦 collectedData after adding ${element.name}:`, JSON.stringify(collectedData));
        }
      }
    }
    
    console.log('📤 إرسال بيانات النموذج المتقدم (من DOM):', collectedData);
    
    // Validation
    if (!collectedData.city) {
      alert('يرجى اختيار المدينة');
      return;
    }
    
    if (!collectedData.propertyType) {
      alert('يرجى اختيار نوع العقار');
      return;
    }
    
    if (!collectedData.area) {
      alert('يرجى إدخال مساحة الأرض');
      return;
    }
    
    onSubmit(collectedData);
  };

  const cities = [
    'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'الطائف',
    'أبها', 'تبوك', 'الخبر', 'القطيف', 'حائل', 'جازان', 'نجران', 'الباحة',
    'عرعر', 'سكاكا', 'ينبع', 'الجبيل', 'الأحساء', 'القصيم'
  ];

  const propertyTypes = [
    'فيلا', 'شقة', 'دوبلكس', 'عمارة سكنية', 'أرض', 'محل تجاري',
    'مكتب', 'مستودع', 'مزرعة', 'استراحة'
  ];

  const propertyAges = [
    'جديد', '1-3 سنوات', '3-5 سنوات', '5-10 سنوات',
    '10-15 سنة', '15-20 سنة', 'أكثر من 20 سنة'
  ];

  const conditions = [
    'ممتاز', 'جيد جداً', 'جيد', 'متوسط', 'يحتاج صيانة', 'يحتاج ترميم'
  ];

  const finishingTypes = [
    'فاخر', 'سوبر ديلوكس', 'ديلوكس', 'عادي', 'بدون تشطيب'
  ];

  const views = [
    'شارع', 'حديقة', 'بحر', 'جبل', 'مدينة', 'داخلية'
  ];

  const directions = [
    'شمال', 'جنوب', 'شرق', 'غرب', 'شمال شرقي', 'شمال غربي', 'جنوب شرقي', 'جنوب غربي'
  ];

  const streetWidths = [
    '10 متر', '15 متر', '20 متر', '30 متر', '40 متر', 'أكثر من 40 متر'
  ];

  const streetTypes = [
    'رئيسي', 'فرعي', 'تجاري', 'سكني'
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>نموذج التقييم المتقدم</CardTitle>
          <CardDescription>
            املأ أكبر قدر ممكن من المعلومات للحصول على تقييم دقيق وشامل بناءً على 50+ متغير
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">أساسي</TabsTrigger>
              <TabsTrigger value="details">تفاصيل</TabsTrigger>
              <TabsTrigger value="location">موقع</TabsTrigger>
              <TabsTrigger value="facilities">مرافق</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة *</Label>
                  <select
                    id="city"
                    name="city"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    required
                    onChange={handleChange} value={formData.city || ""}
                  >
                    <option value="">اختر المدينة</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">الحي</Label>
                  <Input
                    id="district"
                    name="district"
                    placeholder="مثال: الياسمين"
                    onChange={handleChange} value={formData.district || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">نوع العقار *</Label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    required
                    onChange={handleChange} value={formData.propertyType || ""}
                  >
                    <option value="">اختر نوع العقار</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">مساحة الأرض (م²) *</Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    placeholder="300"
                    required
                    onChange={handleChange} value={formData.area || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="builtArea">مساحة البناء (م²)</Label>
                  <Input
                    id="builtArea"
                    name="builtArea"
                    type="number"
                    placeholder="250"
                    onChange={handleChange} value={formData.builtArea || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">عمر العقار</Label>
                  <select
                    id="age"
                    name="age"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    onChange={handleChange} value={formData.age || ""}
                  >
                    <option value="">اختر عمر العقار</option>
                    {propertyAges.map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">حالة العقار</Label>
                  <select
                    id="condition"
                    name="condition"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    onChange={handleChange} value={formData.condition || ""}
                  >
                    <option value="">اختر الحالة</option>
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floors">عدد الأدوار</Label>
                  <Input
                    id="floors"
                    name="floors"
                    type="number"
                    placeholder="2"
                    onChange={handleChange} value={formData.floors || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">عدد غرف النوم</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    placeholder="4"
                    onChange={handleChange} value={formData.bedrooms || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">عدد دورات المياه</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    placeholder="3"
                    onChange={handleChange} value={formData.bathrooms || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livingRooms">عدد غرف المعيشة</Label>
                  <Input
                    id="livingRooms"
                    name="livingRooms"
                    type="number"
                    placeholder="2"
                    onChange={handleChange} value={formData.livingRooms || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="majlis">عدد المجالس</Label>
                  <Input
                    id="majlis"
                    name="majlis"
                    type="number"
                    placeholder="1"
                    onChange={handleChange} value={formData.majlis || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finishing">نوع التشطيب</Label>
                  <select
                    id="finishing"
                    name="finishing"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    onChange={handleChange} value={formData.finishing || ""}
                  >
                    <option value="">اختر نوع التشطيب</option>
                    {finishingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="view">الإطلالة</Label>
                  <select
                    id="view"
                    name="view"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    onChange={handleChange} value={formData.view || ""}
                  >
                    <option value="">اختر الإطلالة</option>
                    {views.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direction">الاتجاه</Label>
                  <select
                    id="direction"
                    name="direction"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    onChange={handleChange} value={formData.direction || ""}
                  >
                    <option value="">اختر الاتجاه</option>
                    {directions.map(dir => (
                      <option key={dir} value={dir}>{dir}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetWidth">عرض الشارع</Label>
                  <select
                    id="streetWidth"
                    name="streetWidth"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    onChange={handleChange} value={formData.streetWidth || ""}
                  >
                    <option value="">اختر عرض الشارع</option>
                    {streetWidths.map(width => (
                      <option key={width} value={width}>{width}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetType">نوع الشارع</Label>
                  <select
                    id="streetType"
                    name="streetType"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    onChange={handleChange} value={formData.streetType || ""}
                  >
                    <option value="">اختر نوع الشارع</option>
                    {streetTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facades">عدد الواجهات</Label>
                  <Input
                    id="facades"
                    name="facades"
                    type="number"
                    defaultValue="1"
                    min="1"
                    max="4"
                    onChange={handleChange} value={formData.facades || ""}
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-6">
                  <input
                    type="checkbox"
                    id="corner"
                    name="corner"
                    className="w-4 h-4" onChange={handleChange} checked={formData.corner || false} />
                  <Label htmlFor="corner">زاوية</Label>
                </div>
              </div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distanceToMosque">المسافة من المسجد (متر)</Label>
                  <Input
                    id="distanceToMosque"
                    name="distanceToMosque"
                    type="number"
                    placeholder="100"
                    onChange={handleChange} value={formData.distanceToMosque || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToSchool">المسافة من المدرسة (متر)</Label>
                  <Input
                    id="distanceToSchool"
                    name="distanceToSchool"
                    type="number"
                    placeholder="500"
                    onChange={handleChange} value={formData.distanceToSchool || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToHospital">المسافة من المستشفى (كم)</Label>
                  <Input
                    id="distanceToHospital"
                    name="distanceToHospital"
                    type="number"
                    placeholder="2"
                    onChange={handleChange} value={formData.distanceToHospital || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToMall">المسافة من المول (كم)</Label>
                  <Input
                    id="distanceToMall"
                    name="distanceToMall"
                    type="number"
                    placeholder="3"
                    onChange={handleChange} value={formData.distanceToMall || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToMetro">المسافة من المترو (كم)</Label>
                  <Input
                    id="distanceToMetro"
                    name="distanceToMetro"
                    type="number"
                    placeholder="1.5"
                    onChange={handleChange} value={formData.distanceToMetro || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToMainRoad">المسافة من الطريق الرئيسي (متر)</Label>
                  <Input
                    id="distanceToMainRoad"
                    name="distanceToMainRoad"
                    type="number"
                    placeholder="200"
                    onChange={handleChange} value={formData.distanceToMainRoad || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToVision2030">المسافة من مشاريع رؤية 2030 (كم)</Label>
                  <Input
                    id="distanceToVision2030"
                    name="distanceToVision2030"
                    type="number"
                    placeholder="5"
                    onChange={handleChange} value={formData.distanceToVision2030 || ""}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Facilities Tab */}
            <TabsContent value="facilities" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parking">عدد مواقف السيارات</Label>
                  <Input
                    id="parking"
                    name="parking"
                    type="number"
                    placeholder="2"
                    onChange={handleChange} value={formData.parking || ""}
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-6">
                  <input
                    type="checkbox"
                    id="elevator"
                    name="elevator"
                    className="w-4 h-4" onChange={handleChange} checked={formData.elevator || false} />
                  <Label htmlFor="elevator">مصعد</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-6">
                  <input
                    type="checkbox"
                    id="pool"
                    name="pool"
                    className="w-4 h-4" onChange={handleChange} checked={formData.pool || false} />
                  <Label htmlFor="pool">مسبح</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-6">
                  <input
                    type="checkbox"
                    id="garden"
                    name="garden"
                    className="w-4 h-4" onChange={handleChange} checked={formData.garden || false} />
                  <Label htmlFor="garden">حديقة</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-6">
                  <input
                    type="checkbox"
                    id="maidRoom"
                    name="maidRoom"
                    className="w-4 h-4" onChange={handleChange} checked={formData.maidRoom || false} />
                  <Label htmlFor="maidRoom">غرفة خادمة</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-6">
                  <input
                    type="checkbox"
                    id="driverRoom"
                    name="driverRoom"
                    className="w-4 h-4" onChange={handleChange} checked={formData.driverRoom || false} />
                  <Label htmlFor="driverRoom">غرفة سائق</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-6">
                  <input
                    type="checkbox"
                    id="externalMajlis"
                    name="externalMajlis"
                    className="w-4 h-4" onChange={handleChange} checked={formData.externalMajlis || false} />
                  <Label htmlFor="externalMajlis">مجلس خارجي</Label>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[100px]"
                    placeholder="أي معلومات إضافية تود إضافتها..."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التقييم...
                </>
              ) : (
                'احصل على تقييم أدق من المثمن البشري'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

