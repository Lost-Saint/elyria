import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import z from "zod";
import { inngest } from "~/inngest/client";
import { db } from "~/server/db";

export const messagesRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Poject ID is required" }),
      }),
    )
    .query(async ({ input }) => {
      const messages = await db.message.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      return messages;
    }),
  create: publicProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(10000, { message: "Prompt is too long." }),
        projectId: z.string().min(1, { message: "Poject ID is required" }),
      }),
    )
    .mutation(async ({ input }) => {
      const createdMessage = await db.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });
      return createdMessage;
    }),
});
