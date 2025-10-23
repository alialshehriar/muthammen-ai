import { Card } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  Trophy, TrendingUp, Users, MousePointerClick, Target, Award
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ReferralsTab = ({ stats, waitlist, getRewardIcon, getRewardColor, loading }) => {
  if (loading || !stats) {
    return (
      <div className="text-center text-muted-foreground py-12">
        جارٍ التحميل...
      </div>
    );
  }

  // أكثر المحيلين نشاطاً
  const topReferrers = stats.topReferrers || [];

  // بيانات للرسم البياني
  const referralData = topReferrers.slice(0, 10).map(r => ({
    name: r.name || r.email.split('@')[0],
    count: r.referrals_count
  }));

  return (
    <>
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">إجمالي الإحالات</p>
              <p className="text-3xl font-black">{stats.referrals?.totalReferralCount || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">محيلين نشطين</p>
              <p className="text-3xl font-black">{stats.referrals?.activeReferrers || 0}</p>
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
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">معدل التحويل</p>
              <p className="text-3xl font-black">{stats.conversion?.rate || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="p-6">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          لوحة المتصدرين (Leaderboard)
        </h3>

        {topReferrers.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            لا توجد إحالات حتى الآن
          </div>
        ) : (
          <div className="space-y-4">
            {topReferrers.map((referrer, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300' :
                  'bg-white border-gray-200'
                }`}
              >
                {/* الترتيب */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {index === 0 && <span className="text-4xl">🥇</span>}
                  {index === 1 && <span className="text-4xl">🥈</span>}
                  {index === 2 && <span className="text-4xl">🥉</span>}
                  {index > 2 && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="font-bold text-gray-700">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* المعلومات */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{referrer.name || 'غير محدد'}</span>
                    <Badge className={getRewardColor(referrer.reward_tier)}>
                      <span className="flex items-center gap-1">
                        {getRewardIcon(referrer.reward_tier)}
                        {referrer.reward_tier === 'diamond' ? 'ماسي' :
                         referrer.reward_tier === 'gold' ? 'ذهبي' :
                         referrer.reward_tier === 'silver' ? 'فضي' : 'برونزي'}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{referrer.email}</span>
                    <span>•</span>
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {referrer.ref_code}
                    </code>
                  </div>
                </div>

                {/* عدد الإحالات */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-3xl font-black text-purple-600">
                    {referrer.referrals_count}
                  </div>
                  <div className="text-xs text-muted-foreground">إحالة</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* رسم بياني للمحيلين */}
      {referralData.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            أكثر 10 محيلين نشاطاً
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={referralData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#888" />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#888"
                width={150}
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
                fill="#8b5cf6"
                radius={[0, 8, 8, 0]}
                name="عدد الإحالات"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* إحصائيات إضافية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            توزيع المكافآت
          </h3>
          <div className="space-y-3">
            {stats.rewards?.map((reward, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  {getRewardIcon(reward.reward_tier)}
                  <span className="font-medium">
                    {reward.reward_tier === 'diamond' ? 'ماسي' :
                     reward.reward_tier === 'gold' ? 'ذهبي' :
                     reward.reward_tier === 'silver' ? 'فضي' :
                     reward.reward_tier === 'bronze' ? 'برونزي' : 'بدون'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{reward.count}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        reward.reward_tier === 'diamond' ? 'bg-purple-600' :
                        reward.reward_tier === 'gold' ? 'bg-yellow-600' :
                        reward.reward_tier === 'silver' ? 'bg-gray-400' :
                        'bg-orange-600'
                      }`}
                      style={{ 
                        width: `${(reward.count / stats.users?.total * 100).toFixed(0)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            معدلات الأداء
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
              <span className="text-sm font-medium">معدل التحويل الكلي</span>
              <span className="text-2xl font-bold text-green-600">
                {stats.conversion?.rate || 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
              <span className="text-sm font-medium">متوسط الإحالات لكل محيل</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats.referrals?.activeReferrers > 0
                  ? ((stats.referrals?.totalReferralCount || 0) / stats.referrals.activeReferrers).toFixed(2)
                  : '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50">
              <span className="text-sm font-medium">نسبة المستخدمين المحيلين</span>
              <span className="text-2xl font-bold text-purple-600">
                {stats.users?.total > 0
                  ? ((stats.referrals?.activeReferrers || 0) / stats.users.total * 100).toFixed(1)
                  : '0.0'}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ReferralsTab;

