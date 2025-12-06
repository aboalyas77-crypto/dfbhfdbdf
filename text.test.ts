import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    subscriptionTier: "pro",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    subscriptionStatus: null,
    subscriptionEndsAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("text analysis procedures", () => {
  it("should get user text analyses", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const analyses = await caller.text.getAnalyses();

    expect(Array.isArray(analyses)).toBe(true);
  });

  it("should rewrite text", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.text.analyze({
      text: "This is a test text that needs to be rewritten.",
      type: "rewrite",
    });

    expect(result).toBeDefined();
    expect(result?.inputText).toBe("This is a test text that needs to be rewritten.");
    expect(result?.analysisType).toBe("rewrite");
    expect(result?.outputText).toBeDefined();
    expect(result?.userId).toBe(ctx.user!.id);
  }, 15000);

  it("should summarize text", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.text.analyze({
      text: "This is a long text that needs to be summarized. It contains multiple sentences and paragraphs.",
      type: "summarize",
    });

    expect(result).toBeDefined();
    expect(result?.analysisType).toBe("summarize");
    expect(result?.outputText).toBeDefined();
  }, 15000);
});
