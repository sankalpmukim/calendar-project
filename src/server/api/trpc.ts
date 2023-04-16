/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "~/server/db";

type CreateContextOptions = {
  req: NextApiRequest;
  res: NextApiResponse;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = ({ req, res }: CreateContextOptions) => {
  return {
    prisma,
    req,
    res,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { req, res } = _opts;
  return createInnerTRPCContext({ req, res });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserId, isTokenValid } from "~/services/auth";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * Authenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
const isAuthed = middleware(async ({ ctx, next }) => {
  if (
    !ctx.req.cookies.token ||
    !ctx.req.cookies.token.length ||
    !isTokenValid(ctx.req.cookies.token)
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await ctx.prisma.user.findUnique({
    where: { id: getUserId(ctx.req.cookies.token) },
  });

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const authedProcedure = publicProcedure.use(isAuthed);

const isEmailVerified = isAuthed.unstable_pipe(async ({ ctx, next }) => {
  if (!ctx.user?.emailVerified) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Email not verified" });
  }

  return next();
});

export const emailVerifiedProcedure = publicProcedure.use(isEmailVerified);

const isProfileCompleted = isEmailVerified.unstable_pipe(
  async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "FORBIDDEN", message: "User not found" });
    }

    const userProfile = await ctx.prisma.profile.findUnique({
      where: { userId: ctx.user.id },
    });

    if (!userProfile) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Profile not found. Please complete your profile",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: {
          ...ctx.user,
          profile: userProfile,
        },
      },
    });
  }
);

export const profileCompletedProcedure =
  publicProcedure.use(isProfileCompleted);
