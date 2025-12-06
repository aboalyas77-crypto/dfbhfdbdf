import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { 
  Sparkles, 
  User, 
  CreditCard,
  LogOut,
  ArrowRight,
  Settings as SettingsIcon
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Settings() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      free: { 
        label: "مجاني", 
        variant: "secondary" as const,
        description: "الخطة المجانية - ميزات أساسية"
      },
      pro: { 
        label: "احترافي", 
        variant: "default" as const,
        description: "الخطة الاحترافية - $29/شهر"
      },
      business: { 
        label: "الأعمال", 
        variant: "default" as const,
        description: "خطة الأعمال - $99/شهر"
      }
    };
    return tiers[tier as keyof typeof tiers] || tiers.free;
  };

  const tierInfo = getTierInfo(user?.subscriptionTier || "free");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
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

      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            الإعدادات
          </h1>
          <p className="text-muted-foreground">
            إدارة حسابك واشتراكك
          </p>
        </div>

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>معلومات الحساب</CardTitle>
            </div>
            <CardDescription>
              بياناتك الشخصية ومعلومات تسجيل الدخول
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">الاسم</div>
              <div className="col-span-2 text-sm">{user?.name || "غير محدد"}</div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</div>
              <div className="col-span-2 text-sm">{user?.email || "غير محدد"}</div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">طريقة الدخول</div>
              <div className="col-span-2 text-sm">{user?.loginMethod || "غير محدد"}</div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">تاريخ التسجيل</div>
              <div className="col-span-2 text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : "غير محدد"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>الاشتراك والفوترة</CardTitle>
            </div>
            <CardDescription>
              إدارة خطتك ومعلومات الدفع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm font-medium text-muted-foreground">الخطة الحالية</div>
              <div className="col-span-2 flex items-center gap-2">
                <Badge variant={tierInfo.variant}>{tierInfo.label}</Badge>
                <span className="text-sm text-muted-foreground">{tierInfo.description}</span>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm font-medium text-muted-foreground">حالة الاشتراك</div>
              <div className="col-span-2">
                <Badge variant={user?.subscriptionStatus === "active" ? "default" : "secondary"}>
                  {user?.subscriptionStatus === "active" ? "نشط" : "غير نشط"}
                </Badge>
              </div>
            </div>
            {user?.subscriptionTier === "free" && (
              <>
                <Separator />
                <div className="pt-2">
                  <Link href="/pricing">
                    <Button className="w-full">
                      ترقية الاشتراك
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">منطقة الخطر</CardTitle>
            <CardDescription>
              إجراءات لا يمكن التراجع عنها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full sm:w-auto"
            >
              <LogOut className="ml-2 h-4 w-4" />
              {logoutMutation.isPending ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
