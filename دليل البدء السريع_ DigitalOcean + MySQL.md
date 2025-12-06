# دليل البدء السريع: DigitalOcean + MySQL

## الخطوات الأساسية (15 دقيقة)

### 1️⃣ إنشاء قاعدة البيانات (5 دقائق)

```bash
# في لوحة DigitalOcean:
Create → Databases → MySQL 8.0
- Region: اختر الأقرب لك
- Size: Basic ($15/month)
- Database Name: khazanati_pro
```

**احفظ هذه البيانات:**
```
Host: db-mysql-xxx.ondigitalocean.com
Port: 25060
User: doadmin
Password: [سيتم إنشاؤها]
Database: khazanati_pro
```

### 2️⃣ إعداد الاتصال (2 دقيقة)

أنشئ ملف `.env`:

```env
DATABASE_URL=mysql://doadmin:PASSWORD@db-mysql-xxx.ondigitalocean.com:25060/khazanati_pro?sslmode=require
JWT_SECRET=your-secret-key-min-32-chars
VITE_APP_ID=your-app-id
# ... باقي المتغيرات
```

### 3️⃣ تطبيق المخططات (3 دقائق)

```bash
pnpm install
pnpm db:push
pnpm build
```

### 4️⃣ إنشاء Droplet (5 دقائق)

```bash
# في لوحة DigitalOcean:
Create → Droplet → Ubuntu 22.04 LTS
- Size: Basic ($6/month)
- Region: نفس منطقة قاعدة البيانات
```

### 5️⃣ تثبيت على الخادم (5 دقائق)

```bash
# اتصل بالخادم
ssh root@your_droplet_ip

# تثبيت المتطلبات
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git mysql-client
npm install -g pnpm pm2

# نسخ المشروع
git clone your-repo.git khazanati-pro
cd khazanati-pro

# إعداد البيئة
nano .env  # الصق بيانات الاتصال

# تشغيل
pnpm install
pnpm db:push
pnpm build
pm2 start dist/index.js --name "khazanati-pro"
pm2 save
```

---

## الأوامر الأساسية

### اختبار الاتصال
```bash
mysql -h db-mysql-xxx.ondigitalocean.com \
  -P 25060 \
  -u doadmin \
  -p \
  -e "SELECT 1;"
```

### عرض حالة التطبيق
```bash
pm2 status
pm2 logs khazanati-pro
```

### إعادة تشغيل
```bash
pm2 restart khazanati-pro
```

### تحديث المشروع
```bash
cd khazanati-pro
git pull
pnpm install
pnpm build
pm2 restart khazanati-pro
```

---

## معلومات مهمة

| المتغير | القيمة | ملاحظات |
|---------|--------|---------|
| Host | `db-mysql-xxx.ondigitalocean.com` | من DigitalOcean |
| Port | `25060` | DigitalOcean MySQL |
| User | `doadmin` | الافتراضي |
| SSL | ✅ مفعل | مهم جداً |
| Droplet | `$6/month` | Ubuntu 22.04 |
| Database | `$15/month` | Single Node |

---

## استكشاف الأخطاء

| المشكلة | الحل |
|--------|------|
| خطأ الاتصال | تحقق من IP في جدار الحماية |
| SSL Error | تحميل شهادة CA من DigitalOcean |
| بطء الخادم | زيادة حجم Droplet |
| الملفات لا تُرفع | تحقق من بيانات S3 |

---

## للمزيد من التفاصيل

اقرأ: `DIGITALOCEAN-MYSQL-SETUP.md` للدليل الكامل
