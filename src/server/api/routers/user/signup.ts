import { z } from "zod";
import crypto from "crypto";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { handlePrismaErrors } from "~/utils/api";

export const signupRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      try {
        const salt = crypto.randomBytes(16).toString("hex");
        const password = crypto
          .pbkdf2Sync(input.password, salt, 1000, 64, "sha512")
          .toString("hex");
        const verificationSecret = crypto.randomBytes(16).toString("hex");

        const user = await prisma.user.create({
          data: {
            email: input.email,
            username: input.username,
            password,
            salt,
            VerificationSecret: {
              create: {
                secret: verificationSecret,
              },
            },
          },
        });

        return {
          ...user,
          password: undefined,
          salt: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        };
      } catch (err) {
        handlePrismaErrors(err);
      }
    }),
});

// const verifyPassword = (
//   password: string,
//   salt: string,
//   hash: string
// ) => {
//   const passwordHash = crypto
//     .pbkdf2Sync(password, salt, 1000, 64, "sha512")
//     .toString("hex");
//   return passwordHash === hash;
// };
