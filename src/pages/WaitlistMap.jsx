import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import {
  Map, TrendingUp, BarChart3, AlertCircle, 
  CheckCircle2, Brain, Sparkles, Copy, Check,
  Users, Gift, Trophy, Crown
} from 'lucide-react';

const WaitlistMap = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    city: '',
    phone: '',
    honeypot: '' // حقل خفي للحماية من البوتات
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [userRefCode, setUserRefCode] = useState(null);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  // التقاط كود الإحالة من URL
  const [refCode, setRefCode] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setRefCode(ref);
      // حفظ في localStorage
      localStorage.setItem('muth_ref', ref);
      
      // تسجيل النقرة
      fetch('/api/referrals/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refCode: ref, path: window.location.pathname })
      }).catch(err => console.error('Failed to record click:', err));
    } else {
      // محاولة استرجاع من localStorage
      const savedRef = localStorage.getItem('muth_ref');
      if (savedRef) {
        setRefCode(savedRef);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          refCode: refCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء التسجيل');
      }

      if (data.ok) {
        setSubmitSuccess(true);
        setUserRefCode(data.refCode);
        setStats(data.stats);
        
        // تسجيل حدث waitlist_view
        fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'waitlist_view',
            eventProps: { ref_code: data.refCode }
          })
        }).catch(() => {});
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    const link = `https://www.muthammen.com/?ref=${userRefCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRewardIcon = (tier) => {
    switch (tier) {
      case 'diamond': return <Crown className="w-5 h-5 text-purple-600" />;
      case 'gold': return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 'silver': return <Gift className="w-5 h-5 text-gray-400" />;
      case 'bronze': return <Gift className="w-5 h-5 text-orange-600" />;
      default: return <Users className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRewardLabel = (tier) => {
    switch (tier) {
      case 'diamond': return 'الماسي (50+ إحالة)';
      case 'gold': return 'الذهبي (20-49 إحالة)';
      case 'silver': return 'الفضي (10-19 إحالة)';
      case 'bronze': return 'البرونزي (3-9 إحالات)';
      default: return 'ابدأ بدعوة الأصدقاء';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold mb-4">
          <Map className="w-4 h-4" />
          <span>قريبًا</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          خريطة الوعي العقاري الأولى في المملكة
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          استكشف الأسعار، الاتجاهات، والفرص في كل حي بتفاصيل غير مسبوقة
        </p>
      </div>

      {/* ميزات الخريطة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="p-6">
          <div className="p-3 rounded-xl bg-blue-100 w-fit mb-4">
            <Map className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">خريطة تفاعلية للرياض</h3>
          <p className="text-sm text-muted-foreground">
            عرض جميع الأحياء مع معلومات تفصيلية عن الأسعار والمرافق
          </p>
        </Card>

        <Card className="p-6">
          <div className="p-3 rounded-xl bg-green-100 w-fit mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">اتجاهات الأسعار</h3>
          <p className="text-sm text-muted-foreground">
            تتبع تغيرات الأسعار عبر الزمن واكتشف الفرص الاستثمارية
          </p>
        </Card>

        <Card className="p-6">
          <div className="p-3 rounded-xl bg-purple-100 w-fit mb-4">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">إحصائيات تفصيلية</h3>
          <p className="text-sm text-muted-foreground">
            متوسط الأسعار، عدد العقارات، ومعدل النمو لكل حي
          </p>
        </Card>

        <Card className="p-6">
          <div className="p-3 rounded-xl bg-orange-100 w-fit mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">فلترة متقدمة</h3>
          <p className="text-sm text-muted-foreground">
            فلتر حسب نوع العقار، النطاق السعري، والمنطقة
          </p>
        </Card>

        <Card className="p-6">
          <div className="p-3 rounded-xl bg-pink-100 w-fit mb-4">
            <CheckCircle2 className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">مقارنة الأحياء</h3>
          <p className="text-sm text-muted-foreground">
            قارن بين الأحياء لاتخاذ قرار مستنير
          </p>
        </Card>

        <Card className="p-6">
          <div className="p-3 rounded-xl bg-cyan-100 w-fit mb-4">
            <Brain className="w-6 h-6 text-cyan-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">توصيات ذكية</h3>
          <p className="text-sm text-muted-foreground">
            اقتراحات مخصصة بناءً على احتياجاتك وميزانيتك
          </p>
        </Card>
      </div>

      {/* نموذج التسجيل المبكر */}
      <Card className="p-8 max-w-2xl mx-auto mb-12">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">سجّل الآن واحصل على وصول مبكر</h2>
          <p className="text-muted-foreground">
            كن من أوائل المستخدمين واحصل على مزايا حصرية
          </p>
        </div>

        {!submitSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {refCode && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  تم استخدام كود الإحالة: <strong>{refCode}</strong>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="name">الاسم (اختياري)</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسمك"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">المدينة (اختياري)</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="الرياض"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="05xxxxxxxx"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleInputChange}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جارٍ التسجيل...' : 'سجّل الآن'}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="p-4 rounded-full bg-green-100 w-20 h-20 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">تم التسجيل بنجاح!</h3>
              <p className="text-muted-foreground">
                شكراً لانضمامك. سنرسل لك تحديثات عند إطلاق الخريطة.
              </p>
            </div>

            {/* رابط الإحالة */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center gap-2 mb-4">
                {getRewardIcon(stats?.rewardTier)}
                <h4 className="font-bold">رابط الإحالة الخاص بك</h4>
              </div>
              
              <div className="flex gap-2 mb-4">
                <Input
                  value={`https://www.muthammen.com/?ref=${userRefCode}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  size="icon"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">عدد الإحالات:</span>
                  <span className="font-bold">{stats?.referralsCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المستوى:</span>
                  <span className="font-bold">{getRewardLabel(stats?.rewardTier)}</span>
                </div>
              </div>

              <Alert className="mt-4 bg-white">
                <Gift className="h-4 w-4" />
                <AlertDescription>
                  شارك رابطك مع الأصدقاء واحصل على مكافآت حصرية!
                </AlertDescription>
              </Alert>
            </Card>

            <Button
              onClick={() => navigateTo('home')}
              variant="outline"
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              ابدأ بالتقييم الآن
            </Button>
          </div>
        )}
      </Card>

      {/* لماذا الخريطة؟ */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <h2 className="text-2xl font-bold mb-4 text-center">لماذا خريطة مُثمّن؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2">فهم أعمق للسوق</h3>
            <p className="text-sm text-muted-foreground">
              الخريطة تعطيك نظرة شاملة على السوق العقاري في الرياض، مما يساعدك على فهم الاتجاهات والفرص.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">قرارات مستنيرة</h3>
            <p className="text-sm text-muted-foreground">
              باستخدام بيانات دقيقة وتحليلات متقدمة، يمكنك اتخاذ قرارات شراء أو استثمار أفضل.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">توفير الوقت</h3>
            <p className="text-sm text-muted-foreground">
              بدلاً من البحث في مواقع متعددة، احصل على جميع المعلومات في مكان واحد.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">شفافية كاملة</h3>
            <p className="text-sm text-muted-foreground">
              بيانات حقيقية ومحدثة باستمرار لضمان أعلى مستوى من الدقة.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WaitlistMap;

