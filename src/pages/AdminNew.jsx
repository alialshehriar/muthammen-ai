import { useState, useEffect } from 'react';
import OverviewTab from './admin/OverviewTab.jsx';
import WaitlistTab from './admin/WaitlistTab.jsx';
import ReferralsTab from './admin/ReferralsTab.jsx';
import AIMonitorTab from './admin/AIMonitorTab.jsx';
import SettingsTab from './admin/SettingsTab.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  Users, TrendingUp, Mail, Gift, Download, Search,
  Trophy, Crown, Award, Calendar, MapPin, Phone,
  BarChart3, Activity, Clock, MousePointerClick,
  Brain, Zap, CheckCircle2, XCircle, AlertCircle,
  RefreshCw, Settings, LogOut, Eye, Filter
} from 'lucide-react';


const AdminNew = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [agentLogs, setAgentLogs] = useState([]);
  const [agentStats, setAgentStats] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [evaluationsPagination, setEvaluationsPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [rewardFilter, setRewardFilter] = useState('');

  // التحقق من كلمة المرور
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // في الإنتاج، يجب التحقق من خلال API محمي
      const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'Muthammen@2025!Secure';
      
      if (password === ADMIN_PASS) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', 'true');
        await loadAllData();
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  // التحقق من الجلسة عند التحميل
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  // تحميل جميع البيانات
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadWaitlist(),
        loadAgentLogs(),
        loadEvaluations()
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحميل الإحصائيات
  const loadStats = async () => {
    try {
      // جلب إحصائيات التقييمات
      const evaluationsResponse = await fetch('/api/admin/evaluations');
      let evaluationsData = null;
      if (evaluationsResponse.ok) {
        const evalData = await evaluationsResponse.json();
        if (evalData.success && evalData.data) {
          evaluationsData = evalData.data;
        }
      }
      
      // جلب إحصائيات waitlist و referrals
      const statsResponse = await fetch('/api/admin/stats');
      let statsData = null;
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        if (data.success) {
          statsData = data.stats;
        }
      }
      
      // دمج البيانات
      const combinedStats = {
        ...statsData,
        totalEvaluations: evaluationsData?.stats?.total || 0,
        avgPropertyValue: parseFloat(evaluationsData?.stats?.avgValue) || 0,
        evaluationsThisWeek: evaluationsData?.stats?.thisWeek || 0,
        evaluationsThisMonth: evaluationsData?.stats?.thisMonth || 0,
        cities: evaluationsData?.cities || [],
        propertyTypes: evaluationsData?.propertyTypes || []
      };
      
      setStats(combinedStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // تحميل قائمة الانتظار
  const loadWaitlist = async () => {
    try {
      const response = await fetch('/api/waitlist/all');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWaitlist(data.signups || []);
        }
      }
    } catch (err) {
      console.error('Error loading waitlist:', err);
    }
  };

  // تحميل التقييمات
  const loadEvaluations = async () => {
    try {
      const response = await fetch('/api/admin/evaluations?limit=100');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setEvaluations(data.data.evaluations || []);
          setEvaluationsPagination(data.data.pagination || null);
        }
      }
    } catch (err) {
      console.error('Error loading evaluations:', err);
    }
  };

  // تحميل سجل الوكيل
  const loadAgentLogs = async () => {
    try {
      const response = await fetch('/api/agent/logs?limit=50');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAgentLogs(data.logs || []);
          setAgentStats(data.stats || null);
        }
      }
    } catch (err) {
      console.error('Error loading agent logs:', err);
    }
  };

  // اختبار الوكيل
  const testAgent = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/agent/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testMessage: 'اختبار من لوحة الإدارة' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ نجح الاختبار!\n\nالمدة: ${data.duration}ms\nالنموذج: ${data.model}\nTokens: ${data.tokensUsed}`);
      } else {
        alert(`❌ فشل الاختبار\n\nالخطأ: ${data.error}`);
      }
      
      await loadAgentLogs();
    } catch (err) {
      alert('❌ حدث خطأ أثناء الاختبار');
    } finally {
      setRefreshing(false);
    }
  };

  // تحديث البيانات
  const refreshData = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // تصدير CSV
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      }).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // أيقونات المكافآت
  const getRewardIcon = (tier) => {
    switch (tier) {
      case 'diamond': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'gold': return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'silver': return <Award className="w-4 h-4 text-gray-400" />;
      case 'bronze': return <Gift className="w-4 h-4 text-orange-600" />;
      default: return null;
    }
  };

  // ألوان المكافآت
  const getRewardColor = (tier) => {
    switch (tier) {
      case 'diamond': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // تصفية قائمة الانتظار
  const filteredWaitlist = waitlist.filter(item => {
    const matchesSearch = !searchTerm || 
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm);
    
    const matchesCity = !cityFilter || item.city === cityFilter;
    const matchesReward = !rewardFilter || item.reward_tier === rewardFilter;
    
    return matchesSearch && matchesCity && matchesReward;
  });

  // الحصول على قائمة المدن الفريدة
  const uniqueCities = [...new Set(waitlist.map(item => item.city).filter(Boolean))];
  
  // الحصول على قائمة المكافآت الفريدة
  const uniqueRewards = ['bronze', 'silver', 'gold', 'diamond'];

  // تسجيل الخروج
  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    if (onLogout) onLogout();
  };

  // صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Card className="w-full max-w-md p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">لوحة الإدارة</h1>
            <p className="text-muted-foreground">مشروع مُثمّن - نظام إدارة متقدم</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="h-12"
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  جارٍ التحقق...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>© 2025 مُثمّن. جميع الحقوق محفوظة.</p>
          </div>
        </Card>
      </div>
    );
  }

  // لوحة الإدارة الرئيسية
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black">لوحة إدارة مُثمّن</h1>
                <p className="text-sm text-muted-foreground">نظام إدارة متقدم</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={refreshData} 
                variant="outline" 
                size="sm"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="waitlist" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">قائمة الانتظار</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="gap-2">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">الإحالات</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">مراقبة الذكاء</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          {/* نظرة عامة - Overview */}
          <TabsContent value="overview" className="space-y-6">
            {loading && !stats ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">جارٍ تحميل البيانات...</p>
              </div>
            ) : stats ? (
              <OverviewTab stats={stats} />
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
              </div>
            )}
          </TabsContent>

          {/* قائمة الانتظار - Waitlist */}
          <TabsContent value="waitlist" className="space-y-6">
            <WaitlistTab 
              waitlist={filteredWaitlist}
              allWaitlist={waitlist}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              cityFilter={cityFilter}
              setCityFilter={setCityFilter}
              rewardFilter={rewardFilter}
              setRewardFilter={setRewardFilter}
              uniqueCities={uniqueCities}
              uniqueRewards={uniqueRewards}
              exportToCSV={exportToCSV}
              getRewardIcon={getRewardIcon}
              getRewardColor={getRewardColor}
              loading={loading}
            />
          </TabsContent>

          {/* الإحالات - Referrals */}
          <TabsContent value="referrals" className="space-y-6">
            <ReferralsTab 
              stats={stats}
              waitlist={waitlist}
              getRewardIcon={getRewardIcon}
              getRewardColor={getRewardColor}
              loading={loading}
            />
          </TabsContent>

          {/* مراقبة الذكاء الاصطناعي - AI Monitor */}
          <TabsContent value="ai" className="space-y-6">
            <AIMonitorTab 
              agentLogs={agentLogs}
              agentStats={agentStats}
              evaluations={evaluations}
              evaluationsPagination={evaluationsPagination}
              testAgent={testAgent}
              refreshing={refreshing}
              loading={loading}
            />
          </TabsContent>

          {/* الإعدادات - Settings */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminNew;

