import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  usageTracking,
  InsertUsageTracking,
  conversations,
  InsertConversation,
  messages,
  InsertMessage,
  generatedImages,
  InsertGeneratedImage,
  uploadedFiles,
  InsertUploadedFile,
  textAnalyses,
  InsertTextAnalysis
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ User Management ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserSubscription(userId: number, data: {
  subscriptionTier?: "free" | "pro" | "business";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing";
  subscriptionEndsAt?: Date | null;
}) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users).set(data).where(eq(users.id, userId));
}

// ============ Usage Tracking ============

export async function getOrCreateUsageTracking(userId: number, month: string) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await db.select().from(usageTracking)
    .where(and(eq(usageTracking.userId, userId), eq(usageTracking.month, month)))
    .limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  const newUsage: InsertUsageTracking = {
    userId,
    month,
    chatMessages: 0,
    imagesGenerated: 0,
    textAnalyses: 0,
    filesUploaded: 0,
  };
  
  await db.insert(usageTracking).values(newUsage);
  
  const created = await db.select().from(usageTracking)
    .where(and(eq(usageTracking.userId, userId), eq(usageTracking.month, month)))
    .limit(1);
  
  return created[0] || null;
}

export async function incrementUsage(userId: number, type: 'chatMessages' | 'imagesGenerated' | 'textAnalyses' | 'filesUploaded') {
  const db = await getDb();
  if (!db) return;
  
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const current = await getOrCreateUsageTracking(userId, month);
  if (!current) return;
  
  const newValue = (current[type] || 0) + 1;
  await db.update(usageTracking)
    .set({ [type]: newValue })
    .where(and(eq(usageTracking.userId, userId), eq(usageTracking.month, month)));
}

// ============ Conversations ============

export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(conversations).values(data);
  const id = Number(result[0].insertId);
  
  const created = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  return created[0] || null;
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function getConversationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  return result[0] || null;
}

export async function deleteConversation(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(messages).where(eq(messages.conversationId, id));
  await db.delete(conversations).where(eq(conversations.id, id));
}

// ============ Messages ============

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(messages).values(data);
  const id = Number(result[0].insertId);
  
  const created = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
  return created[0] || null;
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

// ============ Generated Images ============

export async function saveGeneratedImage(data: InsertGeneratedImage) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(generatedImages).values(data);
  const id = Number(result[0].insertId);
  
  const created = await db.select().from(generatedImages).where(eq(generatedImages.id, id)).limit(1);
  return created[0] || null;
}

export async function getUserGeneratedImages(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(generatedImages)
    .where(eq(generatedImages.userId, userId))
    .orderBy(desc(generatedImages.createdAt));
}

export async function deleteGeneratedImage(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(generatedImages).where(eq(generatedImages.id, id));
}

// ============ Uploaded Files ============

export async function saveUploadedFile(data: InsertUploadedFile) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(uploadedFiles).values(data);
  const id = Number(result[0].insertId);
  
  const created = await db.select().from(uploadedFiles).where(eq(uploadedFiles.id, id)).limit(1);
  return created[0] || null;
}

export async function getUserUploadedFiles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(uploadedFiles)
    .where(eq(uploadedFiles.userId, userId))
    .orderBy(desc(uploadedFiles.createdAt));
}

export async function deleteUploadedFile(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(uploadedFiles).where(eq(uploadedFiles.id, id));
}

// ============ Text Analyses ============

export async function saveTextAnalysis(data: InsertTextAnalysis) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(textAnalyses).values(data);
  const id = Number(result[0].insertId);
  
  const created = await db.select().from(textAnalyses).where(eq(textAnalyses.id, id)).limit(1);
  return created[0] || null;
}

export async function getUserTextAnalyses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(textAnalyses)
    .where(eq(textAnalyses.userId, userId))
    .orderBy(desc(textAnalyses.createdAt));
}
