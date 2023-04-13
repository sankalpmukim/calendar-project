import { createTRPCRouter } from "../../trpc";
import { signupRouter } from "./signup";

export const userRouter = createTRPCRouter({
  signup: signupRouter,
});
