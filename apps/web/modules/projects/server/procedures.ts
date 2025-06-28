import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";

export const projectsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const existingProject = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return existingProject;
    }),
  getMany: baseProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        content: z.object({
          prompt: z
            .string()
            .min(1, { message: "Prompt is required" })
            .max(1000, { message: "Prompt must be less than 1000 characters" }),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdProject = await ctx.prisma.project.create({
        data: {
          name: generateSlug(2, { format: "kebab" }),
          messages: {
            create: {
              content: input.content.prompt,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: { text: input.content.prompt, projectId: createdProject.id },
      });

      return createdProject;
    }),
});
