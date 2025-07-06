import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { inngest } from "~/inngest/client";
import { db } from "~/server/db";

export const projectsRouter = createTRPCRouter({
  getMany: publicProcedure.query(async () => {
    const projects = await db.project.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });
    return projects;
  }),
  create: publicProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(10000, { message: "Prompt is too long." }),
      }),
    )
    .mutation(async ({ input }) => {
      const createdProject = await db.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });
      return createdProject;
    }),
});
