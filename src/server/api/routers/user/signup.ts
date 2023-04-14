import { z } from "zod";
import crypto from "crypto";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { handlePrismaErrors } from "~/utils/api";
import { sendEmailVerification } from "~/services/email";
import { TRPCError } from "@trpc/server";

export const signupRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20),
        username: z.string().min(3).max(20),
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
        console.count("registration");

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

        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          password: ignorePass,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          createdAt,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          salt: ignoreSalt,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          updatedAt,
          ...userWithoutPassword
        } = user;
        console.count("registration");

        const emailSent = await sendEmailVerification(
          user.email,
          verificationSecret
        );

        console.log("emailSent", emailSent);

        if (!emailSent) {
          console.error("Failed to send email verification");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send email verification",
          });
        }

        return userWithoutPassword;
      } catch (err) {
        handlePrismaErrors(err);
      }
    }),

  emailVerified: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: input.userId,
          },
        });

        return user?.emailVerified ?? false;
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
