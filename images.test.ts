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

describe("images procedures", () => {
  it("should get user images", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const images = await caller.images.getImages();

    expect(Array.isArray(images)).toBe(true);
  });

  it("should generate an image", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.images.generate({
      prompt: "A beautiful sunset over mountains",
    });

    expect(result).toBeDefined();
    expect(result?.prompt).toBe("A beautiful sunset over mountains");
    expect(result?.userId).toBe(ctx.user!.id);
    expect(result?.imageUrl).toBeDefined();
  }, 30000); // Increase timeout for image generation
});
