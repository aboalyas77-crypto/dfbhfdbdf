import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  Upload as UploadIcon, 
  ArrowRight,
  Loader2,
  File,
  FileImage,
  FileText,
  Trash2,
  Download,
  FolderOpen
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Files() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const filesQuery = trpc.files.getFiles.useQuery();

  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: () => {
      utils.files.getFiles.invalidate();
      toast.success("تم رفع الملف بنجاح!");
      setUploading(false);
    },
    onError: (error) => {
      toast.error("فشل رفع الملف: " + error.message);
      setUploading(false);
    },
  });

  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => {
      utils.files.getFiles.invalidate();
      toast.success("تم حذف الملف");
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("نوع الملف غير مدعوم. يرجى رفع PDF أو صورة");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت");
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/png;base64, prefix

        uploadMutation.mutate({
          filename: file.name,
          fileData: base64Data,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("فشل قراءة الملف");
      setUploading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الملف؟")) {
      deleteMutation.mutate({ id });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "غير معروف";
    if (bytes < 1024) return bytes + " بايت";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " كيلوبايت";
    return (bytes / (1024 * 1024)).toFixed(2) + " ميجابايت";
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return File;
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType === 'application/pdf') return FileText;
    return File;
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
              <UploadIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">إدارة الملفات</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5 text-primary" />
              رفع ملف جديد
            </CardTitle>
            <CardDescription>
              ارفع ملفات PDF أو صور (حتى 10 ميجابايت)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">جارٍ رفع الملف...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <UploadIcon className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium mb-1">انقر لاختيار ملف</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, JPG, PNG, GIF, WEBP (حتى 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">ملفاتي</h2>
          {filesQuery.isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filesQuery.data && filesQuery.data.length > 0 ? (
            <div className="grid gap-4">
              {filesQuery.data.map((file) => {
                const FileIcon = getFileIcon(file.mimeType);
                return (
                  <Card key={file.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <FileIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.filename}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span>{new Date(file.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">لا توجد ملفات بعد</h3>
                <p className="text-muted-foreground mb-4">
                  ابدأ برفع ملفك الأول
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon className="ml-2 h-4 w-4" />
                  رفع ملف
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
