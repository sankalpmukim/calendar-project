import { createTRPCRouter, profileCompletedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const eventRouter = createTRPCRouter({
  getAllInARange: profileCompletedProcedure
    .input(z.object({ start: z.string(), end: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: {
          calendar: { ownerId: ctx.user.id },
          start: { gte: input.start },
          end: { lte: input.end },
        },
        include: { calendar: true },
      });
    }),
});
