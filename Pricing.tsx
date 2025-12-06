import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Check,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();

  const pricingPlans = [
    {
      name: "مجاني",
      price: "0",
      period: "شهرياً",
      description: "مثالي للتجربة والاستخدام الشخصي",
      features: [
        "50 رسالة محادثة شهرياً",
        "5 صور مولدة شهرياً",
        "10 تحليلات نصية شهرياً",
        "دعم أساسي"
      ],
      highlighted: false,
      tier: "free"
    },
    {
      name: "احترافي",
      price: "29",
      period: "شهرياً",
      description: "للمحترفين والشركات الصغيرة",
      features: [
        "1000 رسالة محادثة شهرياً",
        "100 صورة مولدة شهرياً",
        "200 تحليل نصي شهرياً",
        "رفع ملفات PDF والصور",
        "دعم ذو أولوية",
        "وصول للنماذج المتقدمة"
      ],
      highlighted: true,
      tier: "pro"
    },
    {
      name: "الأعمال",
      price: "99",
      period: "شهرياً",
      description: "للشركات والفرق الكبيرة",
      features: [
        "رسائل محادثة غير محدودة",
        "صور مولدة غير محدودة",
        "تحليلات نصية غير محدودة",
        "رفع ملفات غير محدود",
        "دعم متميز 24/7",
        "نماذج مخصصة",
        "API للتكامل"
      ],
      highlighted: false,
      tier: "business"
    }
  ];

  const handleSubscribe = (tier: string) => {
    if (!isAuthenticated) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }
    
    if (tier === "free") {
      toast.info("أنت بالفعل على الخطة المجانية");
      return;
    }
    
    // Placeholder for Stripe integration
    toast.info("سيتم إضافة نظام الدفع قريباً");
  };

  const isCurrentPlan = (tier: string) => {
    return user?.subscriptionTier === tier;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">خزانتي برو</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">خطط تناسب جميع الاحتياجات</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اختر الخطة المناسبة لك وابدأ رحلتك مع الذكاء الاصطناعي اليوم
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.highlighted ? 'border-primary border-2 shadow-xl scale-105' : ''}`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  الأكثر شعبية
                </Badge>
              )}
              {isCurrentPlan(plan.tier) && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="secondary">
                  خطتك الحالية
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground mr-2">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={isCurrentPlan(plan.tier)}
                >
                  {isCurrentPlan(plan.tier) 
                    ? "الخطة الحالية" 
                    : plan.price === "0" 
                      ? "ابدأ مجاناً" 
                      : "اشترك الآن"
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">هل يمكنني تغيير خطتي لاحقاً؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم تطبيق التغييرات فوراً.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ماذا يحدث إذا تجاوزت حد الاستخدام؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  سيتم إيقاف الخدمة مؤقتاً حتى الشهر التالي أو يمكنك الترقية لخطة أعلى للحصول على المزيد من الموارد.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">هل البيانات آمنة؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نعم، نستخدم أعلى معايير التشفير والأمان لحماية بياناتك وخصوصيتك.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
