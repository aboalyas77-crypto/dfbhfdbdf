# دليل رفع خزانتي برو على استضافة خارجية

## المتطلبات الأساسية

قبل رفع المشروع، تأكد من توفر:

1. **خادم Node.js** - يدعم Node.js 22 أو أحدث
2. **قاعدة بيانات MySQL** - MySQL 8.0+ أو MariaDB 10.5+
3. **تخزين S3** - AWS S3 أو أي خدمة متوافقة
4. **نطاق (Domain)** - اختياري لكن موصى به

## متغيرات البيئة المطلوبة

أنشئ ملف `.env` في جذر المشروع مع المتغيرات التالية:

```env
# قاعدة البيانات
DATABASE_URL=mysql://username:password@host:3306/database_name

# المصادقة (يجب الحصول عليها من Manus أو استخدام نظام مصادقة بديل)
JWT_SECRET=your-secret-key-here-min-32-characters
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id

# معلومات المالك
OWNER_OPEN_ID=your-openid
OWNER_NAME=Your Name

# خدمات الذكاء الاصطناعي (يجب الحصول عليها من Manus أو استخدام OpenAI)
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# تخزين S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# إحصائيات (اختياري)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# معلومات التطبيق
VITE_APP_TITLE=خزانتي برو
VITE_APP_LOGO=/logo.png
```

## خطوات الرفع

### 1. تحضير الملفات

```bash
# فك ضغط الملفات
tar -xzf khazanati-pro.tar.gz
cd khazanati-pro

# تثبيت الحزم
pnpm install
# أو إذا لم يكن pnpm متوفراً
npm install
```

### 2. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
mysql -u username -p -e "CREATE DATABASE khazanati_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# تطبيق المخططات
pnpm db:push
```

### 3. بناء المشروع

```bash
# بناء للإنتاج
pnpm build
```

### 4. تشغيل المشروع

```bash
# تشغيل في وضع الإنتاج
pnpm start

# أو باستخدام PM2 (موصى به)
pm2 start dist/index.js --name khazanati-pro
pm2 save
pm2 startup
```

## إعداد Nginx (موصى به)

أنشئ ملف تكوين Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

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
    }
}
```

## إعداد SSL مع Let's Encrypt

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d yourdomain.com
```

## بدائل لخدمات Manus

إذا كنت تريد استخدام المشروع بدون خدمات Manus:

### 1. المصادقة
استبدل Manus OAuth بـ:
- **Passport.js** مع Google/Facebook/GitHub
- **Auth0**
- **NextAuth.js**

### 2. الذكاء الاصطناعي
استبدل Manus LLM بـ:
- **OpenAI API** (GPT-4, DALL-E)
- **Anthropic Claude**
- **Google Gemini**

عدّل الملفات:
- `server/_core/llm.ts` - للمحادثة
- `server/_core/imageGeneration.ts` - لتوليد الصور

### 3. التخزين
S3 متوافق مع:
- **AWS S3**
- **DigitalOcean Spaces**
- **Cloudflare R2**
- **MinIO** (self-hosted)

## استضافات موصى بها

### للمشاريع الصغيرة
- **Vercel** - سهل ومجاني للبداية
- **Netlify** - مناسب للمشاريع الصغيرة
- **Railway** - دعم Node.js وقواعد البيانات

### للمشاريع المتوسطة
- **DigitalOcean App Platform** - $5-12/شهر
- **Heroku** - $7/شهر للبداية
- **Render** - $7/شهر

### للمشاريع الكبيرة
- **AWS EC2** - مرن وقابل للتوسع
- **Google Cloud Run** - serverless
- **Azure App Service** - مناسب للشركات

## حل المشاكل الشائعة

### خطأ في الاتصال بقاعدة البيانات
```bash
# تحقق من صلاحيات المستخدم
GRANT ALL PRIVILEGES ON khazanati_pro.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

### خطأ في المنافذ
```bash
# تحقق من المنافذ المستخدمة
sudo lsof -i :3000

# أو غيّر المنفذ في الكود
PORT=8080 pnpm start
```

### مشاكل الذاكرة
```bash
# زيادة حد الذاكرة لـ Node.js
NODE_OPTIONS="--max-old-space-size=4096" pnpm start
```

## المراقبة والصيانة

### استخدام PM2 للمراقبة
```bash
# عرض الحالة
pm2 status

# عرض السجلات
pm2 logs khazanati-pro

# إعادة التشغيل
pm2 restart khazanati-pro

# إيقاف
pm2 stop khazanati-pro
```

### النسخ الاحتياطي
```bash
# نسخ احتياطي لقاعدة البيانات
mysqldump -u username -p khazanati_pro > backup.sql

# استعادة النسخة الاحتياطية
mysql -u username -p khazanati_pro < backup.sql
```

## الأمان

1. **لا تشارك ملف `.env`** أبداً
2. **استخدم HTTPS** دائماً في الإنتاج
3. **حدّث الحزم** بانتظام: `pnpm update`
4. **راقب السجلات** للكشف عن الأنشطة المشبوهة
5. **استخدم جدار ناري** (UFW أو iptables)

## الدعم

للحصول على المساعدة:
1. راجع ملف `DEPLOYMENT.md` للتفاصيل الفنية
2. تحقق من السجلات: `pm2 logs`
3. ابحث في المشاكل الشائعة أعلاه

## الترخيص

MIT License - يمكنك استخدام المشروع تجارياً وتعديله بحرية
