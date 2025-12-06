import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { 
  Sparkles, 
  Send,
  Plus,
  Trash2,
  ArrowRight,
  MessageSquare,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function Chat() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const conversationsQuery = trpc.chat.getConversations.useQuery();
  const conversationQuery = trpc.chat.getConversation.useQuery(
    { id: selectedConversationId! },
    { enabled: selectedConversationId !== null }
  );

  const createConversationMutation = trpc.chat.createConversation.useMutation({
    onSuccess: (data) => {
      utils.chat.getConversations.invalidate();
      setSelectedConversationId(data!.id);
      toast.success("تم إنشاء محادثة جديدة");
    },
  });

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      utils.chat.getConversation.invalidate({ id: selectedConversationId! });
      setMessage("");
    },
    onError: (error) => {
      toast.error("فشل إرسال الرسالة: " + error.message);
    },
  });

  const deleteConversationMutation = trpc.chat.deleteConversation.useMutation({
    onSuccess: () => {
      utils.chat.getConversations.invalidate();
      setSelectedConversationId(null);
      toast.success("تم حذف المحادثة");
    },
  });

  const handleNewConversation = () => {
    const title = `محادثة جديدة - ${new Date().toLocaleDateString('ar-SA')}`;
    createConversationMutation.mutate({ title });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    if (!selectedConversationId) {
      toast.error("يرجى اختيار أو إنشاء محادثة أولاً");
      return;
    }

    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      content: message,
    });
  };

  const handleDeleteConversation = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المحادثة؟")) {
      deleteConversationMutation.mutate({ id });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationQuery.data?.messages]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedConversationId && conversationsQuery.data && conversationsQuery.data.length > 0) {
      setSelectedConversationId(conversationsQuery.data[0].id);
    }
  }, [conversationsQuery.data, selectedConversationId]);

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
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">محادثة الذكاء الاصطناعي</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-4 h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Conversations Sidebar */}
          <div className="col-span-12 md:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <Button onClick={handleNewConversation} className="w-full" disabled={createConversationMutation.isPending}>
                  <Plus className="ml-2 h-4 w-4" />
                  محادثة جديدة
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {conversationsQuery.isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : conversationsQuery.data && conversationsQuery.data.length > 0 ? (
                    conversationsQuery.data.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${
                          selectedConversationId === conv.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedConversationId(conv.id)}
                      >
                        <span className="text-sm truncate flex-1">{conv.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground p-4">
                      لا توجد محادثات. ابدأ محادثة جديدة!
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="col-span-12 md:col-span-9 flex flex-col">
            <Card className="flex-1 flex flex-col">
              {selectedConversationId ? (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {conversationQuery.isLoading ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : conversationQuery.data?.messages && conversationQuery.data.messages.length > 0 ? (
                        conversationQuery.data.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-4 ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {msg.role === "assistant" ? (
                                <Streamdown>{msg.content}</Streamdown>
                              ) : (
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            ابدأ المحادثة بإرسال رسالتك الأولى
                          </p>
                        </div>
                      )}
                      {sendMessageMutation.isPending && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <Separator />

                  {/* Input */}
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="اكتب رسالتك هنا..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sendMessageMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">مرحباً بك في محادثة الذكاء الاصطناعي</h3>
                  <p className="text-muted-foreground mb-4">
                    اختر محادثة من القائمة أو ابدأ محادثة جديدة
                  </p>
                  <Button onClick={handleNewConversation}>
                    <Plus className="ml-2 h-4 w-4" />
                    محادثة جديدة
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
