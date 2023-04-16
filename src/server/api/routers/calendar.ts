import { createTRPCRouter, profileCompletedProcedure } from "~/server/api/trpc";

export const calendarRouter = createTRPCRouter({
  getAll: profileCompletedProcedure.query(({ ctx }) => {
    return ctx.prisma.calendar.findMany({
      where: { ownerId: ctx.user.id },
    });
  }),
});
