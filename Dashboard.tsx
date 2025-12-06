import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText,
  Upload,
  Settings,
  TrendingUp,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user } = useAuth();
  const usageQuery = trpc.usage.getCurrent.useQuery();

  const tools = [
    {
      icon: MessageSquare,
      title: "محادثة الذكاء الاصطناعي",
      description: "ابدأ محادثة ذكية مع مساعدك الشخصي",
      href: "/chat",
      color: "text-blue-500"
    },
    {
      icon: ImageIcon,
      title: "توليد الصور",
      description: "أنشئ صوراً احترافية من النصوص",
      href: "/image-generation",
      color: "text-purple-500"
    },
    {
      icon: FileText,
      title: "تحليل النصوص",
      description: "حلل وأعد كتابة النصوص بذكاء",
      href: "/text-analysis",
      color: "text-green-500"
    },
    {
      icon: Upload,
      title: "رفع الملفات",
      description: "ارفع وعالج ملفاتك بالذكاء الاصطناعي",
      href: "/files",
      color: "text-orange-500"
    }
  ];

  const getTierBadge = (tier: string) => {
    const badges = {
      free: { label: "مجاني", variant: "secondary" as const },
      pro: { label: "احترافي", variant: "default" as const },
      business: { label: "الأعمال", variant: "default" as const }
    };
    return badges[tier as keyof typeof badges] || badges.free;
  };

  const tierBadge = getTierBadge(user?.subscriptionTier || "free");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">خزانتي برو</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={tierBadge.variant}>{tierBadge.label}</Badge>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            مرحباً، {user?.name || "مستخدم"}!
          </h1>
          <p className="text-muted-foreground">
            ابدأ باستخدام أدوات الذكاء الاصطناعي المتقدمة
          </p>
        </div>

        {/* Usage Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المحادثات</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageQuery.data?.chatMessages || 0} / {user?.subscriptionTier === 'free' ? 50 : user?.subscriptionTier === 'pro' ? 1000 : 'غير محدود'}
              </div>
              <Progress value={usageQuery.data?.chatMessages ? (usageQuery.data.chatMessages / (user?.subscriptionTier === 'free' ? 50 : 1000)) * 100 : 0} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {user?.subscriptionTier === 'business' ? 'غير محدود' : `متبقي ${(user?.subscriptionTier === 'free' ? 50 : 1000) - (usageQuery.data?.chatMessages || 0)} رسالة هذا الشهر`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الصور المولدة</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageQuery.data?.imagesGenerated || 0} / {user?.subscriptionTier === 'free' ? 5 : user?.subscriptionTier === 'pro' ? 100 : 'غير محدود'}
              </div>
              <Progress value={usageQuery.data?.imagesGenerated ? (usageQuery.data.imagesGenerated / (user?.subscriptionTier === 'free' ? 5 : 100)) * 100 : 0} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {user?.subscriptionTier === 'business' ? 'غير محدود' : `متبقي ${(user?.subscriptionTier === 'free' ? 5 : 100) - (usageQuery.data?.imagesGenerated || 0)} صور هذا الشهر`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التحليلات النصية</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageQuery.data?.textAnalyses || 0} / {user?.subscriptionTier === 'free' ? 10 : user?.subscriptionTier === 'pro' ? 200 : 'غير محدود'}
              </div>
              <Progress value={usageQuery.data?.textAnalyses ? (usageQuery.data.textAnalyses / (user?.subscriptionTier === 'free' ? 10 : 200)) * 100 : 0} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {user?.subscriptionTier === 'business' ? 'غير محدود' : `متبقي ${(user?.subscriptionTier === 'free' ? 10 : 200) - (usageQuery.data?.textAnalyses || 0)} تحليلات هذا الشهر`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">الأدوات المتاحة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full">
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${tool.color}`}>
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        {user?.subscriptionTier === "free" && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">ارتقِ لخطة احترافية</h3>
                    <p className="text-muted-foreground">
                      احصل على وصول غير محدود لجميع الأدوات والميزات المتقدمة
                    </p>
                  </div>
                </div>
                <Link href="/pricing">
                  <Button size="lg">
                    <Zap className="ml-2 h-5 w-5" />
                    ترقية الآن
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
