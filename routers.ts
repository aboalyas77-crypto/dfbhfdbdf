import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createConversation, 
  getUserConversations, 
  getConversationById,
  deleteConversation,
  createMessage,
  getConversationMessages,
  saveGeneratedImage,
  getUserGeneratedImages,
  deleteGeneratedImage,
  saveTextAnalysis,
  getUserTextAnalyses,
  saveUploadedFile,
  getUserUploadedFiles,
  deleteUploadedFile,
  getOrCreateUsageTracking,
  incrementUsage
} from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Chat functionality
  chat: router({
    // Get all conversations for the user
    getConversations: protectedProcedure.query(async ({ ctx }) => {
      return await getUserConversations(ctx.user.id);
    }),

    // Get a specific conversation with messages
    getConversation: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const conversation = await getConversationById(input.id);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new Error("Conversation not found");
        }
        const messages = await getConversationMessages(input.id);
        return { conversation, messages };
      }),

    // Create a new conversation
    createConversation: protectedProcedure
      .input(z.object({ title: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return await createConversation({
          userId: ctx.user.id,
          title: input.title,
        });
      }),

    // Delete a conversation
    deleteConversation: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const conversation = await getConversationById(input.id);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new Error("Conversation not found");
        }
        await deleteConversation(input.id);
        return { success: true };
      }),

    // Send a message and get AI response
    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Verify conversation ownership
        const conversation = await getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new Error("Conversation not found");
        }

        // Save user message
        await createMessage({
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
        });

        // Get conversation history
        const messages = await getConversationMessages(input.conversationId);
        
        // Prepare messages for LLM
        const llmMessages = messages.map(msg => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        }));

        // Get AI response
        const response = await invokeLLM({
          messages: llmMessages,
        });

        const assistantMessage = (typeof response.choices[0]?.message?.content === 'string' 
          ? response.choices[0].message.content 
          : "عذراً، لم أتمكن من الرد.");

        // Save assistant message
        const savedMessage = await createMessage({
          conversationId: input.conversationId,
          role: "assistant",
          content: assistantMessage,
        });

        // Track usage
        await incrementUsage(ctx.user.id, "chatMessages");

        return savedMessage;
      }),
  }),

  // Image generation functionality
  images: router({
    // Get all generated images for the user
    getImages: protectedProcedure.query(async ({ ctx }) => {
      return await getUserGeneratedImages(ctx.user.id);
    }),

    // Generate a new image
    generate: protectedProcedure
      .input(z.object({
        prompt: z.string(),
        originalImageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Generate image
        const imageResult = await generateImage({
          prompt: input.prompt,
          originalImages: input.originalImageUrl ? [{
            url: input.originalImageUrl,
            mimeType: "image/jpeg",
          }] : undefined,
        });

        // Save to database
        const imageUrl = imageResult.url || '';
        const saved = await saveGeneratedImage({
          userId: ctx.user.id,
          prompt: input.prompt,
          imageUrl,
          imageKey: imageUrl,
        });

        // Track usage
        await incrementUsage(ctx.user.id, "imagesGenerated");

        return saved;
      }),

    // Delete an image
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteGeneratedImage(input.id);
        return { success: true };
      }),
  }),

  // Text analysis functionality
  text: router({
    // Get all text analyses for the user
    getAnalyses: protectedProcedure.query(async ({ ctx }) => {
      return await getUserTextAnalyses(ctx.user.id);
    }),

    // Analyze or rewrite text
    analyze: protectedProcedure
      .input(z.object({
        text: z.string(),
        type: z.enum(["rewrite", "summarize", "analyze"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const prompts = {
          rewrite: "أعد كتابة النص التالي بطريقة أفضل وأكثر احترافية:",
          summarize: "لخص النص التالي بشكل موجز ومفيد:",
          analyze: "حلل النص التالي وقدم رؤى مفيدة:",
        };

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "أنت مساعد ذكي متخصص في تحليل وإعادة كتابة النصوص." },
            { role: "user", content: `${prompts[input.type]}\n\n${input.text}` },
          ],
        });

        const outputText = (typeof response.choices[0]?.message?.content === 'string' 
          ? response.choices[0].message.content 
          : "عذراً، لم أتمكن من معالجة النص.");

        // Save to database
        const saved = await saveTextAnalysis({
          userId: ctx.user.id,
          inputText: input.text,
          analysisType: input.type,
          outputText,
        });

        // Track usage
        await incrementUsage(ctx.user.id, "textAnalyses");

        return saved;
      }),
  }),

  // File upload functionality
  files: router({
    // Get all uploaded files for the user
    getFiles: protectedProcedure.query(async ({ ctx }) => {
      return await getUserUploadedFiles(ctx.user.id);
    }),

    // Upload a file
    upload: protectedProcedure
      .input(z.object({
        filename: z.string(),
        fileData: z.string(), // Base64 encoded
        mimeType: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Decode base64
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileSize = buffer.length;

        // Generate unique file key
        const fileKey = `${ctx.user.id}/files/${nanoid()}-${input.filename}`;

        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);

        // Save to database
        const saved = await saveUploadedFile({
          userId: ctx.user.id,
          filename: input.filename,
          fileKey,
          fileUrl: url,
          mimeType: input.mimeType,
          fileSize,
        });

        // Track usage
        await incrementUsage(ctx.user.id, "filesUploaded");

        return saved;
      }),

    // Delete a file
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteUploadedFile(input.id);
        return { success: true };
      }),
  }),

  // Usage tracking
  usage: router({
    // Get current month usage
    getCurrent: protectedProcedure.query(async ({ ctx }) => {
      const month = new Date().toISOString().slice(0, 7);
      return await getOrCreateUsageTracking(ctx.user.id, month);
    }),
  }),
});

export type AppRouter = typeof appRouter;
