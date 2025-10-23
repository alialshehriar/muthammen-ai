import { useState } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  Users, UserPlus, UserCheck, UserX, Mail, Phone, Calendar,
  Gift, FileText, Search, Edit, Trash2, Ban, CheckCircle
} from 'lucide-react';

const UsersTab = ({ loading }) => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // تحميل المستخدمين
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users?limit=100&search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
          setUserStats(data.data.stats || null);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث حالة المستخدم
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // عرض تفاصيل المستخدم
  const viewUserDetails = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/user-details?id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserDetails(data.data);
          setShowDetailsModal(true);
        }
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // حذف مستخدم
  const deleteUser = async (userId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // تحميل البيانات عند التحميل الأول
  useState(() => {
    loadUsers();
  }, []);

  if (loading || isLoading) {
    return (
      <div className="text-center text-muted-foreground py-12">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <>
      {/* إحصائيات المستخدمين */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
                <p className="text-3xl font-black">{userStats.total_users}</p>
                <p className="text-xs text-green-600">+{userStats.new_this_week} هذا الأسبوع</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">مستخدمين نشطين</p>
                <p className="text-3xl font-black">{userStats.active_users}</p>
                <p className="text-xs text-muted-foreground">نشط اليوم: {userStats.active_today}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">مستخدمين جدد</p>
                <p className="text-3xl font-black">{userStats.new_this_month}</p>
                <p className="text-xs text-muted-foreground">هذا الشهر</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-100">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">موقوفين</p>
                <p className="text-3xl font-black">{userStats.suspended_users}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* بحث وفلترة */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="البحث عن مستخدم (البريد، الهاتف، الاسم)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          <Button onClick={loadUsers}>
            <Search className="w-4 h-4 mr-2" />
            بحث
          </Button>
        </div>
      </Card>

      {/* جدول المستخدمين */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">جميع المستخدمين ({users.length})</h3>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            إضافة مستخدم
          </Button>
        </div>

        {users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-right p-3 font-bold">ID</th>
                  <th className="text-right p-3 font-bold">الاسم</th>
                  <th className="text-right p-3 font-bold">البريد الإلكتروني</th>
                  <th className="text-right p-3 font-bold">الهاتف</th>
                  <th className="text-right p-3 font-bold">كود الإحالة</th>
                  <th className="text-right p-3 font-bold">التقييمات</th>
                  <th className="text-right p-3 font-bold">الإحالات</th>
                  <th className="text-right p-3 font-bold">النقاط</th>
                  <th className="text-right p-3 font-bold">الحالة</th>
                  <th className="text-right p-3 font-bold">تاريخ التسجيل</th>
                  <th className="text-right p-3 font-bold">آخر دخول</th>
                  <th className="text-right p-3 font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">{user.id}</td>
                    <td className="p-3 font-semibold">{user.name || '-'}</td>
                    <td className="p-3">
                      {user.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-3">
                      {user.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="font-mono">
                        {user.referral_code}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{user.total_evaluations}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Gift className="w-4 h-4 text-muted-foreground" />
                        <span>{user.total_referrals}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary">{user.total_points}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'destructive'}
                        className="cursor-pointer"
                        onClick={() => updateUserStatus(
                          user.id, 
                          user.status === 'active' ? 'suspended' : 'active'
                        )}
                      >
                        {user.status === 'active' ? 'نشط' : 'موقوف'}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {new Date(user.created_at).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="p-3 text-sm whitespace-nowrap">
                      {user.last_login ? (
                        new Date(user.last_login).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      ) : '-'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => viewUserDetails(user.id)}
                          title="عرض التفاصيل"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateUserStatus(
                            user.id,
                            user.status === 'active' ? 'suspended' : 'active'
                          )}
                          title={user.status === 'active' ? 'تعليق' : 'تفعيل'}
                        >
                          {user.status === 'active' ? (
                            <Ban className="w-4 h-4 text-red-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteUser(user.id)}
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            لا يوجد مستخدمين مسجلين حتى الآن
          </div>
        )}
      </Card>
    </>
  );
};

export default UsersTab;




      {/* Modal تفاصيل المستخدم */}
      {showDetailsModal && userDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">تفاصيل المستخدم</h2>
                <p className="text-sm text-muted-foreground">
                  {userDetails.user.name || userDetails.user.email || userDetails.user.phone}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowDetailsModal(false)}
              >
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* معلومات أساسية */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">المعلومات الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-mono">{userDetails.user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم</p>
                    <p>{userDetails.user.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p>{userDetails.user.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الهاتف</p>
                    <p>{userDetails.user.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">كود الإحالة</p>
                    <Badge variant="outline" className="font-mono">
                      {userDetails.user.referral_code}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">أُحيل بواسطة</p>
                    <p>{userDetails.user.referred_by || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الحالة</p>
                    <Badge variant={userDetails.user.status === 'active' ? 'default' : 'destructive'}>
                      {userDetails.user.status === 'active' ? 'نشط' : 'موقوف'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                    <p>{new Date(userDetails.user.created_at).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </Card>

              {/* إحصائيات */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-muted-foreground">التقييمات</p>
                  </div>
                  <p className="text-2xl font-bold">{userDetails.stats.total_evaluations}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-muted-foreground">الإحالات</p>
                  </div>
                  <p className="text-2xl font-bold">{userDetails.stats.total_referrals}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <p className="text-sm text-muted-foreground">النقاط</p>
                  </div>
                  <p className="text-2xl font-bold">{userDetails.stats.total_points}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <p className="text-sm text-muted-foreground">الأحداث</p>
                  </div>
                  <p className="text-2xl font-bold">{userDetails.stats.total_events}</p>
                </Card>
              </div>

              {/* تقييمات المستخدم */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">
                  التقييمات ({userDetails.evaluations.length})
                </h3>
                {userDetails.evaluations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-2">ID</th>
                          <th className="text-right p-2">المدينة</th>
                          <th className="text-right p-2">الحي</th>
                          <th className="text-right p-2">النوع</th>
                          <th className="text-right p-2">المساحة</th>
                          <th className="text-right p-2">القيمة</th>
                          <th className="text-right p-2">التاريخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userDetails.evaluations.map((eval) => (
                          <tr key={eval.id} className="border-b">
                            <td className="p-2 font-mono">{eval.id}</td>
                            <td className="p-2">{eval.city}</td>
                            <td className="p-2">{eval.district}</td>
                            <td className="p-2">{eval.property_type}</td>
                            <td className="p-2">{eval.area} م²</td>
                            <td className="p-2 font-semibold">
                              {parseFloat(eval.estimated_value).toLocaleString('ar-SA')} ر.س
                            </td>
                            <td className="p-2">
                              {new Date(eval.created_at).toLocaleDateString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    لا توجد تقييمات
                  </p>
                )}
              </Card>

              {/* إحالات المستخدم */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">
                  الإحالات ({userDetails.referrals.length})
                </h3>
                {userDetails.referrals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-2">ID</th>
                          <th className="text-right p-2">الاسم</th>
                          <th className="text-right p-2">البريد/الهاتف</th>
                          <th className="text-right p-2">كود الإحالة</th>
                          <th className="text-right p-2">الحالة</th>
                          <th className="text-right p-2">تاريخ التسجيل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userDetails.referrals.map((ref) => (
                          <tr key={ref.id} className="border-b">
                            <td className="p-2 font-mono">{ref.id}</td>
                            <td className="p-2">{ref.name || '-'}</td>
                            <td className="p-2">{ref.email || ref.phone}</td>
                            <td className="p-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {ref.referral_code}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Badge variant={ref.status === 'active' ? 'default' : 'destructive'}>
                                {ref.status === 'active' ? 'نشط' : 'موقوف'}
                              </Badge>
                            </td>
                            <td className="p-2">
                              {new Date(ref.created_at).toLocaleDateString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    لا توجد إحالات
                  </p>
                )}
              </Card>

              {/* مكافآت المستخدم */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">
                  المكافآت ({userDetails.rewards.length})
                </h3>
                {userDetails.rewards.length > 0 ? (
                  <div className="space-y-2">
                    {userDetails.rewards.map((reward) => (
                      <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-semibold">{reward.reward_type}</p>
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                        </div>
                        <div className="text-left">
                          <Badge variant="secondary">+{reward.points} نقطة</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(reward.created_at).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    لا توجد مكافآت
                  </p>
                )}
              </Card>

              {/* أحداث المستخدم */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">
                  آخر الأحداث ({userDetails.events.length})
                </h3>
                {userDetails.events.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {userDetails.events.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-2 border-b">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{event.event_type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.created_at).toLocaleString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    لا توجد أحداث
                  </p>
                )}
              </Card>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                إغلاق
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDetailsModal(false);
                  updateUserStatus(userDetails.user.id, 
                    userDetails.user.status === 'active' ? 'suspended' : 'active'
                  );
                }}
              >
                {userDetails.user.status === 'active' ? 'تعليق الحساب' : 'تفعيل الحساب'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersTab;

