import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";

export const projectsRouter = createTRPCRouter({
  getProjects: baseProcedure.query(async ({ ctx }) => {
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
