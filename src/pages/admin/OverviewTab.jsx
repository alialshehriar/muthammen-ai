import { Card } from '@/components/ui/card.jsx';
import {
  Users, TrendingUp, Gift, MousePointerClick,
  Activity, Calendar, BarChart3, TrendingDown
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const OverviewTab = ({ stats }) => {
  if (!stats) return null;

  // ألوان للرسوم البيانية
  const COLORS = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899'
  };

  // بيانات توزيع المكافآت للرسم البياني الدائري
  const rewardData = stats.rewards?.map(r => ({
    name: r.reward_tier === 'diamond' ? 'ماسي' :
          r.reward_tier === 'gold' ? 'ذهبي' :
          r.reward_tier === 'silver' ? 'فضي' :
          r.reward_tier === 'bronze' ? 'برونزي' : 'بدون',
    value: parseInt(r.count),
    color: r.reward_tier === 'diamond' ? '#8b5cf6' :
           r.reward_tier === 'gold' ? '#f59e0b' :
           r.reward_tier === 'silver' ? '#6b7280' :
           r.reward_tier === 'bronze' ? '#ea580c' : '#9ca3af'
  })) || [];

  // بيانات النشاط الأسبوعي
  const weeklyData = stats.weeklyActivity?.map(day => ({
    date: new Date(day.date).toLocaleDateString('ar-SA', { weekday: 'short' }),
    signups: parseInt(day.signups)
  })) || [];

  // بيانات أكثر المدن
  const citiesData = stats.cities?.slice(0, 5).map(city => ({
    name: city.city || 'غير محدد',
    count: parseInt(city.count)
  })) || [];

  return (
    <>
      {/* بطاقات الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
              <p className="text-3xl font-black">{stats.users?.total || 0}</p>
              <p className="text-xs text-green-600 mt-1">
                +{stats.users?.newThisWeek || 0} هذا الأسبوع
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">تسجيلات جديدة</p>
              <p className="text-3xl font-black">{stats.users?.newThisMonth || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                هذا الشهر
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">إجمالي الإحالات</p>
              <p className="text-3xl font-black">{stats.referrals?.totalReferralCount || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.referrals?.activeReferrers || 0} محيل نشط
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <MousePointerClick className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">نقرات الإحالة</p>
              <p className="text-3xl font-black">{stats.clicks?.total || 0}</p>
              <p className="text-xs text-green-600 mt-1">
                +{stats.clicks?.thisWeek || 0} هذا الأسبوع
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نشاط المستخدمين الأسبوعي */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            نشاط المستخدمين (آخر 7 أيام)
          </h3>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="signups" 
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="تسجيلات"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              لا توجد بيانات لعرضها
            </div>
          )}
        </Card>

        {/* توزيع المكافآت */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            توزيع المكافآت
          </h3>
          {rewardData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={rewardData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rewardData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              لا توجد بيانات لعرضها
            </div>
          )}
        </Card>
      </div>

      {/* المدن وأكثر المحيلين */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أكثر المدن */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            أكثر المدن نشاطاً
          </h3>
          {citiesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={citiesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill={COLORS.success}
                  radius={[8, 8, 0, 0]}
                  name="عدد المستخدمين"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              لا توجد بيانات لعرضها
            </div>
          )}
        </Card>

        {/* إحصائيات سريعة */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6">إحصائيات سريعة</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
              <span className="text-sm font-medium">معدل التحويل (Clicks → Signups)</span>
              <span className="text-lg font-bold text-blue-600">
                {stats.conversion?.rate || 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
              <span className="text-sm font-medium">متوسط الإحالات لكل مستخدم</span>
              <span className="text-lg font-bold text-green-600">
                {stats.users?.total > 0 
                  ? ((stats.referrals?.totalReferralCount || 0) / stats.users.total).toFixed(2)
                  : '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50">
              <span className="text-sm font-medium">إجمالي الأحداث المسجلة</span>
              <span className="text-lg font-bold text-purple-600">
                {stats.events?.total || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50">
              <span className="text-sm font-medium">أحداث هذا الأسبوع</span>
              <span className="text-lg font-bold text-orange-600">
                {stats.events?.thisWeek || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* أكثر المحيلين نشاطاً */}
      {stats.topReferrers && stats.topReferrers.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
            أكثر المحيلين نشاطاً (Top 10)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 text-sm font-semibold">#</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold">الاسم</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold">البريد</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold">كود الإحالة</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold">عدد الإحالات</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold">المستوى</th>
                </tr>
              </thead>
              <tbody>
                {stats.topReferrers.map((referrer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {index === 0 && <span className="text-2xl">🥇</span>}
                      {index === 1 && <span className="text-2xl">🥈</span>}
                      {index === 2 && <span className="text-2xl">🥉</span>}
                      {index > 2 && <span className="text-sm text-muted-foreground">{index + 1}</span>}
                    </td>
                    <td className="py-3 px-4 font-medium">{referrer.name || 'غير محدد'}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{referrer.email}</td>
                    <td className="py-3 px-4">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm">{referrer.ref_code}</code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-lg">{referrer.referrals_count}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        referrer.reward_tier === 'diamond' ? 'bg-purple-100 text-purple-800' :
                        referrer.reward_tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                        referrer.reward_tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {referrer.reward_tier === 'diamond' ? 'ماسي' :
                         referrer.reward_tier === 'gold' ? 'ذهبي' :
                         referrer.reward_tier === 'silver' ? 'فضي' : 'برونزي'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
};

export default OverviewTab;

