import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { 
  Image as ImageIcon, 
  ArrowRight,
  Loader2,
  Download,
  Trash2,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function ImageGeneration() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");

  const utils = trpc.useUtils();
  const imagesQuery = trpc.images.getImages.useQuery();

  const generateMutation = trpc.images.generate.useMutation({
    onSuccess: () => {
      utils.images.getImages.invalidate();
      setPrompt("");
      toast.success("تم توليد الصورة بنجاح!");
    },
    onError: (error) => {
      toast.error("فشل توليد الصورة: " + error.message);
    },
  });

  const deleteMutation = trpc.images.delete.useMutation({
    onSuccess: () => {
      utils.images.getImages.invalidate();
      toast.success("تم حذف الصورة");
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("يرجى إدخال وصف للصورة");
      return;
    }

    generateMutation.mutate({ prompt });
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.slice(0, 30)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("تم تحميل الصورة");
    } catch (error) {
      toast.error("فشل تحميل الصورة");
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      deleteMutation.mutate({ id });
    }
  };

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
              <ImageIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">توليد الصور</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Generation Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              أنشئ صورة جديدة
            </CardTitle>
            <CardDescription>
              صف الصورة التي تريد إنشاءها بالتفصيل
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="مثال: منظر طبيعي خلاب لجبال مغطاة بالثلج عند غروب الشمس، سماء برتقالية وبحيرة هادئة..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={generateMutation.isPending}
              />
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generateMutation.isPending}
                className="w-full sm:w-auto"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارٍ التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="ml-2 h-4 w-4" />
                    توليد الصورة
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gallery */}
        <div>
          <h2 className="text-2xl font-bold mb-4">معرض الصور</h2>
          {imagesQuery.isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : imagesQuery.data && imagesQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imagesQuery.data.map((image) => (
                <Card key={image.id} className="overflow-hidden group">
                  <div className="relative aspect-square">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDownload(image.imageUrl, image.prompt)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {image.prompt}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(image.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">لا توجد صور بعد</h3>
                <p className="text-muted-foreground mb-4">
                  ابدأ بإنشاء صورتك الأولى باستخدام الذكاء الاصطناعي
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
