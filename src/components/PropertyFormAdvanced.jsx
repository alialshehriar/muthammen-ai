import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2 } from 'lucide-react';

export default function PropertyFormAdvanced({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    // Basic Information
    city: '',
    district: '',
    propertyType: '',
    area: '',
    builtArea: '',
    age: '',
    condition: '',
    
    // Detailed Information
    floors: '',
    bedrooms: '',
    bathrooms: '',
    livingRooms: '',
    majlis: '',
    finishing: '',
    view: '',
    direction: '',
    streetWidth: '',
    streetType: '',
    corner: false,
    facades: '1',
    
    // Location Details
    distanceToMosque: '',
    distanceToSchool: '',
    distanceToHospital: '',
    distanceToMall: '',
    distanceToMetro: '',
    distanceToMainRoad: '',
    distanceToVision2030: '',
    
    // Facilities
    parking: '',
    elevator: false,
    pool: false,
    garden: false,
    maidRoom: false,
    driverRoom: false,
    externalMajlis: false,
    
    // Finishing Details
    floorType: '',
    doorType: '',
    windowType: '',
    kitchenType: '',
    bathroomType: '',
    paintType: '',
    decorationType: '',
    acType: '',
    
    // Security & Safety
    securitySystem: '',
    alarmSystem: false,
    fireSystem: false,
    fence: false,
    externalLighting: false,
    
    // Legal Status
    deed: '',
    buildingPermit: false,
    occupancyPermit: false,
    approvedPlan: false,
    disputes: false,
    mortgaged: false,
    
    // Usage & Return
    currentUse: '',
    currentRent: '',
    expectedRent: '',
    
    // Additional Notes
    notes: '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 Submitting advanced form data:', formData);
    onSubmit(formData);
  };

  const cities = [
    'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة',
    'الطائف', 'أبها', 'تبوك', 'الخبر', 'القطيف', 'حائل', 'جازان',
    'نجران', 'الباحة', 'عرعر', 'سكاكا', 'ينبع', 'الجبيل', 'الأحساء', 'القصيم'
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>نموذج التقييم المتقدم</CardTitle>
          <CardDescription>
            املأ أكبر قدر ممكن من المعلومات للحصول على تقييم دقيق وشامل
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
                  <Select value={formData.city} onValueChange={(value) => handleChange('city', value)}>
                    <SelectTrigger id="city">
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">الحي</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    placeholder="مثال: الياسمين"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">نوع العقار *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleChange('propertyType', value)}>
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="اختر نوع العقار" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">مساحة الأرض (م²) *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleChange('area', e.target.value)}
                    placeholder="300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="builtArea">مساحة البناء (م²)</Label>
                  <Input
                    id="builtArea"
                    type="number"
                    value={formData.builtArea}
                    onChange={(e) => handleChange('builtArea', e.target.value)}
                    placeholder="250"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">عمر العقار</Label>
                  <Select value={formData.age} onValueChange={(value) => handleChange('age', value)}>
                    <SelectTrigger id="age">
                      <SelectValue placeholder="اختر عمر العقار" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyAges.map(age => (
                        <SelectItem key={age} value={age}>{age}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">حالة العقار</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleChange('condition', value)}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floors">عدد الطوابق</Label>
                  <Input
                    id="floors"
                    type="number"
                    value={formData.floors}
                    onChange={(e) => handleChange('floors', e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">عدد الغرف</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleChange('bedrooms', e.target.value)}
                    placeholder="4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">عدد الحمامات</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleChange('bathrooms', e.target.value)}
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livingRooms">عدد الصالات</Label>
                  <Input
                    id="livingRooms"
                    type="number"
                    value={formData.livingRooms}
                    onChange={(e) => handleChange('livingRooms', e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="majlis">عدد المجالس</Label>
                  <Input
                    id="majlis"
                    type="number"
                    value={formData.majlis}
                    onChange={(e) => handleChange('majlis', e.target.value)}
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finishing">نوع التشطيب</Label>
                  <Select value={formData.finishing} onValueChange={(value) => handleChange('finishing', value)}>
                    <SelectTrigger id="finishing">
                      <SelectValue placeholder="اختر نوع التشطيب" />
                    </SelectTrigger>
                    <SelectContent>
                      {finishingTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="view">الإطلالة</Label>
                  <Select value={formData.view} onValueChange={(value) => handleChange('view', value)}>
                    <SelectTrigger id="view">
                      <SelectValue placeholder="اختر الإطلالة" />
                    </SelectTrigger>
                    <SelectContent>
                      {views.map(view => (
                        <SelectItem key={view} value={view}>{view}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direction">الاتجاه</Label>
                  <Select value={formData.direction} onValueChange={(value) => handleChange('direction', value)}>
                    <SelectTrigger id="direction">
                      <SelectValue placeholder="اختر الاتجاه" />
                    </SelectTrigger>
                    <SelectContent>
                      {directions.map(dir => (
                        <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetWidth">عرض الشارع</Label>
                  <Select value={formData.streetWidth} onValueChange={(value) => handleChange('streetWidth', value)}>
                    <SelectTrigger id="streetWidth">
                      <SelectValue placeholder="اختر عرض الشارع" />
                    </SelectTrigger>
                    <SelectContent>
                      {streetWidths.map(width => (
                        <SelectItem key={width} value={width}>{width}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetType">نوع الشارع</Label>
                  <Select value={formData.streetType} onValueChange={(value) => handleChange('streetType', value)}>
                    <SelectTrigger id="streetType">
                      <SelectValue placeholder="اختر نوع الشارع" />
                    </SelectTrigger>
                    <SelectContent>
                      {streetTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="corner"
                    checked={formData.corner}
                    onCheckedChange={(checked) => handleChange('corner', checked)}
                  />
                  <Label htmlFor="corner">زاوية</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facades">عدد الواجهات</Label>
                  <Select value={formData.facades} onValueChange={(value) => handleChange('facades', value)}>
                    <SelectTrigger id="facades">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">واجهة واحدة</SelectItem>
                      <SelectItem value="2">واجهتان</SelectItem>
                      <SelectItem value="3">ثلاث واجهات</SelectItem>
                      <SelectItem value="4">أربع واجهات</SelectItem>
                    </SelectContent>
                  </Select>
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
                    type="number"
                    value={formData.distanceToMosque}
                    onChange={(e) => handleChange('distanceToMosque', e.target.value)}
                    placeholder="200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToSchool">المسافة من المدرسة (متر)</Label>
                  <Input
                    id="distanceToSchool"
                    type="number"
                    value={formData.distanceToSchool}
                    onChange={(e) => handleChange('distanceToSchool', e.target.value)}
                    placeholder="500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToHospital">المسافة من المستشفى (كم)</Label>
                  <Input
                    id="distanceToHospital"
                    type="number"
                    value={formData.distanceToHospital}
                    onChange={(e) => handleChange('distanceToHospital', e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToMall">المسافة من المول (كم)</Label>
                  <Input
                    id="distanceToMall"
                    type="number"
                    value={formData.distanceToMall}
                    onChange={(e) => handleChange('distanceToMall', e.target.value)}
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToMetro">المسافة من محطة المترو (كم)</Label>
                  <Input
                    id="distanceToMetro"
                    type="number"
                    value={formData.distanceToMetro}
                    onChange={(e) => handleChange('distanceToMetro', e.target.value)}
                    placeholder="1.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToMainRoad">المسافة من الطريق الرئيسي (متر)</Label>
                  <Input
                    id="distanceToMainRoad"
                    type="number"
                    value={formData.distanceToMainRoad}
                    onChange={(e) => handleChange('distanceToMainRoad', e.target.value)}
                    placeholder="500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceToVision2030">المسافة من مشاريع رؤية 2030 (كم)</Label>
                  <Input
                    id="distanceToVision2030"
                    type="number"
                    value={formData.distanceToVision2030}
                    onChange={(e) => handleChange('distanceToVision2030', e.target.value)}
                    placeholder="15"
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
                    type="number"
                    value={formData.parking}
                    onChange={(e) => handleChange('parking', e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentRent">الإيجار الحالي (ريال/شهر)</Label>
                  <Input
                    id="currentRent"
                    type="number"
                    value={formData.currentRent}
                    onChange={(e) => handleChange('currentRent', e.target.value)}
                    placeholder="3000"
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="elevator"
                    checked={formData.elevator}
                    onCheckedChange={(checked) => handleChange('elevator', checked)}
                  />
                  <Label htmlFor="elevator">مصعد</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="pool"
                    checked={formData.pool}
                    onCheckedChange={(checked) => handleChange('pool', checked)}
                  />
                  <Label htmlFor="pool">مسبح</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="garden"
                    checked={formData.garden}
                    onCheckedChange={(checked) => handleChange('garden', checked)}
                  />
                  <Label htmlFor="garden">حديقة</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="maidRoom"
                    checked={formData.maidRoom}
                    onCheckedChange={(checked) => handleChange('maidRoom', checked)}
                  />
                  <Label htmlFor="maidRoom">غرفة خادمة</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="driverRoom"
                    checked={formData.driverRoom}
                    onCheckedChange={(checked) => handleChange('driverRoom', checked)}
                  />
                  <Label htmlFor="driverRoom">غرفة سائق</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="externalMajlis"
                    checked={formData.externalMajlis}
                    onCheckedChange={(checked) => handleChange('externalMajlis', checked)}
                  />
                  <Label htmlFor="externalMajlis">مجلس خارجي</Label>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="أي معلومات إضافية تود إضافتها..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.city || !formData.area}
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

