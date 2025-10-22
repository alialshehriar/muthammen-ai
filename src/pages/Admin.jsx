import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import {
  Users, TrendingUp, Mail, Gift, Download, Search,
  Trophy, Crown, Award, Calendar, MapPin, Phone,
  BarChart3, Activity, Clock, MousePointerClick
} from 'lucide-react';

const Admin = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [stats, setStats] = useState({
    totalSignups: 0,
    todaySignups: 0,
    weekSignups: 0,
    totalReferrals: 0,
    conversionRate: 0,
    topCity: ''
  });
  
  const [waitlist, setWaitlist] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // التحقق من كلمة المرور
  const handleLogin = (e) => {
    e.preventDefault();
    // في الإنتاج، يجب التحقق من ADMIN_PASS من المتغيرات البيئية
    const ADMIN_PASS = process.env.ADMIN_PASS || 'muthammen2025';
    
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  // تحميل البيانات
  const loadData = async () => {
    setLoading(true);
    try {
      // في الإنتاج، يجب استدعاء API محمي
      // هنا نستخدم بيانات تجريبية
      
      // محاكاة تحميل البيانات
      setTimeout(() => {
        setStats({
          totalSignups: 0,
          todaySignups: 0,
          weekSignups: 0,
          totalReferrals: 0,
          conversionRate: 0,
          topCity: 'الرياض'
        });
        
        setWaitlist([]);
        setReferrals([]);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  };

  // تصدير CSV
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getRewardIcon = (tier) => {
    switch (tier) {
      case 'diamond': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'gold': return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'silver': return <Award className="w-4 h-4 text-gray-400" />;
      case 'bronze': return <Gift className="w-4 h-4 text-orange-600" />;
      default: return null;
    }
  };

  const filteredWaitlist = waitlist.filter(item =>
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">لوحة الإدارة</h1>
            <p className="text-muted-foreground">مشروع مُثمّن</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="mt-1"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة إدارة مُثمّن</h1>
          <Button onClick={onLogout} variant="outline">
            تسجيل الخروج
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="waitlist">قائمة الانتظار</TabsTrigger>
            <TabsTrigger value="referrals">الإحالات</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي التسجيلات</p>
                    <p className="text-2xl font-bold">{stats.totalSignups}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تسجيلات اليوم</p>
                    <p className="text-2xl font-bold">{stats.todaySignups}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">هذا الأسبوع</p>
                    <p className="text-2xl font-bold">{stats.weekSignups}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-100">
                    <Gift className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الإحالات</p>
                    <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">إحصائيات سريعة</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">معدل التحويل</span>
                    <span className="font-bold">{stats.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">أكثر مدينة</span>
                    <span className="font-bold">{stats.topCity || 'لا توجد بيانات'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">متوسط الإحالات/مستخدم</span>
                    <span className="font-bold">
                      {stats.totalSignups > 0 
                        ? (stats.totalReferrals / stats.totalSignups).toFixed(2) 
                        : 0}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">التحديثات الأخيرة</h3>
                <div className="text-center text-muted-foreground py-8">
                  {loading ? 'جارٍ التحميل...' : 'لا توجد بيانات حتى الآن'}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* قائمة الانتظار */}
          <TabsContent value="waitlist" className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">قائمة المسجلين</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    onClick={() => exportToCSV(waitlist, 'waitlist')}
                    variant="outline"
                    disabled={waitlist.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تصدير CSV
                  </Button>
                </div>
              </div>

              {filteredWaitlist.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  {loading ? 'جارٍ التحميل...' : 'لا توجد تسجيلات حتى الآن'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الاسم</TableHead>
                        <TableHead>المدينة</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>كود الإحالة</TableHead>
                        <TableHead>أُحيل بواسطة</TableHead>
                        <TableHead>عدد الإحالات</TableHead>
                        <TableHead>المستوى</TableHead>
                        <TableHead>تاريخ التسجيل</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWaitlist.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{item.email}</TableCell>
                          <TableCell>{item.name || '-'}</TableCell>
                          <TableCell>{item.city || '-'}</TableCell>
                          <TableCell>{item.phone || '-'}</TableCell>
                          <TableCell className="font-mono text-sm">{item.ref_code}</TableCell>
                          <TableCell className="font-mono text-sm">{item.referred_by || '-'}</TableCell>
                          <TableCell className="text-center">{item.referrals_count}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getRewardIcon(item.reward_tier)}
                              <span className="capitalize">{item.reward_tier}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString('ar-SA')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* الإحالات */}
          <TabsContent value="referrals" className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">لوحة المتصدرين</h3>
                <Button
                  onClick={() => exportToCSV(referrals, 'referrals')}
                  variant="outline"
                  disabled={referrals.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير CSV
                </Button>
              </div>

              {referrals.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  {loading ? 'جارٍ التحميل...' : 'لا توجد إحالات حتى الآن'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الترتيب</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>كود الإحالة</TableHead>
                        <TableHead>عدد الإحالات</TableHead>
                        <TableHead>النقرات</TableHead>
                        <TableHead>معدل التحويل</TableHead>
                        <TableHead>المستوى</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-bold">#{index + 1}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell className="font-mono text-sm">{item.ref_code}</TableCell>
                          <TableCell className="text-center font-bold">{item.referrals_count}</TableCell>
                          <TableCell className="text-center">{item.clicks || 0}</TableCell>
                          <TableCell className="text-center">
                            {item.clicks > 0 
                              ? `${((item.referrals_count / item.clicks) * 100).toFixed(1)}%`
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getRewardIcon(item.reward_tier)}
                              <span className="capitalize">{item.reward_tier}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

