import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  Brain, Zap, CheckCircle2, XCircle, AlertCircle, Clock, Activity, RefreshCw
} from 'lucide-react';

const AIMonitorTab = ({ agentLogs, agentStats, testAgent, refreshing, loading }) => {
  if (loading || !agentStats) {
    return (
      <div className="text-center text-muted-foreground py-12">
        جارٍ التحميل...
      </div>
    );
  }

  // تحديد حالة النظام
  const systemStatus = agentStats.status === 'operational' ? 'operational' : 'down';
  const statusColor = systemStatus === 'operational' ? 'text-green-600' : 'text-red-600';
  const statusBg = systemStatus === 'operational' ? 'bg-green-100' : 'bg-red-100';
  const statusText = systemStatus === 'operational' ? 'يعمل بشكل صحيح' : 'متوقف';

  return (
    <>
      {/* حالة النظام */}
      <Card className={`p-6 border-2 ${systemStatus === 'operational' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${statusBg}`}>
              <Brain className={`w-8 h-8 ${statusColor}`} />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-1">حالة وكيل الذكاء الاصطناعي</h2>
              <div className="flex items-center gap-2">
                {systemStatus === 'operational' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-lg font-bold ${statusColor}`}>{statusText}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={testAgent} 
            size="lg"
            disabled={refreshing}
            className="gap-2"
          >
            {refreshing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                جارٍ الاختبار...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                اختبار الوكيل الآن
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* إحصائيات الوكيل */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">إجمالي الاختبارات</p>
              <p className="text-3xl font-black">{agentStats.totalTests || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">اختبارات ناجحة</p>
              <p className="text-3xl font-black">{agentStats.successfulTests || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">اختبارات فاشلة</p>
              <p className="text-3xl font-black">{agentStats.failedTests + agentStats.errorTests || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">متوسط الاستجابة</p>
              <p className="text-3xl font-black">{agentStats.avgDuration || 0}<span className="text-sm">ms</span></p>
            </div>
          </div>
        </Card>
      </div>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">معلومات الأداء</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
              <span className="text-sm font-medium">نسبة النجاح</span>
              <span className="text-2xl font-bold text-green-600">
                {agentStats.successRate || 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
              <span className="text-sm font-medium">متوسط وقت الاستجابة</span>
              <span className="text-2xl font-bold text-blue-600">
                {agentStats.avgDuration || 0} ms
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50">
              <span className="text-sm font-medium">آخر اختبار</span>
              <span className="text-sm font-bold text-purple-600">
                {agentStats.lastTestTime 
                  ? new Date(agentStats.lastTestTime).toLocaleString('ar-SA')
                  : 'لا يوجد'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">التوصيات</h3>
          <div className="space-y-3">
            {agentStats.successRate >= 95 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">أداء ممتاز</p>
                  <p className="text-sm text-green-700">الوكيل يعمل بشكل مثالي</p>
                </div>
              </div>
            )}
            
            {agentStats.successRate < 95 && agentStats.successRate >= 80 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">أداء جيد</p>
                  <p className="text-sm text-yellow-700">يوجد بعض الأخطاء البسيطة</p>
                </div>
              </div>
            )}
            
            {agentStats.successRate < 80 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">يحتاج لمراجعة</p>
                  <p className="text-sm text-red-700">نسبة الفشل مرتفعة، يرجى التحقق من API Key</p>
                </div>
              </div>
            )}
            
            {agentStats.avgDuration > 5000 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900">استجابة بطيئة</p>
                  <p className="text-sm text-orange-700">متوسط الاستجابة أكثر من 5 ثواني</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* سجل الاختبارات */}
      <Card className="p-6">
        <h3 className="font-bold text-xl mb-6">سجل الاختبارات الأخيرة (آخر 50)</h3>
        
        {agentLogs.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            لا توجد اختبارات مسجلة حتى الآن
          </div>
        ) : (
          <div className="space-y-3">
            {agentLogs.map((log, index) => (
              <div 
                key={log.id || index}
                className={`p-4 rounded-lg border-2 ${
                  log.status === 'success' ? 'bg-green-50 border-green-200' :
                  log.status === 'failed' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : log.status === 'failed' ? (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={log.status === 'success' ? 'success' : 'destructive'}>
                          {log.status === 'success' ? 'نجح' : 'فشل'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      
                      {log.response && (
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                          {log.response}
                        </p>
                      )}
                      
                      {log.error && (
                        <p className="text-sm text-red-700 mb-2">
                          <strong>الخطأ:</strong> {log.error}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {log.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.duration}ms
                          </span>
                        )}
                        {log.model && (
                          <span>النموذج: {log.model}</span>
                        )}
                        {log.tokensUsed && (
                          <span>Tokens: {log.tokensUsed}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default AIMonitorTab;

