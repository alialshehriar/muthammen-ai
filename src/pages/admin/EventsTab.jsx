import { Card } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  Activity, Eye, Share2, UserPlus, LogIn, LogOut, Gift, Users, FileText, AlertCircle, Clock
} from 'lucide-react';

const EventsTab = ({ events, eventStats, dailyActivity, loading }) => {
  if (loading || !events) {
    return (
      <div className="text-center text-muted-foreground py-12">
        جارٍ التحميل...
      </div>
    );
  }

  // أيقونات الأحداث
  const getEventIcon = (eventType) => {
    const icons = {
      'evaluation_created': FileText,
      'evaluation_viewed': Eye,
      'evaluation_shared': Share2,
      'user_registered': UserPlus,
      'user_login': LogIn,
      'user_logout': LogOut,
      'referral_clicked': Gift,
      'referral_converted': Gift,
      'reward_earned': Gift,
      'waitlist_joined': Users,
      'page_view': Eye,
      'form_submitted': FileText,
      'error_occurred': AlertCircle
    };
    const Icon = icons[eventType] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  // ألوان الأحداث
  const getEventColor = (eventType) => {
    const colors = {
      'evaluation_created': 'bg-green-100 text-green-700',
      'evaluation_viewed': 'bg-blue-100 text-blue-700',
      'evaluation_shared': 'bg-purple-100 text-purple-700',
      'user_registered': 'bg-indigo-100 text-indigo-700',
      'user_login': 'bg-cyan-100 text-cyan-700',
      'user_logout': 'bg-gray-100 text-gray-700',
      'referral_clicked': 'bg-yellow-100 text-yellow-700',
      'referral_converted': 'bg-orange-100 text-orange-700',
      'reward_earned': 'bg-pink-100 text-pink-700',
      'waitlist_joined': 'bg-teal-100 text-teal-700',
      'page_view': 'bg-slate-100 text-slate-700',
      'form_submitted': 'bg-lime-100 text-lime-700',
      'error_occurred': 'bg-red-100 text-red-700'
    };
    return colors[eventType] || 'bg-gray-100 text-gray-700';
  };

  // ترجمة نوع الحدث
  const translateEventType = (eventType) => {
    const translations = {
      'evaluation_created': 'تقييم جديد',
      'evaluation_viewed': 'مشاهدة تقييم',
      'evaluation_shared': 'مشاركة تقييم',
      'user_registered': 'تسجيل مستخدم',
      'user_login': 'تسجيل دخول',
      'user_logout': 'تسجيل خروج',
      'referral_clicked': 'نقر على إحالة',
      'referral_converted': 'تحويل إحالة',
      'reward_earned': 'كسب مكافأة',
      'waitlist_joined': 'انضمام لقائمة الانتظار',
      'page_view': 'مشاهدة صفحة',
      'form_submitted': 'إرسال نموذج',
      'error_occurred': 'حدث خطأ'
    };
    return translations[eventType] || eventType;
  };

  return (
    <>
      {/* إحصائيات الأحداث */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">إجمالي الأحداث</p>
              <p className="text-3xl font-black">
                {eventStats?.reduce((sum, stat) => sum + parseInt(stat.count), 0) || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">آخر 24 ساعة</p>
              <p className="text-3xl font-black">
                {eventStats?.reduce((sum, stat) => sum + parseInt(stat.last_24h), 0) || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">آخر 7 أيام</p>
              <p className="text-3xl font-black">
                {eventStats?.reduce((sum, stat) => sum + parseInt(stat.last_7d), 0) || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">آخر 30 يوم</p>
              <p className="text-3xl font-black">
                {eventStats?.reduce((sum, stat) => sum + parseInt(stat.last_30d), 0) || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* إحصائيات حسب النوع */}
      {eventStats && eventStats.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-xl mb-6">الأحداث حسب النوع</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventStats.map((stat) => (
              <div key={stat.event_type} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-2 rounded-lg ${getEventColor(stat.event_type)}`}>
                      {getEventIcon(stat.event_type)}
                    </span>
                    <span className="font-semibold">{translateEventType(stat.event_type)}</span>
                  </div>
                  <Badge variant="secondary">{stat.count}</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>آخر 24 ساعة: {stat.last_24h}</div>
                  <div>آخر 7 أيام: {stat.last_7d}</div>
                  <div>آخر 30 يوم: {stat.last_30d}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* جميع الأحداث */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">جميع الأحداث ({events.length})</h3>
        </div>
        
        {events && events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <div 
                key={event.id}
                className="p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className={`p-2 rounded-lg ${getEventColor(event.event_type)}`}>
                      {getEventIcon(event.event_type)}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{translateEventType(event.event_type)}</span>
                        <Badge variant="outline" className="text-xs">
                          ID: {event.id}
                        </Badge>
                      </div>
                      
                      {event.event_data && Object.keys(event.event_data).length > 0 && (
                        <div className="text-sm text-gray-600 mb-2">
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(event.event_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {event.user_id && (
                          <span>مستخدم: {event.user_id}</span>
                        )}
                        {event.session_id && (
                          <span>جلسة: {event.session_id.substring(0, 8)}...</span>
                        )}
                        {event.ip_address && (
                          <span>IP: {event.ip_address}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.created_at).toLocaleString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            لا توجد أحداث مسجلة حتى الآن
          </div>
        )}
      </Card>
    </>
  );
};

export default EventsTab;

