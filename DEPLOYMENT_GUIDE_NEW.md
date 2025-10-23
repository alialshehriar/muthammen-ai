# دليل النشر الجديد - New Deployment Guide

## 📋 ملخص التحديثات الأخيرة

تم إضافة لوحة إدارة متقدمة مع مراقبة الذكاء الاصطناعي ونظام اختبارات الصحة وتحليلات شاملة.

### الملفات الجديدة:
- `src/pages/AdminNew.jsx` - لوحة الإدارة الرئيسية الجديدة
- `src/pages/admin/OverviewTab.jsx` - صفحة النظرة العامة
- `src/pages/admin/WaitlistTab.jsx` - صفحة قائمة الانتظار
- `src/pages/admin/ReferralsTab.jsx` - صفحة الإحالات
- `src/pages/admin/AIMonitorTab.jsx` - صفحة مراقبة الذكاء الاصطناعي
- `src/pages/admin/SettingsTab.jsx` - صفحة الإعدادات
- `api/admin/stats.js` - API الإحصائيات الشاملة
- `api/agent/test.js` - API اختبار الوكيل
- `api/agent/logs.js` - API سجل اختبارات الوكيل
- `api/waitlist/all.js` - API الحصول على جميع المسجلين
- `api/health.js` - API اختبارات الصحة
- `test-agent.js` - سكريبت اختبار الوكيل المستقل

### الملفات المعدلة:
- `src/App.jsx` - تحديث لاستخدام AdminNew بدلاً من Admin
- `package.json` - إضافة dotenv
- `pnpm-lock.yaml` - تحديث التبعيات

---

## 🚀 خطوات النشر على Vercel

### الطريقة 1: النشر اليدوي (موصى بها)

بما أن هناك مشكلة في صلاحيات GitHub Token، يمكنك النشر يدوياً:

1. **تحميل الملفات إلى GitHub:**
   - افتح https://github.com/alialshehriar/muthammen-ai
   - اضغط على "Add file" → "Upload files"
   - ارفع الملفات الجديدة والمعدلة من القائمة أعلاه
   - أو استخدم GitHub Desktop أو Git GUI

2. **النشر التلقائي على Vercel:**
   - Vercel متصل بالمستودع وسيقوم بالنشر تلقائياً عند رفع التغييرات
   - انتظر بضع دقائق حتى يكتمل النشر
   - تحقق من https://vercel.com/alialshehriars-projects/muthammen-ai

### الطريقة 2: استخدام Vercel MCP

```bash
# من داخل مجلد المشروع
cd /home/ubuntu/muthammen-ai

# النشر باستخدام MCP
manus-mcp-cli tool call deploy_to_vercel --server vercel --input '{}'
```

### الطريقة 3: استخدام Vercel CLI

```bash
# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

---

## 🔧 متغيرات البيئة المطلوبة على Vercel

تأكد من إضافة هذه المتغيرات في Vercel Dashboard:

### متغيرات مطلوبة:
```
DATABASE_URL=postgresql://...  (من Neon)
SITE_URL=https://muthammen-ai.vercel.app
```

### متغيرات اختيارية (موصى بها):
```
AGENT_PROJECT_KEY=sk-proj-...  (من OpenAI)
OPENAI_API_KEY=sk-proj-...     (بديل)
ADMIN_PASS=Muthammen@2025!Secure
```

**ملاحظة:** المتغيرات موجودة حالياً في `.env.local` ولكن يجب إضافتها في Vercel Dashboard أيضاً.

---

## ✅ اختبارات ما بعد النشر

بعد النشر، قم بالتحقق من:

### 1. اختبار الصحة العام
```
GET https://muthammen-ai.vercel.app/api/health
```

يجب أن يرجع:
```json
{
  "success": true,
  "tests": {
    "database": { "status": "success", ... },
    "agent": { "status": "success", ... },
    "env": { "status": "success", ... },
    "tables": { "status": "success", ... }
  },
  "summary": {
    "status": "healthy",
    ...
  }
}
```

### 2. اختبار لوحة الإدارة
- افتح https://muthammen-ai.vercel.app/admin
- سجل الدخول بكلمة المرور: `Muthammen@2025!Secure`
- تحقق من جميع الصفحات الخمس

### 3. اختبار وكيل الذكاء الاصطناعي
- من لوحة الإدارة → صفحة AI Monitor
- اضغط على "اختبار الوكيل الآن"
- يجب أن يظهر رسالة نجاح

### 4. اختبار الإحصائيات
```
GET https://muthammen-ai.vercel.app/api/admin/stats
```

### 5. اختبار قائمة الانتظار
```
GET https://muthammen-ai.vercel.app/api/waitlist/all
```

---

## 🐛 استكشاف الأخطاء

### خطأ في قاعدة البيانات
- تحقق من `DATABASE_URL` في Vercel
- تأكد من أن قاعدة البيانات Neon تعمل
- تحقق من الجداول: `waitlist_signups`, `referral_clicks`, `events`

### خطأ في وكيل الذكاء الاصطناعي
- تحقق من `AGENT_PROJECT_KEY` أو `OPENAI_API_KEY`
- تأكد من أن المفتاح صالح وله رصيد
- جرب الاختبار من `/api/agent/test`

### خطأ في لوحة الإدارة
- تحقق من `ADMIN_PASS` في Vercel
- امسح cache المتصفح
- تحقق من Console في DevTools

### خطأ 403 في GitHub
- استخدم الطريقة اليدوية للرفع
- أو حدّث GitHub Token بصلاحيات كاملة

---

## 📊 معلومات المشروع

- **المشروع:** muthammen-ai
- **Project ID:** prj_NcZxPTA4QFQ6roS2Mpls7KVtYZr9
- **Team ID:** team_ZXj80fgBf0cQjTYjlH3hhbYS
- **الرابط:** https://muthammen-ai.vercel.app
- **GitHub:** https://github.com/alialshehriar/muthammen-ai

---

## 🎯 الخطوات التالية

بعد النشر الناجح:

1. ✅ اختبر جميع الوظائف
2. ✅ تحقق من اختبارات الصحة
3. ✅ راقب الأخطاء في Vercel Dashboard
4. ✅ اختبر على أجهزة مختلفة
5. ✅ شارك الرابط مع الفريق

---

**تاريخ الإنشاء:** 2025-10-23  
**الحالة:** جاهز للنشر ✅

