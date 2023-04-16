import { createTRPCRouter, profileCompletedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const calendarRouter = createTRPCRouter({
  getAll: profileCompletedProcedure.query(({ ctx }) => {
    return ctx.prisma.calendar.findMany({
      where: { ownerId: ctx.user.id },
    });
  }),
  createCalendar: profileCompletedProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.enum([
          "RED",
          "ORANGE",
          "YELLOW",
          "GREEN",
          "BLUE",
          "PURPLE",
          "PINK",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.calendar.create({
        data: {
          name: input.name,
          color: input.color,
          owner: { connect: { id: ctx.user.id } },
        },
      });
    }),
});
