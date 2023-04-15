import { TRPCError } from "@trpc/server";
import { z } from "zod";
import crypto from "crypto";
import { getToken } from "~/services/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { signupRouter } from "~/server/api/routers/user/signup";

export const userRouter = createTRPCRouter({
  signup: signupRouter,
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const password = crypto
        .pbkdf2Sync(input.password, user.salt, 1000, 64, "sha512")
        .toString("hex");
      if (password !== user.password) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const token = getToken(user);
      ctx.res.setHeader("Set-Cookie", [
        `token=${token}; Path=/; Max-Age=86400`,
      ]);
      return user;
    }),
});
