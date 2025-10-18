import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Building2, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // التحقق من البيانات
      if (!formData.email || !formData.password) {
        setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        setLoading(false);
        return;
      }

      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('البريد الإلكتروني غير صحيح');
        setLoading(false);
        return;
      }

      if (!isLogin) {
        // التحقق من التسجيل
        if (!formData.name) {
          setError('يرجى إدخال الاسم الكامل');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('كلمة المرور غير متطابقة');
          setLoading(false);
          return;
        }
      }

      // محاكاة عملية تسجيل الدخول/التسجيل
      await new Promise(resolve => setTimeout(resolve, 1000));

      // حفظ بيانات المستخدم في localStorage
      const userData = {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        loginTime: new Date().toISOString(),
        isAdmin: formData.email === 'ali.alshehro.ar@gmail.com' // المستخدم الإداري
      };

      localStorage.setItem('muthammen_user', JSON.stringify(userData));

      // استدعاء callback للنجاح
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

    } catch (err) {
      setError('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl primary-gradient">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-black text-foreground">مُثمّن</h1>
              <p className="text-sm text-muted-foreground">تقييم عقاري ذكي بالذكاء الاصطناعي</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="text-muted-foreground">
            {isLogin ? 'مرحباً بعودتك! سجل دخولك للمتابعة' : 'انضم إلى منصة مُثمّن الآن'}
          </p>
        </div>

        {/* نموذج التسجيل */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* الاسم (للتسجيل فقط) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="أدخل اسمك الكامل"
                  disabled={loading}
                />
              </div>
            )}

            {/* البريد الإلكتروني */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
                disabled={loading}
              />
            </div>

            {/* كلمة المرور */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* تأكيد كلمة المرور (للتسجيل فقط) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            )}

            {/* رسالة الخطأ */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* زر الإرسال */}
            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
                </>
              )}
            </Button>
          </form>

          {/* التبديل بين تسجيل الدخول والتسجيل */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    confirmPassword: ''
                  });
                }}
                className="text-primary font-semibold hover:underline"
                disabled={loading}
              >
                {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </button>
            </p>
          </div>
        </Card>

        {/* ملاحظة */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            بالتسجيل، أنت توافق على شروط الخدمة وسياسة الخصوصية
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

