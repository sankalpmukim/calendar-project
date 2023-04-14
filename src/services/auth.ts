import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const getToken = (user: User) => {
  const token = jwt.sign(user, process.env.JWT_SECRET ?? `1234`, {
    expiresIn: "1d",
  });
  return token;
};

export const isTokenValid = (token: string) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET ?? `1234`);
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserId = (token: string): string => {
  const decoded = jwt.decode(token);
  if (typeof decoded !== "object") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return decoded?.id;
};
