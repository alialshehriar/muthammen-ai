import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { 
  Building2, Users, TrendingUp, BarChart3, 
  DollarSign, MapPin, Clock, Activity,
  Eye, Download, RefreshCcw, LogOut,
  Home as HomeIcon, CreditCard, UserCheck,
  FileText, Settings, Bell, Mail
} from 'lucide-react';

function Dashboard({ onLogout, navigateTo }) {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    totalUsers: 0,
    avgPropertyValue: 0,
    activeSubscriptions: 0,
    referralCount: 0,
    recentActivity: []
  });

  useEffect(() => {
    // جلب بيانات المستخدم
    const user = JSON.parse(localStorage.getItem('muthammen_user') || '{}');
    setUserData(user);

    // جلب الإحصائيات من localStorage
    loadStats();
  }, []);

  const loadStats = () => {
    // جلب سجل التقييمات
    const history = JSON.parse(localStorage.getItem('evaluation_history') || '[]');
    
    // حساب الإحصائيات
    const totalEvaluations = history.length;
    const avgValue = history.length > 0 
      ? Math.round(history.reduce((sum, item) => sum + (item.estimatedValue || 0), 0) / history.length)
      : 0;

    // جلب بيانات الإحالات
    const referralCode = localStorage.getItem('referral_code');
    const referralCount = parseInt(localStorage.getItem('referral_count') || '0');

    // النشاط الأخير
    const recentActivity = history.slice(-5).reverse().map(item => ({
      type: 'evaluation',
      date: item.timestamp || new Date().toISOString(),
      value: item.estimatedValue,
      city: item.city,
      district: item.district
    }));

    setStats({
      totalEvaluations,
      totalUsers: 1, // في النسخة التجريبية
      avgPropertyValue: avgValue,
      activeSubscriptions: 0, // سيتم ربطه لاحقاً
      referralCount,
      recentActivity
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* الهيدر */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl primary-gradient">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground">لوحة التحكم</h1>
                <p className="text-xs text-muted-foreground">مرحباً، {userData.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('home')}
                className="gap-2"
              >
                <HomeIcon className="w-4 h-4" />
                الرئيسية
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8">
        {/* بطاقات الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* إجمالي التقييمات */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 font-semibold">+12%</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">إجمالي التقييمات</h3>
            <p className="text-3xl font-bold">{formatNumber(stats.totalEvaluations)}</p>
          </Card>

          {/* متوسط قيمة العقار */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-green-600 font-semibold">+8%</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">متوسط قيمة العقار</h3>
            <p className="text-3xl font-bold">{formatNumber(stats.avgPropertyValue)}</p>
            <p className="text-xs text-muted-foreground mt-1">ريال سعودي</p>
          </Card>

          {/* الإحالات */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-green-600 font-semibold">+{stats.referralCount}</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">الإحالات الناجحة</h3>
            <p className="text-3xl font-bold">{formatNumber(stats.referralCount)}</p>
          </Card>

          {/* الاشتراكات النشطة */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-100">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs text-muted-foreground">قريباً</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">الاشتراكات النشطة</h3>
            <p className="text-3xl font-bold">{formatNumber(stats.activeSubscriptions)}</p>
          </Card>
        </div>

        {/* الصف الثاني: الرسوم البيانية والنشاط */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* الرسم البياني */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1">نظرة عامة على التقييمات</h3>
                <p className="text-sm text-muted-foreground">آخر 30 يوم</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                تصدير
              </Button>
            </div>

            {/* رسم بياني بسيط */}
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 45, 80, 55, 70, 90, 75, 60, 85, 95, 70, 80].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${height}%`}
                  />
                  <span className="text-xs text-muted-foreground">{index + 1}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* النشاط الأخير */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">النشاط الأخير</h3>
              <Button variant="ghost" size="sm">
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                    <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">تقييم عقار جديد</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.city} - {activity.district}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatNumber(activity.value)} ريال
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">لا يوجد نشاط حتى الآن</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* الصف الثالث: روابط سريعة ومعلومات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* الوصول السريع */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              الوصول السريع
            </h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigateTo('home')}
              >
                <FileText className="w-4 h-4" />
                تقييم عقار جديد
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigateTo('map')}
              >
                <MapPin className="w-4 h-4" />
                الخريطة التفاعلية
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigateTo('market')}
              >
                <BarChart3 className="w-4 h-4" />
                دراسة السوق
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigateTo('referrals')}
              >
                <Users className="w-4 h-4" />
                برنامج الإحالات
              </Button>
            </div>
          </Card>

          {/* معلومات الحساب */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              معلومات الحساب
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">البريد الإلكتروني</span>
                <span className="text-sm font-medium truncate max-w-[180px]">{userData.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">نوع الحساب</span>
                <span className="text-sm font-medium">
                  {userData.isAdmin ? 'مدير' : 'مستخدم'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">تاريخ التسجيل</span>
                <span className="text-sm font-medium">
                  {formatDate(userData.loginTime)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">الحالة</span>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  نشط
                </span>
              </div>
            </div>
          </Card>

          {/* الإشعارات */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">مرحباً بك في مُثمّن!</p>
                <p className="text-xs text-blue-700">ابدأ بتقييم عقارك الأول الآن</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-900 mb-1">خريطة تفاعلية قريباً</p>
                <p className="text-xs text-purple-700">استكشف الأسعار في جميع الأحياء</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-1">برنامج الإحالات</p>
                <p className="text-xs text-green-700">احصل على مكافآت عند دعوة الأصدقاء</p>
              </div>
            </div>
          </Card>
        </div>

        {/* معلومات إضافية */}
        {userData.isAdmin && (
          <Card className="p-6 mt-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-600">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">صلاحيات المدير</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  لديك صلاحيات كاملة للوصول إلى جميع البيانات والإحصائيات في المنصة.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Users className="w-4 h-4" />
                    إدارة المستخدمين
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    التقارير المتقدمة
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    الإعدادات العامة
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

