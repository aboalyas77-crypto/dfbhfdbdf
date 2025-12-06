import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Zap, 
  Shield, 
  TrendingUp,
  Check,
  Star,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: "محادثة ذكية مع الذكاء الاصطناعي",
      description: "تحدث مع مساعد ذكي متقدم يفهم احتياجاتك ويقدم إجابات دقيقة وسريعة"
    },
    {
      icon: ImageIcon,
      title: "توليد الصور بالذكاء الاصطناعي",
      description: "حوّل أفكارك إلى صور احترافية باستخدام أحدث تقنيات الذكاء الاصطناعي"
    },
    {
      icon: FileText,
      title: "تحليل وإعادة كتابة النصوص",
      description: "حسّن نصوصك، لخص المحتوى، وحلل البيانات بسهولة وسرعة"
    },
    {
      icon: Zap,
      title: "أداء فائق السرعة",
      description: "استجابة فورية ومعالجة سريعة لجميع طلباتك"
    },
    {
      icon: Shield,
      title: "أمان وخصوصية",
      description: "بياناتك محمية بأعلى معايير الأمان والتشفير"
    },
    {
      icon: TrendingUp,
      title: "تحسين مستمر",
      description: "نماذج ذكاء اصطناعي محدثة باستمرار لأفضل النتائج"
    }
  ];

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
      highlighted: false
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
      highlighted: true
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
      highlighted: false
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مدير تسويق",
      content: "خزانتي برو غيّرت طريقة عملنا. الأدوات الذكية وفرت علينا ساعات من العمل اليومي.",
      rating: 5
    },
    {
      name: "سارة العلي",
      role: "مصممة محتوى",
      content: "أداة توليد الصور رائعة! أصبحت أنشئ تصاميم احترافية في دقائق معدودة.",
      rating: 5
    },
    {
      name: "محمد الشمري",
      role: "كاتب محتوى",
      content: "أداة إعادة الكتابة والتحليل ساعدتني في تحسين جودة مقالاتي بشكل كبير.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">خزانتي برو</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>لوحة التحكم</Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost">تسجيل الدخول</Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button>ابدأ مجاناً</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            منصة الذكاء الاصطناعي الشاملة
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            حوّل أفكارك إلى واقع مع الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            منصة متكاملة توفر لك أدوات الذكاء الاصطناعي المتقدمة للمحادثة، توليد الصور، 
            وتحليل النصوص. كل ما تحتاجه في مكان واحد.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
              <Button size="lg" className="text-lg px-8">
                ابدأ الآن مجاناً
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="text-lg px-8">
              شاهد العرض التوضيحي
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">ميزات قوية لتعزيز إنتاجيتك</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اكتشف مجموعة شاملة من الأدوات الذكية المصممة لتسهيل عملك وتحقيق أهدافك
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">خطط تناسب جميع الاحتياجات</h2>
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
                <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.price === "0" ? "ابدأ مجاناً" : "اشترك الآن"}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-20 bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">ماذا يقول عملاؤنا</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الراضين الذين حولوا أعمالهم مع خزانتي برو
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              انضم إلى خزانتي برو اليوم واستمتع بقوة الذكاء الاصطناعي في متناول يدك
            </p>
            <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
              <Button size="lg" className="text-lg px-8">
                ابدأ مجاناً الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold">خزانتي برو</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 خزانتي برو. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
