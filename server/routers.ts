import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { audioRouter } from "./audioRouter";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  audio: audioRouter,
  auth: router({
    me: publicProcedure.query(opts => {
      // Auto-login in development mode for local testing
      if (process.env.NODE_ENV === 'development' && !opts.ctx.user) {
        return {
          id: 1,
          openId: 'dev-user',
          name: 'Developer',
          email: 'dev@localhost',
          loginMethod: 'local',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };
      }
      return opts.ctx.user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),


});

export type AppRouter = typeof appRouter;
