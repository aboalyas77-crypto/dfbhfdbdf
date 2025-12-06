import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { 
  FileText, 
  ArrowRight,
  Loader2,
  Copy,
  RefreshCw,
  FileSearch,
  FileEdit
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function TextAnalysis() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeTab, setActiveTab] = useState<"rewrite" | "summarize" | "analyze">("rewrite");

  const utils = trpc.useUtils();
  const analysesQuery = trpc.text.getAnalyses.useQuery();

  const analyzeMutation = trpc.text.analyze.useMutation({
    onSuccess: (data) => {
      setOutputText(data!.outputText);
      utils.text.getAnalyses.invalidate();
      toast.success("تمت المعالجة بنجاح!");
    },
    onError: (error) => {
      toast.error("فشلت المعالجة: " + error.message);
    },
  });

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      toast.error("يرجى إدخال نص للمعالجة");
      return;
    }

    analyzeMutation.mutate({
      text: inputText,
      type: activeTab,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("تم نسخ النص");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const getTabInfo = (tab: string) => {
    const info = {
      rewrite: {
        title: "إعادة الكتابة",
        description: "أعد كتابة النص بطريقة أفضل وأكثر احترافية",
        icon: FileEdit,
        placeholder: "الصق النص الذي تريد إعادة كتابته هنا..."
      },
      summarize: {
        title: "التلخيص",
        description: "احصل على ملخص موجز ومفيد للنص",
        icon: FileSearch,
        placeholder: "الصق النص الذي تريد تلخيصه هنا..."
      },
      analyze: {
        title: "التحليل",
        description: "احصل على تحليل شامل ورؤى مفيدة للنص",
        icon: FileText,
        placeholder: "الصق النص الذي تريد تحليله هنا..."
      }
    };
    return info[tab as keyof typeof info];
  };

  const currentTabInfo = getTabInfo(activeTab);

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
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">تحليل النصوص</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rewrite">إعادة الكتابة</TabsTrigger>
            <TabsTrigger value="summarize">التلخيص</TabsTrigger>
            <TabsTrigger value="analyze">التحليل</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <currentTabInfo.icon className="h-5 w-5 text-primary" />
                  {currentTabInfo.title}
                </CardTitle>
                <CardDescription>{currentTabInfo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">النص الأصلي</label>
                    <Textarea
                      placeholder={currentTabInfo.placeholder}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={12}
                      disabled={analyzeMutation.isPending}
                    />
                  </div>

                  {/* Output */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">النتيجة</label>
                      {outputText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
                        >
                          <Copy className="h-4 w-4 ml-1" />
                          نسخ
                        </Button>
                      )}
                    </div>
                    <Card className="min-h-[300px]">
                      <ScrollArea className="h-[300px] p-4">
                        {analyzeMutation.isPending ? (
                          <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        ) : outputText ? (
                          <Streamdown>{outputText}</Streamdown>
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            النتيجة ستظهر هنا
                          </div>
                        )}
                      </ScrollArea>
                    </Card>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim() || analyzeMutation.isPending}
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جارٍ المعالجة...
                      </>
                    ) : (
                      <>
                        <FileText className="ml-2 h-4 w-4" />
                        معالجة النص
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RefreshCw className="ml-2 h-4 w-4" />
                    مسح
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">السجل</h2>
          {analysesQuery.isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : analysesQuery.data && analysesQuery.data.length > 0 ? (
            <div className="space-y-4">
              {analysesQuery.data.slice(0, 5).map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {getTabInfo(analysis.analysisType).title}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">النص الأصلي:</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {analysis.inputText}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">النتيجة:</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {analysis.outputText}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">لا يوجد سجل بعد</h3>
                <p className="text-muted-foreground">
                  ابدأ بمعالجة نصك الأول
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
