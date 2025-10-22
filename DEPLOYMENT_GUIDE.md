# دليل النشر - مشروع Muthammen

## نظرة عامة

هذا الدليل يشرح كيفية نشر مشروع Muthammen على Vercel مع قاعدة بيانات Neon PostgreSQL.

---

## المتطلبات

- حساب Vercel
- حساب Neon PostgreSQL
- حساب Cloudflare (للـ DNS)
- حساب GitHub

---

## الخطوات

### 1. إعداد قاعدة البيانات Neon

✅ **تم بالفعل**

- Project ID: `hidden-grass-19434017`
- Database: `neondb`
- الجداول: `events`, `waitlist_signups`, `referral_clicks`
- الدوال: `bump_referrals()`

**Connection String**:
```
postgresql://neondb_owner:npg_eR2wyFrnL3cW@ep-damp-cloud-a47y3qp2-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

---

### 2. رفع الكود إلى GitHub

```bash
cd /home/ubuntu/muthammen-ai
git add .
git commit -m "feat: Add Waitlist, Referrals, and Admin Panel"
git push origin main
```

---

### 3. نشر على Vercel

#### الطريقة الأولى: عبر Vercel CLI
```bash
vercel --prod
```

#### الطريقة الثانية: عبر Vercel Dashboard
1. اذهب إلى https://vercel.com/new
2. اختر المستودع `alialshehriar/muthammen-ai`
3. اضغط "Deploy"

---

### 4. إعداد المتغيرات البيئية في Vercel

في Vercel Dashboard → Project Settings → Environment Variables، أضف:

```env
SITE_URL=https://www.muthammen.com
DATABASE_URL=postgresql://neondb_owner:npg_eR2wyFrnL3cW@ep-damp-cloud-a47y3qp2-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
ADMIN_PASS=muthammen2025
```

---

### 5. إعداد الدومين في Vercel

1. اذهب إلى Project Settings → Domains
2. أضف `muthammen.com`
3. أضف `www.muthammen.com`
4. اجعل `www` هو Primary Domain
5. فعّل Redirect من `@` إلى `www`

---

### 6. إعداد Cloudflare DNS

في Cloudflare Dashboard → DNS Records:

```
Type    Name    Content              Proxy Status
A       @       76.76.21.21          DNS only
CNAME   www     cname.vercel-dns.com DNS only
```

**ملاحظة**: قد تحتاج لإيقاف البروكسي مؤقتاً للتحقق من الدومين.

---

### 7. التحقق من النشر

بعد النشر، تحقق من:

- ✅ الموقع يعمل على `https://www.muthammen.com`
- ✅ SSL سليم (قفل أخضر)
- ✅ Redirect من `muthammen.com` إلى `www.muthammen.com`
- ✅ صفحة الخريطة تعرض نموذج التسجيل
- ✅ التسجيل في Waitlist يعمل
- ✅ أكواد الإحالة تعمل
- ✅ لوحة الإدارة `/admin` تعمل

---

## الوصول إلى لوحة الإدارة

URL: `https://www.muthammen.com/admin`  
كلمة المرور: `muthammen2025` (يمكن تغييرها من المتغيرات البيئية)

---

## API Endpoints

### التسجيل في Waitlist
```
POST /api/waitlist/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "اسم المستخدم",
  "city": "الرياض",
  "phone": "0501234567",
  "refCode": "ABC123"
}
```

### تسجيل نقرة إحالة
```
POST /api/referrals/click
Content-Type: application/json

{
  "refCode": "ABC123",
  "path": "/"
}
```

### إحصائيات الإحالة
```
GET /api/referrals/stats?ref=ABC123
```

---

## CI/CD (اختياري)

لإعداد النشر التلقائي:

1. احصل على Deploy Hook من Vercel:
   - Project Settings → Git → Deploy Hooks
   - أنشئ Hook جديد للـ `main` branch

2. أضف الـ Hook إلى المتغيرات البيئية:
   ```env
   VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
   ```

3. أنشئ GitHub Action في `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to Vercel
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger Vercel Deploy
           run: curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
   ```

---

## استكشاف الأخطاء

### خطأ في الاتصال بقاعدة البيانات
- تحقق من `DATABASE_URL` في المتغيرات البيئية
- تأكد من أن Neon project لا يزال نشطاً

### الدومين لا يعمل
- تحقق من سجلات DNS في Cloudflare
- انتظر حتى 48 ساعة لانتشار DNS
- تأكد من إيقاف Cloudflare Proxy

### API لا يعمل
- تحقق من Vercel Logs
- تأكد من أن `api/` folder موجود
- تحقق من `vercel.json` configuration

---

## الدعم

للمساعدة أو الإبلاغ عن مشاكل:
- GitHub Issues: https://github.com/alialshehriar/muthammen-ai/issues
- Email: support@muthammen.com

---

**تاريخ آخر تحديث**: 2025-10-22
