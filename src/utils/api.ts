/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { Prisma } from "@prisma/client";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import {
  type inferRouterInputs,
  type inferRouterOutputs,
  TRPCError,
} from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      },
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function handlePrismaErrors(error: unknown): void {
  if (error instanceof Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.code === `P2002`) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `${
            error?.meta?.target?.toString() ?? ``
          }:unique_constraint_failed"`,
        });
      } else if (error?.code === `P2003`) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Record not found",
        });
      } else if (error?.code === `P2025`) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Record not found",
        });
      } else if (error?.code === `P2024`) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Record not found",
        });
      } else if (error?.code === `P2016`) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Record not found",
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal server error occured",
        });
      }
    } else if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An internal server error occured",
      });
    }
  } else {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occured",
    });
  }
}
