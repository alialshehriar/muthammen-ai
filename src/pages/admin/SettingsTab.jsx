import { useState } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import {
  Settings, Save, Trophy, Award, Gift, Crown, CheckCircle2, AlertCircle
} from 'lucide-react';

const SettingsTab = () => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  // حدود المكافآت
  const [rewardLimits, setRewardLimits] = useState({
    bronze: 3,
    silver: 10,
    gold: 25,
    diamond: 50
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // في الإنتاج، يجب حفظ الإعدادات في قاعدة البيانات
      // هنا نحفظها في localStorage كمثال
      localStorage.setItem('reward_limits', JSON.stringify(rewardLimits));
      
      // محاكاة تأخير الحفظ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setRewardLimits({
      bronze: 3,
      silver: 10,
      gold: 25,
      diamond: 50
    });
    setMessage({ type: 'success', text: 'تم إعادة تعيين الإعدادات للقيم الافتراضية' });
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-blue-100">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black">إعدادات النظام</h2>
            <p className="text-sm text-muted-foreground">إدارة حدود المكافآت والإعدادات العامة</p>
          </div>
        </div>

        {message && (
          <Alert 
            variant={message.type === 'success' ? 'default' : 'destructive'}
            className="mb-6"
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* حدود المكافآت */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              حدود المكافآت
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              حدد الحد الأدنى من الإحالات المطلوبة للحصول على كل مستوى من المكافآت
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* برونزي */}
              <div className="p-4 rounded-lg border-2 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-orange-600" />
                  <Label className="text-lg font-bold text-orange-900">
                    مستوى برونزي
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bronze" className="text-sm text-orange-700">
                    الحد الأدنى من الإحالات
                  </Label>
                  <Input
                    id="bronze"
                    type="number"
                    min="1"
                    value={rewardLimits.bronze}
                    onChange={(e) => setRewardLimits({
                      ...rewardLimits,
                      bronze: parseInt(e.target.value) || 1
                    })}
                    className="border-orange-300"
                  />
                </div>
              </div>

              {/* فضي */}
              <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-gray-600" />
                  <Label className="text-lg font-bold text-gray-900">
                    مستوى فضي
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="silver" className="text-sm text-gray-700">
                    الحد الأدنى من الإحالات
                  </Label>
                  <Input
                    id="silver"
                    type="number"
                    min="1"
                    value={rewardLimits.silver}
                    onChange={(e) => setRewardLimits({
                      ...rewardLimits,
                      silver: parseInt(e.target.value) || 1
                    })}
                    className="border-gray-300"
                  />
                </div>
              </div>

              {/* ذهبي */}
              <div className="p-4 rounded-lg border-2 border-yellow-300 bg-yellow-50">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <Label className="text-lg font-bold text-yellow-900">
                    مستوى ذهبي
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gold" className="text-sm text-yellow-700">
                    الحد الأدنى من الإحالات
                  </Label>
                  <Input
                    id="gold"
                    type="number"
                    min="1"
                    value={rewardLimits.gold}
                    onChange={(e) => setRewardLimits({
                      ...rewardLimits,
                      gold: parseInt(e.target.value) || 1
                    })}
                    className="border-yellow-300"
                  />
                </div>
              </div>

              {/* ماسي */}
              <div className="p-4 rounded-lg border-2 border-purple-300 bg-purple-50">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <Label className="text-lg font-bold text-purple-900">
                    مستوى ماسي
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diamond" className="text-sm text-purple-700">
                    الحد الأدنى من الإحالات
                  </Label>
                  <Input
                    id="diamond"
                    type="number"
                    min="1"
                    value={rewardLimits.diamond}
                    onChange={(e) => setRewardLimits({
                      ...rewardLimits,
                      diamond: parseInt(e.target.value) || 1
                    })}
                    className="border-purple-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              size="lg"
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <Save className="w-5 h-5 animate-pulse" />
                  جارٍ الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ الإعدادات
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleReset} 
              variant="outline"
              size="lg"
              disabled={saving}
            >
              إعادة تعيين
            </Button>
          </div>
        </div>
      </Card>

      {/* معلومات إضافية */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          ملاحظات مهمة
        </h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>يتم تحديث مستويات المكافآت تلقائياً عند تغيير الحدود</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>تأكد من أن الحدود منطقية ومتصاعدة (برونزي &lt; فضي &lt; ذهبي &lt; ماسي)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>في الإنتاج، يتم حفظ الإعدادات في قاعدة البيانات</span>
          </li>
        </ul>
      </Card>
    </>
  );
};

export default SettingsTab;

