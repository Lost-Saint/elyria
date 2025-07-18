import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import z from 'zod';
import { inngest } from '~/inngest/client';
import { db } from '~/server/db';
import { TRPCError } from '@trpc/server';

export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: 'Poject ID is required' }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const messages = await db.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.session.user.id,
          },
        },
        include: {
          fragment: true,
        },
        orderBy: {
          updatedAt: 'asc',
        },
      });
      return messages;
    }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: 'Prompt is required' })
          .max(10000, { message: 'Prompt is too long.' }),
        projectId: z.string().min(1, { message: 'Poject ID is required' }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await db.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.session.user.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
      }

      const createdMessage = await db.message.create({
        data: {
          projectId: existingProject.id,
          content: input.value,
          role: 'USER',
          type: 'RESULT',
        },
      });
      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });
      return createdMessage;
    }),
});
