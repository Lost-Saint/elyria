import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { generateSlug } from 'random-word-slugs';
import z from 'zod';
import { inngest } from '~/inngest/client';
import { db } from '~/server/db';
import { TRPCError } from '@trpc/server';

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: 'ID is required' }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await db.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found.',
        });
      }

      return existingProject;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await db.project.findMany({
      where: {
        userId: ctx.session.user.id, // Filter by user ID
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: 'Value is required' })
          .max(10000, { message: 'Value is too long.' }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const createdProject = await db.project.create({
        data: {
          userId: ctx.session.user.id,
          name: generateSlug(2, {
            format: 'kebab',
          }),
          messages: {
            create: {
              content: input.value,
              role: 'USER',
              type: 'RESULT',
            },
          },
        },
      });
      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });
      return createdProject;
    }),
});
