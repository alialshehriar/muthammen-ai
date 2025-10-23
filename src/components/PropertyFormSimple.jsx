import { useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { 
  Building2, MapPin, Calendar, Home, Ruler, 
  Sparkles, Loader2, AlertCircle
} from 'lucide-react';

export default function PropertyFormSimple({ onSubmit, isLoading }) {
  // استخدام useRef للحصول على القيم مباشرة من DOM
  const areaRef = useRef(null);
  const cityRef = useRef(null);
  const districtRef = useRef(null);
  const propertyTypeRef = useRef(null);
  const ageRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // قراءة القيم من refs
    const formData = {
      area: areaRef.current?.value || '',
      city: cityRef.current?.value || '',
      district: districtRef.current?.value || '',
      propertyType: propertyTypeRef.current?.value || '',
      age: ageRef.current?.value || ''
    };
    
    console.log('📤 إرسال البيانات:', formData);
    
    // Validation
    if (!formData.area || !formData.city) {
      alert('يرجى إدخال المساحة والمدينة على الأقل');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* شريط التقدم */}
      <Card className="p-4 card-gradient">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">نموذج التقييم المبسط</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          املأ الحقول الأساسية للحصول على تقييم دقيق
        </p>
      </Card>

      {/* البيانات الأساسية */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg">البيانات الأساسية</h3>
            <p className="text-sm text-muted-foreground">المعلومات المطلوبة للتقييم</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* المساحة */}
          <div className="space-y-2">
            <Label htmlFor="area" className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              المساحة (م²) *
            </Label>
            <Input
              ref={areaRef}
              id="area"
              name="area"
              type="number"
              placeholder="مثال: 300"
              className="text-lg"
              required
            />
          </div>

          {/* المدينة */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              المدينة *
            </Label>
            <select
              ref={cityRef}
              id="city"
              name="city"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-lg"
              required
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

          {/* الحي */}
          <div className="space-y-2">
            <Label htmlFor="district" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              الحي
            </Label>
            <Input
              ref={districtRef}
              id="district"
              name="district"
              type="text"
              placeholder="مثال: الياسمين"
              className="text-lg"
            />
          </div>

          {/* نوع العقار */}
          <div className="space-y-2">
            <Label htmlFor="propertyType" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              نوع العقار
            </Label>
            <select
              ref={propertyTypeRef}
              id="propertyType"
              name="propertyType"
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
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              عمر العقار
            </Label>
            <select
              ref={ageRef}
              id="age"
              name="age"
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

      <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>ملاحظة:</strong> هذا نموذج مبسط للاختبار. املأ المساحة والمدينة على الأقل للحصول على تقييم.
        </p>
      </div>
    </form>
  );
}

