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
                          onClick={() => updateUserStatus(
                            user.id,
                            user.status === 'active' ? 'suspended' : 'active'
                          )}
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

