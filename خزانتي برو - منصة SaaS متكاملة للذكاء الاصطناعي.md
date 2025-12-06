# خزانتي برو - منصة SaaS متكاملة للذكاء الاصطناعي

![Khazanati Pro](https://private-us-east-1.manuscdn.com/sessionFile/ettaFPdyxLlXbqP1SOdodx/sandbox/2z36DHd77Etv2iAHObtq4m-images_1765054822091_na1fn_L2hvbWUvdWJ1bnR1L2toYXphbmF0aS1wcm8vY2xpZW50L3B1YmxpYy9sb2dv.svg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXR0YUZQZHl4TGxYYnFQMVNPZG9keC9zYW5kYm94LzJ6MzZESGQ3N0V0djJpQUhPYnRxNG0taW1hZ2VzXzE3NjUwNTQ4MjIwOTFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwydG9ZWHBoYm1GMGFTMXdjbTh2WTJ4cFpXNTBMM0IxWW14cFl5OXNiMmR2LnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NDw54coPgLc67Ij1-gEwTZIPcEov8ECYnEWmlSPTgaAZ0t8eKgJUFXzYYpbzxPTgGI2-UbW7SfFI2soOWsK-HFxcB1e918LCIV49KzttFURvuukgY7FUKMKENYMWSzWA1MizY7dZBvAY0ViCLRNbXCv2VeoMM01gt-EyDogG9O1xXHvbigiO30PxZ16z6ft6JbIwaTwW3UpFD8Xh7mijyflKYVqDYuZuSrQPG2oa1NIUCt1VEhWADDIvJYE9Jw9usjeXSomsl2MmnHuEEe0Cle-L9tG3i8HWlEKLC5yg1WGVSfO-ER6SuJg0qLrcD6DikjGXImO5OVcEUDtRwsd1pw__)

**منصة احترافية متكاملة توفر أدوات ذكاء اصطناعي متقدمة مع واجهة عربية جميلة وآمنة.**

---

## ✨ الميزات الرئيسية

### 🤖 أدوات الذكاء الاصطناعي

- **محادثة ذكية** - تفاعل مباشر مع نموذج AI متقدم
- **توليد الصور** - إنشاء صور من النصوص باستخدام DALL-E
- **تحليل النصوص** - إعادة كتابة وتلخيص وتحليل المحتوى
- **معالجة الملفات** - رفع وتخزين آمن للملفات

### 🔐 الأمان والمصادقة

- مصادقة آمنة عبر Manus OAuth
- تشفير البيانات الحساسة
- جلسات آمنة مع JWT
- حماية CSRF

### 💳 نظام الاشتراكات

- ثلاث خطط: مجاني، احترافي، الأعمال
- تتبع الاستخدام الشهري
- حدود استخدام ذكية
- إدارة الاشتراكات

### 🎨 تصميم احترافي

- واجهة عربية كاملة
- تصميم متجاوب (Responsive)
- أنماط حديثة مع Tailwind CSS
- رموز جميلة مع Lucide

---

## 🛠️ التكنولوجيا المستخدمة

### Frontend
- **React 19** - مكتبة واجهات المستخدم
- **TypeScript** - لغة برمجة محسّنة
- **Tailwind CSS 4** - أنماط حديثة
- **Wouter** - توجيه خفيف الوزن
- **Framer Motion** - رسوميات سلسة
- **shadcn/ui** - مكونات جاهزة

### Backend
- **Express 4** - خادم ويب سريع
- **tRPC 11** - عقود آمنة من النهاية إلى النهاية
- **Node.js 22** - بيئة التشغيل

### Database
- **MySQL 8.0** - قاعدة بيانات موثوقة
- **Drizzle ORM** - ORM حديث وآمن

### AI & Services
- **Manus LLM** - نموذج لغة متقدم
- **DALL-E** - توليد الصور
- **AWS S3** - تخزين آمن

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 22+
- pnpm (أو npm)
- MySQL 8.0+
- حساب AWS S3 (اختياري)

### التثبيت

```bash
# 1. فك ضغط الملفات
unzip khazanati-pro.zip
cd khazanati-pro

# 2. تثبيت الحزم
pnpm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# ثم عدّل .env بالقيم الصحيحة

# 4. تطبيق المخططات
pnpm db:push

# 5. التطوير المحلي
pnpm dev
```

افتح المتصفح على `http://localhost:3000` 🎉

---

## 📚 الأدلة والوثائق

| الدليل | الوصف |
|--------|-------|
| [FILE-STRUCTURE.md](FILE-STRUCTURE.md) | هيكل الملفات الكامل |
| [DEPLOYMENT.md](DEPLOYMENT.md) | دليل النشر العام |
| [README-DEPLOYMENT.md](README-DEPLOYMENT.md) | دليل النشر التفصيلي |
| [DIGITALOCEAN-MYSQL-SETUP.md](DIGITALOCEAN-MYSQL-SETUP.md) | دليل DigitalOcean الكامل |
| [DIGITALOCEAN-QUICK-START.md](DIGITALOCEAN-QUICK-START.md) | دليل البدء السريع |

---

## 📊 جداول قاعدة البيانات

```
users                 - بيانات المستخدمين
conversations         - المحادثات
messages              - رسائل المحادثة
generatedImages       - الصور المولدة
textAnalyses          - نتائج تحليل النصوص
uploadedFiles         - الملفات المرفوعة
usageTracking         - تتبع الاستخدام
subscriptions         - بيانات الاشتراكات
```

---

## 🧪 الاختبارات

```bash
# تشغيل جميع الاختبارات
pnpm test

# الاختبارات المتوفرة:
# ✅ auth.logout.test.ts - اختبار المصادقة
# ✅ chat.test.ts - اختبار المحادثة
# ✅ images.test.ts - اختبار الصور
# ✅ text.test.ts - اختبار النصوص
# ✅ usage.test.ts - اختبار الاستخدام
```

---

## 🔧 الأوامر الأساسية

```bash
# التطوير
pnpm dev              # تشغيل خادم التطوير

# قاعدة البيانات
pnpm db:push          # تطبيق المخططات
pnpm db:studio        # فتح واجهة Drizzle Studio

# البناء والإنتاج
pnpm build            # بناء للإنتاج
pnpm start            # تشغيل الإنتاج

# الجودة
pnpm test             # تشغيل الاختبارات
pnpm check            # فحص TypeScript
pnpm format           # تنسيق الكود
```

---

## 🌐 نشر على DigitalOcean

### خطوات سريعة:

1. **إنشاء قاعدة بيانات MySQL**
   ```
   DigitalOcean → Create → Databases → MySQL 8.0
   ```

2. **إعداد الاتصال**
   ```env
   DATABASE_URL=mysql://user:pass@host:25060/db?sslmode=require
   ```

3. **إنشاء Droplet**
   ```
   DigitalOcean → Create → Droplet → Ubuntu 22.04 LTS
   ```

4. **نشر المشروع**
   ```bash
   ssh root@droplet_ip
   git clone your-repo.git khazanati-pro
   cd khazanati-pro
   pnpm install && pnpm build
   pm2 start dist/index.js --name "khazanati-pro"
   ```

📖 اقرأ [DIGITALOCEAN-MYSQL-SETUP.md](DIGITALOCEAN-MYSQL-SETUP.md) للتفاصيل الكاملة

---

## 💰 خطط الأسعار

| الميزة | مجاني | احترافي | الأعمال |
|--------|-------|---------|---------|
| رسائل المحادثة | 50/شهر | 1000/شهر | غير محدود |
| الصور المولدة | 5/شهر | 100/شهر | غير محدود |
| التحليلات النصية | 10/شهر | 200/شهر | غير محدود |
| رفع الملفات | محدود | نعم | نعم |
| الدعم | المجتمع | البريد الإلكتروني | الأولوية |

---

## 🔐 الأمان

- ✅ HTTPS/SSL مفعل
- ✅ جلسات آمنة مع JWT
- ✅ حماية CSRF
- ✅ تشفير البيانات الحساسة
- ✅ فحوصات الصلاحيات
- ✅ معالجة الأخطاء الآمنة

---

## 📱 المتصفحات المدعومة

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🐛 حل المشاكل الشائعة

### خطأ: "Cannot find module"
```bash
pnpm install
```

### خطأ: "Database connection failed"
```bash
# تحقق من بيانات الاتصال في .env
mysql -h your-host -u user -p
```

### خطأ: "Port 3000 already in use"
```bash
# غيّر المنفذ
PORT=3001 pnpm dev
```

---

## 📞 الدعم والمساعدة

- 📧 البريد الإلكتروني: support@khazanati.pro
- 💬 المجتمع: [Discord](https://discord.gg/khazanati)
- 📖 الوثائق: [docs.khazanati.pro](https://docs.khazanati.pro)
- 🐛 الأخطاء: [GitHub Issues](https://github.com/khazanati/pro/issues)

---

## 📄 الترخيص

MIT License - يمكنك استخدام المشروع تجارياً وتعديله بحرية

```
Copyright (c) 2024 Khazanati Pro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 شكر وتقدير

شكراً لاستخدامك خزانتي برو! نتمنى أن يساعدك هذا المشروع في تحقيق أهدافك.

**ساهم في تطوير المشروع:**
- 🌟 أضف نجمة على GitHub
- 🐛 أبلغ عن الأخطاء
- 💡 اقترح ميزات جديدة
- 🔄 شارك التحسينات

---

## 🚀 الخطوات التالية

1. ✅ اقرأ [FILE-STRUCTURE.md](FILE-STRUCTURE.md)
2. ✅ اتبع [DIGITALOCEAN-QUICK-START.md](DIGITALOCEAN-QUICK-START.md)
3. ✅ شغّل `pnpm dev` واختبر المشروع
4. ✅ اقرأ [DEPLOYMENT.md](DEPLOYMENT.md) قبل النشر

---

**استمتع بـ خزانتي برو! 🎉**

صُنع بـ ❤️ باستخدام React، TypeScript، و Tailwind CSS
