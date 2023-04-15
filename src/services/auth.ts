import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { NextApiResponse } from "next";
import { delete_cookie } from "~/services/cookie";

export type ClientUser = Omit<
  User,
  "password" | "salt" | "createdAt" | "updatedAt"
>;

const ClientUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  role: z.string(),
  username: z.string(),
});

export const getToken = (user: ClientUser) => {
  // to remove the confidential data from the user object
  const parse = ClientUserSchema.safeParse(user);
  if (!parse.success) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  const token = jwt.sign(parse.data, process.env.JWT_SECRET ?? `1234`, {
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

export function logOut(res?: NextApiResponse): void {
  // delete the cookie
  if (typeof res === "undefined") {
    delete_cookie("token");
    window.location.href = "/";
  } else {
    res.setHeader("Set-Cookie", [`token=; Path=/; Max-Age=0`]);
    res.writeHead(302, { Location: "/" });
    res.end();
  }
}

export function decodeJwt(token: string): ClientUser | null {
  const base64Payload = token.split(".")[1];

  if (!base64Payload) {
    return null;
  }

  const payloadBuffer = Buffer.from(base64Payload, "base64");

  return JSON.parse(payloadBuffer.toString()) as ClientUser;
}
