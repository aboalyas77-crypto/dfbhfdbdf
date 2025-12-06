# دليل شامل: ربط خزانتي برو بـ MySQL على DigitalOcean

## المرحلة الأولى: إنشاء حساب DigitalOcean

### الخطوة 1: التسجيل والتحقق
1. انتقل إلى [DigitalOcean.com](https://www.digitalocean.com)
2. انقر على "Sign Up" وأنشئ حسابك
3. أدخل بريدك الإلكتروني وكلمة المرور
4. تحقق من بريدك الإلكتروني
5. أكمل معلومات الدفع (بطاقة ائتمان أو PayPal)

### الخطوة 2: إنشاء مشروع جديد
1. بعد تسجيل الدخول، انقر على "Create" في الأعلى
2. اختر "Project"
3. أدخل اسم المشروع: "Khazanati Pro"
4. اختر الغرض: "I'm building a web application"
5. انقر على "Create Project"

---

## المرحلة الثانية: إنشاء قاعدة بيانات MySQL

### الخطوة 1: إنشاء مجموعة قاعدة بيانات
1. في لوحة التحكم، انقر على "Create" → "Databases"
2. اختر **MySQL** كنوع قاعدة البيانات
3. اختر الإصدار: **MySQL 8.0** (الأحدث والأفضل)
4. اختر منطقة البيانات الأقرب إليك (مثلاً: Frankfurt, Singapore, New York)
5. اختر حجم الخادم: **Basic** ($15/شهر) كافٍ للبداية
6. اختر عدد العقد: **Single Node** (عقدة واحدة)
7. أدخل اسم قاعدة البيانات: `khazanati_pro`
8. انقر على "Create Database Cluster"

**الانتظار:** قد يستغرق 5-10 دقائق لإنشاء قاعدة البيانات

### الخطوة 2: الحصول على بيانات الاتصال
بعد إنشاء قاعدة البيانات:

1. انقر على اسم قاعدة البيانات
2. انتقل إلى تبويب **"Connection Details"**
3. ستجد المعلومات التالية:
   - **Host**: `db-mysql-xxx.ondigitalocean.com`
   - **Port**: `25060` (أو `3306`)
   - **Username**: `doadmin`
   - **Password**: (سيتم إنشاؤها تلقائياً)
   - **Database**: `defaultdb`

**احفظ هذه المعلومات** - ستحتاجها لاحقاً

---

## المرحلة الثالثة: إعداد الوصول الآمن

### الخطوة 1: تفعيل SSL (الاتصال الآمن)
1. في صفحة قاعدة البيانات، انقر على **"Connection Details"**
2. ستجد شهادة SSL - انقر على **"Download CA certificate"**
3. احفظ الملف باسم `ca-certificate.crt`

### الخطوة 2: إضافة عنوان IP الخادم الخاص بك
إذا كنت تشغل التطبيق على خادم خاص:

1. في صفحة قاعدة البيانات، انقر على **"Firewall"**
2. انقر على **"Add Rule"**
3. اختر **"Droplet"** (إذا كان لديك droplet على DigitalOcean)
4. أو أدخل عنوان IP الثابت لخادمك

**ملاحظة:** إذا كنت تطور محلياً، أضف عنوان IP الخاص بك:
- ابحث عن "What is my IP" في Google
- أضفه إلى قائمة الحماية

---

## المرحلة الرابعة: تكوين متغيرات البيئة

### الخطوة 1: إنشاء ملف `.env`

أنشئ ملف `.env` في جذر المشروع بالمحتوى التالي:

```env
# قاعدة البيانات MySQL على DigitalOcean
# الصيغة: mysql://username:password@host:port/database?sslmode=require
DATABASE_URL=mysql://doadmin:YOUR_PASSWORD@db-mysql-xxx.ondigitalocean.com:25060/khazanati_pro?sslmode=require

# المصادقة والأمان
JWT_SECRET=your-very-secret-key-at-least-32-characters-long-12345678901234567890
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id-from-manus

# معلومات المالك
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# خدمات الذكاء الاصطناعي
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# تخزين S3
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# معلومات التطبيق
VITE_APP_TITLE=خزانتي برو
VITE_APP_LOGO=/logo.png

# إحصائيات (اختياري)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

**استبدل القيم التالية:**
- `YOUR_PASSWORD` - كلمة المرور من DigitalOcean
- `db-mysql-xxx.ondigitalocean.com` - عنوان الخادم الفعلي
- باقي المفاتيح والمعرفات

### الخطوة 2: التحقق من صحة الاتصال

```bash
# تثبيت mysql-client (إذا لم يكن مثبتاً)
# على Ubuntu/Debian:
sudo apt-get install mysql-client

# على macOS:
brew install mysql-client

# اختبار الاتصال
mysql -h db-mysql-xxx.ondigitalocean.com \
  -P 25060 \
  -u doadmin \
  -p \
  --ssl-ca=ca-certificate.crt \
  -e "SELECT 1;"
```

إذا ظهرت النتيجة `1`، فالاتصال يعمل بنجاح! ✅

---

## المرحلة الخامسة: نشر المشروع

### الخطوة 1: تثبيت الحزم
```bash
# فك ضغط المشروع
unzip khazanati-pro.zip
cd khazanati-pro

# تثبيت الحزم
pnpm install
# أو
npm install
```

### الخطوة 2: تطبيق المخططات على قاعدة البيانات
```bash
# إنشاء الجداول والمخططات
pnpm db:push

# إذا ظهرت رسالة تحذير، اختر "yes" للمتابعة
```

**ما الذي سيتم إنشاؤه:**
- جدول `users` - لتخزين بيانات المستخدمين
- جدول `conversations` - للمحادثات
- جدول `messages` - لرسائل المحادثة
- جدول `generatedImages` - للصور المولدة
- جدول `textAnalyses` - لنتائج تحليل النصوص
- جدول `uploadedFiles` - للملفات المرفوعة
- جدول `usageTracking` - لتتبع الاستخدام
- جدول `subscriptions` - لبيانات الاشتراكات

### الخطوة 3: بناء المشروع
```bash
# بناء النسخة الإنتاجية
pnpm build

# هذا سيقوم بـ:
# 1. بناء واجهة المستخدم (React)
# 2. بناء الخادم (Express)
# 3. إنشاء مجلد dist/
```

### الخطوة 4: اختبار المشروع محلياً
```bash
# تشغيل الخادم
pnpm start

# يجب أن تظهر رسالة:
# Server running on http://localhost:3000/
```

افتح المتصفح وانتقل إلى `http://localhost:3000` للتحقق من عمل المشروع

---

## المرحلة السادسة: نشر على DigitalOcean Droplet

### الخطوة 1: إنشاء Droplet (خادم افتراضي)

1. في لوحة التحكم، انقر على **"Create" → "Droplet"**
2. اختر **Ubuntu 22.04 LTS** (نظام التشغيل)
3. اختر حجم الخادم: **Basic** ($6/شهر) كافٍ للبداية
4. اختر منطقة البيانات (نفس منطقة قاعدة البيانات إن أمكن)
5. اختر **"SSH Key"** للأمان (أو كلمة مرور)
6. أدخل اسم الخادم: `khazanati-pro-server`
7. انقر على **"Create Droplet"**

### الخطوة 2: الاتصال بالخادم

```bash
# الاتصال عبر SSH
ssh root@your_droplet_ip

# استبدل your_droplet_ip بعنوان IP الفعلي من DigitalOcean
```

### الخطوة 3: تثبيت المتطلبات على الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت pnpm
npm install -g pnpm

# تثبيت Git
sudo apt install -y git

# تثبيت PM2 (لإدارة التطبيق)
sudo npm install -g pm2

# تثبيت Nginx (خادم ويب عكسي)
sudo apt install -y nginx

# تثبيت mysql-client
sudo apt install -y mysql-client
```

### الخطوة 4: نسخ المشروع إلى الخادم

**من جهازك المحلي:**
```bash
# نسخ الملفات إلى الخادم
scp -r khazanati-pro/ root@your_droplet_ip:/home/khazanati-pro/
```

**أو من الخادم:**
```bash
# على الخادم
cd /home
git clone https://your-repo-url.git khazanati-pro
# أو
wget https://your-domain.com/khazanati-pro.zip
unzip khazanati-pro.zip
```

### الخطوة 5: إعداد المشروع على الخادم

```bash
# الدخول إلى مجلد المشروع
cd /home/khazanati-pro

# إنشاء ملف .env
nano .env

# الصق المحتوى من المرحلة الرابعة وحفظ (Ctrl+X ثم Y)

# تثبيت الحزم
pnpm install

# تطبيق المخططات
pnpm db:push

# بناء المشروع
pnpm build
```

### الخطوة 6: تشغيل المشروع مع PM2

```bash
# بدء التطبيق
pm2 start dist/index.js --name "khazanati-pro"

# حفظ إعدادات PM2
pm2 save

# تفعيل البدء التلقائي عند إعادة تشغيل الخادم
pm2 startup
# اتبع التعليمات التي تظهر

# عرض حالة التطبيق
pm2 status

# عرض السجلات
pm2 logs khazanati-pro
```

---

## المرحلة السابعة: إعداد Nginx كخادم عكسي

### الخطوة 1: إنشاء ملف تكوين Nginx

```bash
# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/khazanati-pro
```

### الخطوة 2: إضافة التكوين

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # إعادة التوجيه من HTTP إلى HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # شهادات SSL (سيتم إضافتها لاحقاً)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # إعدادات SSL الأمنية
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # حجم الملفات المرفوعة
    client_max_body_size 50M;

    # توجيه الطلبات إلى التطبيق
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # مهم جداً للـ WebSocket
        proxy_read_timeout 86400;
    }

    # تخزين مؤقت للملفات الثابتة
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### الخطوة 3: تفعيل الموقع

```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/khazanati-pro /etc/nginx/sites-enabled/

# اختبار التكوين
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

---

## المرحلة الثامنة: إضافة شهادة SSL (HTTPS)

### الخطوة 1: تثبيت Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### الخطوة 2: الحصول على شهادة مجانية

```bash
# استبدل your-domain.com بنطاقك الفعلي
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# اتبع التعليمات:
# 1. أدخل بريدك الإلكتروني
# 2. اقبل شروط الخدمة
# 3. اختر إعادة التوجيه من HTTP إلى HTTPS
```

### الخطوة 3: تفعيل التجديد التلقائي

```bash
# اختبار التجديد
sudo certbot renew --dry-run

# تفعيل التجديد التلقائي
sudo systemctl enable certbot.timer
```

---

## المرحلة التاسعة: الاختبار والمراقبة

### الخطوة 1: اختبار الموقع

افتح المتصفح وانتقل إلى:
```
https://your-domain.com
```

يجب أن ترى صفحة الهبوط الخاصة بخزانتي برو ✅

### الخطوة 2: اختبار الاتصال بقاعدة البيانات

```bash
# على الخادم
mysql -h db-mysql-xxx.ondigitalocean.com \
  -P 25060 \
  -u doadmin \
  -p \
  --ssl-ca=/path/to/ca-certificate.crt \
  -e "USE khazanati_pro; SELECT COUNT(*) FROM users;"
```

### الخطوة 3: مراقبة التطبيق

```bash
# عرض حالة التطبيق
pm2 status

# عرض السجلات الحية
pm2 logs khazanati-pro --lines 100

# عرض استهلاك الموارد
pm2 monit
```

---

## حل المشاكل الشائعة

### المشكلة 1: خطأ في الاتصال بقاعدة البيانات

**الأعراض:**
```
Error: connect ECONNREFUSED
```

**الحل:**
```bash
# تحقق من بيانات الاتصال في .env
cat .env | grep DATABASE_URL

# اختبر الاتصال مباشرة
mysql -h your-host -P 25060 -u doadmin -p --ssl-ca=ca-certificate.crt

# تأكد من إضافة عنوان IP إلى جدار الحماية
# في لوحة DigitalOcean → Databases → Firewall
```

### المشكلة 2: خطأ SSL

**الأعراض:**
```
Error: SSL Error: unable to get local issuer certificate
```

**الحل:**
```bash
# تحميل شهادة SSL من DigitalOcean
# في صفحة قاعدة البيانات → Connection Details → Download CA certificate

# تحديث متغير البيئة
DATABASE_URL=mysql://user:pass@host:port/db?sslmode=require&ssl={"rejectUnauthorized":false}
```

### المشكلة 3: الخادم بطيء

**الحل:**
```bash
# زيادة حجم الخادم من لوحة DigitalOcean
# أو تحسين الأداء:

# عرض استهلاك الموارد
free -h
df -h
top

# إعادة تشغيل التطبيق
pm2 restart khazanati-pro
```

### المشكلة 4: الملفات المرفوعة لا تعمل

**الحل:**
```bash
# تحقق من بيانات S3
echo $AWS_ACCESS_KEY_ID
echo $AWS_S3_BUCKET

# اختبر الاتصال بـ S3
aws s3 ls --profile default
```

---

## نصائح الأمان

1. **لا تشارك ملف `.env`** أبداً على GitHub
2. **استخدم HTTPS** دائماً (تم تفعيله أعلاه)
3. **حدّث الحزم** بانتظام:
   ```bash
   pnpm update
   ```

4. **مراقبة السجلات** للكشف عن الأنشطة المشبوهة:
   ```bash
   pm2 logs khazanati-pro
   ```

5. **عمل نسخ احتياطية** من قاعدة البيانات:
   ```bash
   mysqldump -h host -u user -p db_name > backup.sql
   ```

---

## التكاليف المتوقعة

| الخدمة | السعر | الملاحظات |
|--------|-------|----------|
| Droplet (خادم) | $6/شهر | Ubuntu 22.04 |
| قاعدة البيانات MySQL | $15/شهر | Single Node |
| S3 Storage | متغير | حسب الاستخدام |
| النطاق | $10-15/سنة | اختياري |
| **الإجمالي** | **~$21/شهر** | للبداية |

---

## الخطوات التالية

1. ✅ قاعدة البيانات جاهزة
2. ✅ الخادم مثبت
3. ✅ التطبيق يعمل
4. الآن يمكنك:
   - إضافة نطاق مخصص
   - تفعيل Stripe للدفع
   - إضافة المزيد من الميزات
   - مراقبة الأداء

---

## الدعم والمساعدة

- **DigitalOcean Docs**: https://docs.digitalocean.com
- **MySQL Docs**: https://dev.mysql.com/doc/
- **Nginx Docs**: https://nginx.org/en/docs/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/

استمتع بـ خزانتي برو! 🎉
