import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // Auto-login in development mode for local testing
  if (process.env.NODE_ENV === 'development' && !user) {
    user = {
      id: 1,
      openId: 'dev-user',
      name: 'Developer',
      email: 'dev@localhost',
      loginMethod: 'local',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as User;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
