import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { 
  Building2, MapPin, Calendar, Home, Ruler, 
  Bed, Bath, Car, Eye, Compass, Paintbrush,
  Sparkles, TrendingUp, CheckCircle2, AlertCircle,
  Loader2, ChevronDown, ChevronUp, Route
} from 'lucide-react';

export default function PropertyForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    amenities: false,
    location: false,
    advanced: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (field, value) => {
    console.log(`📝 تحديث الحقل: ${field} = ${value}`);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('📄 formData الجديد:', newData);
      return newData;
    });
  };

  const handleCheckbox = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // قراءة القيم من DOM مباشرة باستخدام id (أكثر دقة من placeholder)
    const form = e.target;
    const areaInput = form.querySelector('#area');
    const citySelect = form.querySelector('#city');
    const districtInput = form.querySelector('#district');
    
    // دمج القيم من state و DOM
    const finalData = {
      ...formData,
      area: formData.area || (areaInput ? areaInput.value : ''),
      city: formData.city || (citySelect ? citySelect.value : ''),
      district: formData.district || (districtInput ? districtInput.value : '')
    };
    
    // Validation: التحقق من البيانات الأساسية
    if (!finalData.area || !finalData.city) {
      alert('يرجى إدخال المساحة والمدينة على الأقل');
      return;
    }
    
    console.log('📤 إرسال البيانات:', finalData);
    onSubmit(finalData);
  };

  const filledFieldsCount = Object.keys(formData).filter(key => {
    const value = formData[key];
    return value !== undefined && value !== null && value !== '';
  }).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* شريط التقدم */}
      <Card className="p-4 card-gradient">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">مستوى اكتمال البيانات</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {filledFieldsCount} / 100 حقل
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="progress-bar h-full rounded-full"
            style={{ width: `${Math.min((filledFieldsCount / 100) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          كلما أضفت المزيد من التفاصيل، زادت دقة التقييم
        </p>
      </Card>

      {/* القسم 1: البيانات الأساسية */}
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('basic')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg">البيانات الأساسية</h3>
              <p className="text-sm text-muted-foreground">المعلومات المطلوبة للتقييم</p>
            </div>
          </div>
          {expandedSections.basic ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.basic && (
          <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* المساحة */}
            <div className="space-y-2">
              <Label htmlFor="area" className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                المساحة (م²) *
              </Label>
              <Input
                id="area"
                type="number"
                placeholder="مثال: 300"
                value={formData.area || ''}
                onChange={(e) => handleChange('area', e.target.value)}
                className="text-lg"
              />
            </div>

            {/* المدينة */}
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                المدينة *
              </Label>
              <select
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-lg"
              >
                <option value="">اختر المدينة</option>
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="مكة">مكة المكرمة</option>
                <option value="المدينة">المدينة المنورة</option>
                <option value="الدمام">الدمام</option>
                <option value="الخبر">الخبر</option>
                <option value="الظهران">الظهران</option>
                <option value="الطائف">الطائف</option>
                <option value="تبوك">تبوك</option>
                <option value="بريدة">بريدة</option>
                <option value="خميس مشيط">خميس مشيط</option>
                <option value="حائل">حائل</option>
                <option value="نجران">نجران</option>
                <option value="جازان">جازان</option>
                <option value="ينبع">ينبع</option>
                <option value="الأحساء">الأحساء</option>
                <option value="القطيف">القطيف</option>
                <option value="أبها">أبها</option>
                <option value="عرعر">عرعر</option>
                <option value="سكاكا">سكاكا</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            {/* الحي - Required */}
            <div className="space-y-2">
              <Label htmlFor="district" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                الحي *
              </Label>
              <Input
                id="district"
                type="text"
                value={formData.district || ''}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="مثال: الياسمين"
                className="text-lg"
              />
              {!formData.district && (
                <p className="text-xs text-red-500">الحي مطلوب</p>
              )}
            </div>

            {/* نوع العقار */}
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                نوع العقار
              </Label>
              <select
                id="propertyType"
                value={formData.propertyType || ''}
                onChange={(e) => handleChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="">اختر النوع</option>
                <option value="فيلا">فيلا</option>
                <option value="شقة">شقة</option>
                <option value="دور">دور</option>
                <option value="عمارة">عمارة</option>
                <option value="أرض">أرض</option>
                <option value="دوبلكس">دوبلكس</option>
                <option value="استوديو">استوديو</option>
                <option value="بنتهاوس">بنتهاوس</option>
                <option value="تاون هاوس">تاون هاوس</option>
              </select>
            </div>

            {/* عمر العقار */}
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                عمر العقار
              </Label>
              <select
                id="age"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="">اختر العمر</option>
                <option value="جديد">جديد (قيد الإنشاء أو أقل من سنة)</option>
                <option value="1-5">1-5 سنوات</option>
                <option value="6-10">6-10 سنوات</option>
                <option value="11-15">11-15 سنة</option>
                <option value="16-20">16-20 سنة</option>
                <option value="21-30">21-30 سنة</option>
                <option value="أكثر من 30">أكثر من 30 سنة</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* القسم 2: التفاصيل */}
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('details')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg">تفاصيل العقار</h3>
              <p className="text-sm text-muted-foreground">الغرف والمرافق الأساسية</p>
            </div>
          </div>
          {expandedSections.details ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.details && (
          <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* عدد الغرف */}
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="flex items-center gap-2">
                <Bed className="w-4 h-4" />
                عدد الغرف
              </Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="مثال: 4"
                value={formData.bedrooms || ''}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
              />
            </div>

            {/* دورات المياه */}
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="flex items-center gap-2">
                <Bath className="w-4 h-4" />
                دورات المياه
              </Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="مثال: 3"
                value={formData.bathrooms || ''}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
              />
            </div>

            {/* مواقف السيارات */}
            <div className="space-y-2">
              <Label htmlFor="parking" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                مواقف السيارات
              </Label>
              <Input
                id="parking"
                type="number"
                placeholder="مثال: 2"
                value={formData.parking || ''}
                onChange={(e) => handleChange('parking', e.target.value)}
              />
            </div>

            {/* غرف خدم */}
            <div className="space-y-2">
              <Label htmlFor="maidRooms">غرف خدم</Label>
              <Input
                id="maidRooms"
                type="number"
                placeholder="العدد"
                value={formData.maidRooms || ''}
                onChange={(e) => handleChange('maidRooms', e.target.value)}
              />
            </div>

            {/* غرف ضيوف */}
            <div className="space-y-2">
              <Label htmlFor="guestRooms">غرف ضيوف</Label>
              <Input
                id="guestRooms"
                type="number"
                placeholder="العدد"
                value={formData.guestRooms || ''}
                onChange={(e) => handleChange('guestRooms', e.target.value)}
              />
            </div>

            {/* مجالس */}
            <div className="space-y-2">
              <Label htmlFor="majlis">مجالس</Label>
              <Input
                id="majlis"
                type="number"
                placeholder="العدد"
                value={formData.majlis || ''}
                onChange={(e) => handleChange('majlis', e.target.value)}
              />
            </div>

            {/* مطابخ */}
            <div className="space-y-2">
              <Label htmlFor="kitchens">عدد المطابخ</Label>
              <Input
                id="kitchens"
                type="number"
                placeholder="مثال: 1"
                value={formData.kitchens || ''}
                onChange={(e) => handleChange('kitchens', e.target.value)}
              />
            </div>

            {/* مخازن */}
            <div className="space-y-2">
              <Label htmlFor="storage">مخازن</Label>
              <Input
                id="storage"
                type="number"
                placeholder="العدد"
                value={formData.storage || ''}
                onChange={(e) => handleChange('storage', e.target.value)}
              />
            </div>

            {/* شرفات */}
            <div className="space-y-2">
              <Label htmlFor="balconies">شرفات</Label>
              <Input
                id="balconies"
                type="number"
                placeholder="العدد"
                value={formData.balconies || ''}
                onChange={(e) => handleChange('balconies', e.target.value)}
              />
            </div>

            {/* مستوى الحي - تم إزالته: يُحسب تلقائياً بواسطة NQS */}

            {/* التشطيب */}
            <div className="space-y-2">
              <Label htmlFor="finishing" className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4" />
                التشطيب
              </Label>
              <select
                id="finishing"
                value={formData.finishing || ''}
                onChange={(e) => handleChange('finishing', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="">اختر التشطيب</option>
                <option value="سوبر لوكس">سوبر لوكس</option>
                <option value="لوكس">لوكس</option>
                <option value="ممتاز">ممتاز</option>
                <option value="جيد جداً">جيد جداً</option>
                <option value="جيد">جيد</option>
                <option value="متوسط">متوسط</option>
                <option value="بسيط">بسيط</option>
                <option value="على العظم">على العظم</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* القسم 3: المرافق الإضافية */}
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('amenities')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg">المرافق الإضافية</h3>
              <p className="text-sm text-muted-foreground">الميزات والخدمات المتوفرة</p>
            </div>
          </div>
          {expandedSections.amenities ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.amenities && (
          <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'مسبح', label: 'مسبح' },
              { id: 'مصعد', label: 'مصعد' },
              { id: 'مولد_كهرباء', label: 'مولد كهرباء' },
              { id: 'نظام_أمني', label: 'نظام أمني' },
              { id: 'نظام_إطفاء', label: 'نظام إطفاء' },
              { id: 'خزان_ماء', label: 'خزان ماء' },
              { id: 'سخان_مركزي', label: 'سخان مركزي' },
              { id: 'تكييف_مركزي', label: 'تكييف مركزي' },
              { id: 'غرفة_خادمة', label: 'غرفة خادمة' },
              { id: 'غرفة_سائق', label: 'غرفة سائق' },
              { id: 'مجلس_رجال', label: 'مجلس رجال' },
              { id: 'صالة_رياضية', label: 'صالة رياضية' },
              { id: 'ملحق_خارجي', label: 'ملحق خارجي' },
              { id: 'مطبخ_خارجي', label: 'مطبخ خارجي' },
              { id: 'موقف_مظلل', label: 'موقف مظلل' },
              { id: 'حديقة', label: 'حديقة' },
              { id: 'شلال', label: 'شلال' },
              { id: 'نافورة', label: 'نافورة' },
              { id: 'ملعب_أطفال', label: 'ملعب أطفال' },
              { id: 'غرفة_بخار', label: 'غرفة بخار' },
              { id: 'جاكوزي', label: 'جاكوزي' },
              { id: 'مدفأة', label: 'مدفأة' },
              { id: 'مخزن_تحت_الدرج', label: 'مخزن تحت الدرج' },
              { id: 'غرفة_غسيل', label: 'غرفة غسيل' },
              { id: 'مدخل_خاص', label: 'مدخل خاص' }
            ].map(amenity => (
              <label
                key={amenity.id}
                className="flex items-center gap-2 p-3 rounded-lg border border-input hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData[amenity.id] || false}
                  onChange={() => handleCheckbox(amenity.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">{amenity.label}</span>
              </label>
            ))}
          </div>
        )}
      </Card>

      {/* القسم 4: الموقع والمحيط */}
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('location')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg">الموقع والمحيط</h3>
              <p className="text-sm text-muted-foreground">القرب من الخدمات والمرافق</p>
            </div>
          </div>
          {expandedSections.location ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.location && (
          <div className="p-6 pt-0 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'قرب_مسجد', label: 'مسجد قريب' },
                { id: 'قرب_مدرسة', label: 'مدرسة قريبة' },
                { id: 'قرب_مستشفى', label: 'مستشفى قريب' },
                { id: 'قرب_مركز_تجاري', label: 'مركز تجاري' },
                { id: 'قرب_حديقة', label: 'حديقة قريبة' },
                { id: 'قرب_محطة_وقود', label: 'محطة وقود' },
                { id: 'قرب_مواصلات_عامة', label: 'مواصلات عامة' },
                { id: 'قرب_جامعة', label: 'جامعة قريبة' },
                { id: 'قرب_سوبرماركت', label: 'سوبرماركت' },
                { id: 'قرب_مطاعم', label: 'مطاعم قريبة' },
                { id: 'قرب_صيدلية', label: 'صيدلية' },
                { id: 'قرب_بنك', label: 'بنك' },
                { id: 'قرب_صراف_آلي', label: 'صراف آلي' },
                { id: 'قرب_مكتب_بريد', label: 'مكتب بريد' },
                { id: 'قرب_مركز_شرطة', label: 'مركز شرطة' },
                { id: 'قرب_دفاع_مدني', label: 'دفاع مدني' },
                { id: 'قرب_نادي_رياضي', label: 'نادي رياضي' },
                { id: 'قرب_مسبح_عام', label: 'مسبح عام' },
                { id: 'قرب_ملاعب', label: 'ملاعب رياضية' },
                { id: 'قرب_مكتبة', label: 'مكتبة عامة' },
                { id: 'قرب_مسرح', label: 'مسرح/سينما' }
              ].map(service => (
                <label
                  key={service.id}
                  className="flex items-center gap-2 p-3 rounded-lg border border-input hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData[service.id] || false}
                    onChange={() => handleCheckbox(service.id)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{service.label}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الواجهة */}
              <div className="space-y-2">
                <Label htmlFor="facade" className="flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  اتجاه الواجهة
                </Label>
                <select
                  id="facade"
                  value={formData.facade || ''}
                  onChange={(e) => handleChange('facade', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="">اختر الاتجاه</option>
                  <option value="شمالية">شمالية</option>
                  <option value="جنوبية">جنوبية</option>
                  <option value="شرقية">شرقية</option>
                  <option value="غربية">غربية</option>
                  <option value="شمالية شرقية">شمالية شرقية</option>
                  <option value="شمالية غربية">شمالية غربية</option>
                  <option value="جنوبية شرقية">جنوبية شرقية</option>
                  <option value="جنوبية غربية">جنوبية غربية</option>
                  <option value="ثلاث واجهات">ثلاث واجهات</option>
                  <option value="أربع واجهات">أربع واجهات</option>
                </select>
              </div>

              {/* عرض الشارع */}
              <div className="space-y-2">
                <Label htmlFor="streetWidth" className="flex items-center gap-2">
                  <Route className="w-4 h-4" />
                  عرض الشارع
                </Label>
                <select
                  id="streetWidth"
                  value={formData.streetWidth || ''}
                  onChange={(e) => handleChange('streetWidth', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="">اختر العرض</option>
                  <option value="< 10م">أقل من 10 متر</option>
                  <option value="10-15م">10-15 متر</option>
                  <option value="16-20م">16-20 متر</option>
                  <option value="21-30م">21-30 متر</option>
                  <option value="> 30م">أكثر من 30 متر</option>
                </select>
              </div>

              {/* الإطلالة */}
              <div className="space-y-2">
                <Label htmlFor="view" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  الإطلالة
                </Label>
                <select
                  id="view"
                  value={formData.view || ''}
                  onChange={(e) => handleChange('view', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="">اختر الإطلالة</option>
                  <option value="بحر">بحر</option>
                  <option value="جبل">جبل</option>
                  <option value="حديقة">حديقة</option>
                  <option value="شارع رئيسي">شارع رئيسي</option>
                  <option value="شارع فرعي">شارع فرعي</option>
                  <option value="مبنى مقابل">مبنى مقابل</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* القسم 5: تفاصيل متقدمة */}
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('advanced')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg">تفاصيل متقدمة</h3>
              <p className="text-sm text-muted-foreground">معلومات إضافية لدقة أعلى</p>
            </div>
          </div>
          {expandedSections.advanced ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.advanced && (
          <div className="p-6 pt-0 space-y-6">
            {/* أبعاد الأرض */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">أبعاد الأرض والمساحات</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="landArea">مساحة الأرض (م²)</Label>
                  <Input id="landArea" type="number" placeholder="للفلل والعمائر" value={formData.landArea || ''} onChange={(e) => handleChange('landArea', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frontWidth">عرض الواجهة (م)</Label>
                  <Input id="frontWidth" type="number" placeholder="مثال: 15" value={formData.frontWidth || ''} onChange={(e) => handleChange('frontWidth', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">العمق (م)</Label>
                  <Input id="depth" type="number" placeholder="مثال: 20" value={formData.depth || ''} onChange={(e) => handleChange('depth', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yardArea">مساحة الحوش (م²)</Label>
                  <Input id="yardArea" type="number" placeholder="إن وجد" value={formData.yardArea || ''} onChange={(e) => handleChange('yardArea', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gardenArea">مساحة الحديقة (م²)</Label>
                  <Input id="gardenArea" type="number" placeholder="إن وجدت" value={formData.gardenArea || ''} onChange={(e) => handleChange('gardenArea', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roofArea">مساحة السطح (م²)</Label>
                  <Input id="roofArea" type="number" placeholder="إن كان مفتوح" value={formData.roofArea || ''} onChange={(e) => handleChange('roofArea', e.target.value)} />
                </div>
              </div>
            </div>

            {/* تفاصيل البناء */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">تفاصيل البناء والطوابق</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">رقم الطابق</Label>
                  <Input id="floor" type="number" placeholder="للشقق" value={formData.floor || ''} onChange={(e) => handleChange('floor', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalFloors">إجمالي الطوابق</Label>
                  <Input id="totalFloors" type="number" placeholder="في المبنى" value={formData.totalFloors || ''} onChange={(e) => handleChange('totalFloors', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floorHeight">ارتفاع السقف (م)</Label>
                  <Input id="floorHeight" type="number" step="0.1" placeholder="مثال: 3.2" value={formData.floorHeight || ''} onChange={(e) => handleChange('floorHeight', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildingAge">عمر البناء (سنة)</Label>
                  <Input id="buildingAge" type="number" placeholder="بالسنوات" value={formData.buildingAge || ''} onChange={(e) => handleChange('buildingAge', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastRenovation">آخر تجديد (سنة)</Label>
                  <Input id="lastRenovation" type="number" placeholder="مثال: 2023" value={formData.lastRenovation || ''} onChange={(e) => handleChange('lastRenovation', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="structureType">نوع الهيكل</Label>
                  <select id="structureType" value={formData.structureType || ''} onChange={(e) => handleChange('structureType', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="خرساني">خرساني</option>
                    <option value="حديد">حديد</option>
                    <option value="طوب">طوب</option>
                    <option value="مختلط">مختلط</option>
                  </select>
                </div>
              </div>
            </div>

            {/* مواد التشطيب */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">مواد التشطيب والجودة</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flooringType">نوع الأرضيات</Label>
                  <select id="flooringType" value={formData.flooringType || ''} onChange={(e) => handleChange('flooringType', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="سيراميك">سيراميك</option>
                    <option value="بورسلان">بورسلان</option>
                    <option value="رخام">رخام</option>
                    <option value="باركيه">باركيه</option>
                    <option value="موكيت">موكيت</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallFinish">تشطيب الجدران</Label>
                  <select id="wallFinish" value={formData.wallFinish || ''} onChange={(e) => handleChange('wallFinish', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="دهان">دهان</option>
                    <option value="ورق جدران">ورق جدران</option>
                    <option value="حجر">حجر</option>
                    <option value="جبس">جبس</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kitchenQuality">جودة المطبخ</Label>
                  <select id="kitchenQuality" value={formData.kitchenQuality || ''} onChange={(e) => handleChange('kitchenQuality', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر الجودة</option>
                    <option value="فاخر">فاخر</option>
                    <option value="جيد">جيد</option>
                    <option value="عادي">عادي</option>
                    <option value="بسيط">بسيط</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathroomQuality">جودة الحمامات</Label>
                  <select id="bathroomQuality" value={formData.bathroomQuality || ''} onChange={(e) => handleChange('bathroomQuality', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر الجودة</option>
                    <option value="فاخر">فاخر</option>
                    <option value="جيد">جيد</option>
                    <option value="عادي">عادي</option>
                    <option value="بسيط">بسيط</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windowType">نوع النوافذ</Label>
                  <select id="windowType" value={formData.windowType || ''} onChange={(e) => handleChange('windowType', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="UPVC">UPVC</option>
                    <option value="ألمنيوم">ألمنيوم</option>
                    <option value="خشب">خشب</option>
                    <option value="حديد">حديد</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doorType">نوع الأبواب</Label>
                  <select id="doorType" value={formData.doorType || ''} onChange={(e) => handleChange('doorType', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="خشب صلب">خشب صلب</option>
                    <option value="خشب مضغوط">خشب مضغوط</option>
                    <option value="معدن">معدن</option>
                    <option value="UPVC">UPVC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* الأنظمة والتجهيزات */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">الأنظمة والتجهيزات</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acType">نوع التكييف</Label>
                  <select id="acType" value={formData.acType || ''} onChange={(e) => handleChange('acType', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="مركزي">مركزي</option>
                    <option value="سبليت">سبليت</option>
                    <option value="شباك">شباك</option>
                    <option value="مخفي">مخفي</option>
                    <option value="لا يوجد">لا يوجد</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heatingType">نظام التدفئة</Label>
                  <select id="heatingType" value={formData.heatingType || ''} onChange={(e) => handleChange('heatingType', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="مركزي">مركزي</option>
                    <option value="دفايات">دفايات</option>
                    <option value="لا يوجد">لا يوجد</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterHeater">سخان المياه</Label>
                  <select id="waterHeater" value={formData.waterHeater || ''} onChange={(e) => handleChange('waterHeater', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="مركزي">مركزي</option>
                    <option value="كهربائي">كهربائي</option>
                    <option value="غاز">غاز</option>
                    <option value="شمسي">شمسي</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterTank">خزان المياه (لتر)</Label>
                  <Input id="waterTank" type="number" placeholder="السعة" value={formData.waterTank || ''} onChange={(e) => handleChange('waterTank', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="generator">مولد كهربائي</Label>
                  <select id="generator" value={formData.generator || ''} onChange={(e) => handleChange('generator', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solarPanels">ألواح شمسية</Label>
                  <select id="solarPanels" value={formData.solarPanels || ''} onChange={(e) => handleChange('solarPanels', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
              </div>
            </div>

            {/* العزل والحماية */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">العزل والحماية</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="thermalInsulation">عزل حراري</Label>
                  <select id="thermalInsulation" value={formData.thermalInsulation || ''} onChange={(e) => handleChange('thermalInsulation', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="ممتاز">ممتاز</option>
                    <option value="جيد">جيد</option>
                    <option value="عادي">عادي</option>
                    <option value="لا يوجد">لا يوجد</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterproofing">عزل مائي</Label>
                  <select id="waterproofing" value={formData.waterproofing || ''} onChange={(e) => handleChange('waterproofing', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="ممتاز">ممتاز</option>
                    <option value="جيد">جيد</option>
                    <option value="عادي">عادي</option>
                    <option value="لا يوجد">لا يوجد</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soundproofing">عزل صوتي</Label>
                  <select id="soundproofing" value={formData.soundproofing || ''} onChange={(e) => handleChange('soundproofing', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="ممتاز">ممتاز</option>
                    <option value="جيد">جيد</option>
                    <option value="عادي">عادي</option>
                    <option value="لا يوجد">لا يوجد</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireAlarm">نظام إنذار حريق</Label>
                  <select id="fireAlarm" value={formData.fireAlarm || ''} onChange={(e) => handleChange('fireAlarm', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireExtinguisher">طفايات حريق</Label>
                  <Input id="fireExtinguisher" type="number" placeholder="العدد" value={formData.fireExtinguisher || ''} onChange={(e) => handleChange('fireExtinguisher', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyExit">مخرج طوارئ</Label>
                  <select id="emergencyExit" value={formData.emergencyExit || ''} onChange={(e) => handleChange('emergencyExit', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
              </div>
            </div>

            {/* الاتصالات والتقنية */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">الاتصالات والتقنية</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="internetSpeed">سرعة الإنترنت (Mbps)</Label>
                  <Input id="internetSpeed" type="number" placeholder="مثال: 100" value={formData.internetSpeed || ''} onChange={(e) => handleChange('internetSpeed', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiberOptic">ألياف ضوئية</Label>
                  <select id="fiberOptic" value={formData.fiberOptic || ''} onChange={(e) => handleChange('fiberOptic', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">متوفر؟</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smartHome">منزل ذكي</Label>
                  <select id="smartHome" value={formData.smartHome || ''} onChange={(e) => handleChange('smartHome', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="كامل">كامل</option>
                    <option value="جزئي">جزئي</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="satelliteDish">طبق استقبال</Label>
                  <select id="satelliteDish" value={formData.satelliteDish || ''} onChange={(e) => handleChange('satelliteDish', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intercom">انتركم</Label>
                  <select id="intercom" value={formData.intercom || ''} onChange={(e) => handleChange('intercom', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="فيديو">فيديو</option>
                    <option value="صوتي">صوتي</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cctv">كاميرات مراقبة</Label>
                  <Input id="cctv" type="number" placeholder="العدد" value={formData.cctv || ''} onChange={(e) => handleChange('cctv', e.target.value)} />
                </div>
              </div>
            </div>

            {/* المسافات والقرب من الخدمات */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">المسافات من الخدمات (كم)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distanceSchool">أقرب مدرسة</Label>
                  <Input id="distanceSchool" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distanceSchool || ''} onChange={(e) => handleChange('distanceSchool', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceHospital">أقرب مستشفى</Label>
                  <Input id="distanceHospital" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distanceHospital || ''} onChange={(e) => handleChange('distanceHospital', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceMosque">أقرب مسجد</Label>
                  <Input id="distanceMosque" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distanceMosque || ''} onChange={(e) => handleChange('distanceMosque', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceMall">أقرب مول</Label>
                  <Input id="distanceMall" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distanceMall || ''} onChange={(e) => handleChange('distanceMall', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceSupermarket">أقرب سوبرماركت</Label>
                  <Input id="distanceSupermarket" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distanceSupermarket || ''} onChange={(e) => handleChange('distanceSupermarket', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceHighway">أقرب طريق سريع</Label>
                  <Input id="distanceHighway" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distanceHighway || ''} onChange={(e) => handleChange('distanceHighway', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceAirport">المطار</Label>
                  <Input id="distanceAirport" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distanceAirport || ''} onChange={(e) => handleChange('distanceAirport', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceMetro">محطة مترو/قطار</Label>
                  <Input id="distanceMetro" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distanceMetro || ''} onChange={(e) => handleChange('distanceMetro', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distancePark">أقرب حديقة</Label>
                  <Input id="distancePark" type="number" step="0.1" placeholder="بالكيلومتر" value={formData.distancePark || ''} onChange={(e) => handleChange('distancePark', e.target.value)} />
                </div>
              </div>
            </div>

            {/* الضوضاء والمرور */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">البيئة المحيطة</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noiseLevel">مستوى الضوضاء</Label>
                  <select id="noiseLevel" value={formData.noiseLevel || ''} onChange={(e) => handleChange('noiseLevel', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر المستوى</option>
                    <option value="هادئ جداً">هادئ جداً</option>
                    <option value="هادئ">هادئ</option>
                    <option value="متوسط">متوسط</option>
                    <option value="مزعج">مزعج</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trafficLevel">كثافة المرور</Label>
                  <select id="trafficLevel" value={formData.trafficLevel || ''} onChange={(e) => handleChange('trafficLevel', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر الكثافة</option>
                    <option value="منخفضة">منخفضة</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="عالية">عالية</option>
                    <option value="مزدحم جداً">مزدحم جداً</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airQuality">جودة الهواء</Label>
                  <select id="airQuality" value={formData.airQuality || ''} onChange={(e) => handleChange('airQuality', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر الجودة</option>
                    <option value="ممتازة">ممتازة</option>
                    <option value="جيدة">جيدة</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="سيئة">سيئة</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sunExposure">التعرض للشمس</Label>
                  <select id="sunExposure" value={formData.sunExposure || ''} onChange={(e) => handleChange('sunExposure', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر المستوى</option>
                    <option value="كامل">كامل</option>
                    <option value="جزئي">جزئي</option>
                    <option value="محدود">محدود</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flooding">احتمال الفيضان</Label>
                  <select id="flooding" value={formData.flooding || ''} onChange={(e) => handleChange('flooding', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر المستوى</option>
                    <option value="معدوم">معدوم</option>
                    <option value="منخفض">منخفض</option>
                    <option value="متوسط">متوسط</option>
                    <option value="عالي">عالي</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhoodSafety">أمان الحي</Label>
                  <select id="neighborhoodSafety" value={formData.neighborhoodSafety || ''} onChange={(e) => handleChange('neighborhoodSafety', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر المستوى</option>
                    <option value="ممتاز">ممتاز</option>
                    <option value="جيد">جيد</option>
                    <option value="متوسط">متوسط</option>
                    <option value="ضعيف">ضعيف</option>
                  </select>
                </div>
              </div>
            </div>

            {/* معلومات قانونية ومالية */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">معلومات قانونية ومالية</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownership">نوع الملكية</Label>
                  <select id="ownership" value={formData.ownership || ''} onChange={(e) => handleChange('ownership', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">اختر النوع</option>
                    <option value="ملك">ملك</option>
                    <option value="إيجار">إيجار</option>
                    <option value="وقف">وقف</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deed">صك إلكتروني</Label>
                  <select id="deed" value={formData.deed || ''} onChange={(e) => handleChange('deed', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortgage">رهن عقاري</Label>
                  <select id="mortgage" value={formData.mortgage || ''} onChange={(e) => handleChange('mortgage', e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="">يوجد؟</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualTax">الضريبة السنوية (ريال)</Label>
                  <Input id="annualTax" type="number" placeholder="إن وجدت" value={formData.annualTax || ''} onChange={(e) => handleChange('annualTax', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceFee">رسوم الصيانة (ريال/شهر)</Label>
                  <Input id="maintenanceFee" type="number" placeholder="إن وجدت" value={formData.maintenanceFee || ''} onChange={(e) => handleChange('maintenanceFee', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilities">فواتير الخدمات (ريال/شهر)</Label>
                  <Input id="utilities" type="number" placeholder="متوسط" value={formData.utilities || ''} onChange={(e) => handleChange('utilities', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* زر الإرسال */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 text-lg font-bold primary-gradient hover:opacity-90 transition-opacity"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            جاري التقييم...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 ml-2" />
            احسب القيمة التقديرية
          </>
        )}
      </Button>

      {(!formData.area || !formData.city) && (
        <div className="flex items-start gap-2 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            يرجى إدخال <strong>المساحة</strong> و<strong>المدينة</strong> على الأقل للحصول على تقييم أولي
          </p>
        </div>
      )}
    </form>
  );
}

