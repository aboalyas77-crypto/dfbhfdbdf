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
    subscriptionTier: "free",
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

describe("usage tracking procedures", () => {
  it("should get current month usage", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const usage = await caller.usage.getCurrent();

    expect(usage).toBeDefined();
    expect(usage?.userId).toBe(ctx.user!.id);
    expect(usage?.month).toBeDefined();
    expect(typeof usage?.chatMessages).toBe("number");
    expect(typeof usage?.imagesGenerated).toBe("number");
    expect(typeof usage?.textAnalyses).toBe("number");
    expect(typeof usage?.filesUploaded).toBe("number");
  });
});
