import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Copy, Share2, QrCode, Users, TrendingUp, Gift,
  CheckCircle2, Lock, Sparkles, ExternalLink
} from 'lucide-react';
import {
  ensureUserReferralCode,
  createReferralLink,
  generateQRCode,
  getReferralCodeStats,
  calculateRewards
} from '../lib/referralCode';

export default function Referrals() {
  const [userId] = useState('demo_user'); // في الإنتاج سيأتي من نظام المصادقة
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [stats, setStats] = useState({ clicks: 0, signups: 0, qualified: 0 });
  const [rewards, setRewards] = useState([]);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // إنشاء أو استرجاع رمز الإحالة
    const code = ensureUserReferralCode(userId);
    setReferralCode(code);
    
    // إنشاء الرابط
    const link = createReferralLink(code);
    setReferralLink(link);
    
    // تحميل الإحصائيات
    const codeStats = getReferralCodeStats(code);
    setStats(codeStats);
    
    // حساب المكافآت
    const userRewards = calculateRewards(codeStats.qualified);
    setRewards(userRewards);
    
    // توليد QR Code
    generateQRCode(code).then(url => setQrCodeUrl(url));
  }, [userId]);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'مُثمّن - تقييم عقاري ذكي',
          text: 'جرّب مُثمّن للتقييم العقاري بالذكاء الاصطناعي',
          url: referralLink
        });
      } catch (err) {
        console.log('خطأ في المشاركة:', err);
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* الهيدر */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Gift className="w-4 h-4" />
            <span>برنامج الإحالات</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-balance">
            إحالاتي
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            انشر كودك وخَلّ مثمّن يكبر بعقلك
          </p>
        </div>

        {/* بطاقة رمز الإحالة */}
        <Card className="p-8 mb-8 card-gradient">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">رمز الإحالة الخاص بك</h2>
            <p className="text-muted-foreground">
              كل إحالة ترفع ذكاء المنصّة وتحجز لك مزايا خاصّة
            </p>
          </div>

          {/* الكود */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="px-8 py-4 bg-gradient-to-r from-primary/10 to-purple-100 rounded-xl border-2 border-primary/20">
              <span className="text-4xl font-black tracking-wider">{referralCode}</span>
            </div>
            <Button
              size="lg"
              onClick={copyCode}
              className="gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  نسخ
                </>
              )}
            </Button>
          </div>

          {/* الرابط */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">رابط الإحالة</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-white px-4 py-2 rounded-lg text-sm border"
                dir="ltr"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
              >
                {linkCopied ? 'تم النسخ' : 'نسخ'}
              </Button>
            </div>
          </div>

          {/* أزرار المشاركة */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              onClick={shareLink}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowQR(!showQR)}
              className="gap-2"
            >
              <QrCode className="w-4 h-4" />
              {showQR ? 'إخفاء QR' : 'إظهار QR'}
            </Button>
          </div>

          {/* QR Code */}
          {showQR && qrCodeUrl && (
            <div className="mt-6 text-center animate-slide-in">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48 mx-auto rounded-lg border-2 border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                امسح الكود للوصول السريع
              </p>
            </div>
          )}
        </Card>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">النقرات</p>
                <p className="text-3xl font-black">{stats.clicks}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">التسجيلات</p>
                <p className="text-3xl font-black">{stats.signups}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المؤهلة</p>
                <p className="text-3xl font-black">{stats.qualified}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* الجوائز */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">جوائزك</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-4 rounded-lg border-2 ${
                  reward.unlocked
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{reward.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{reward.nameAr}</h3>
                      {reward.unlocked && (
                        <Badge className="bg-green-600">مفعّلة</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stats.qualified < 10 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                💡 <strong>قريبًا:</strong> خريطة الوعي العقاري الأولى في المملكة 🇸🇦
                <br />
                افتحها بدعمك المبكر - {10 - stats.qualified} إحالات إضافية فقط!
              </p>
            </div>
          )}
        </Card>

        {/* معلومات إضافية */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">كيف تعمل الإحالات؟</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• شارك رمزك أو رابطك مع أصدقائك</li>
                <li>• عند تسجيلهم، تُحسب إحالة جديدة لك</li>
                <li>• بعد تأكيد البريد الإلكتروني، تصبح الإحالة "مؤهلة"</li>
                <li>• كل 1، 3، 10 إحالات مؤهلة تفتح مكافأة جديدة</li>
                <li>• الحد الأقصى: 50 إحالة شهرياً في النسخة التجريبية</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

