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
      console.log(`[PROJECT_CREATE] Creating project with prompt: ${input.content.prompt}`);
      
      const createdProject = await ctx.prisma.project.create({
        data: {
          name: generateSlug(2, { format: "kebab" }),
          messages: {
            create: {
              content: input.content.prompt,
              role: "USER",
              type: "RESULT",
              status: "COMPLETED",
            },
          },
        },
      });

      console.log(`[PROJECT_CREATE] Created project: ${createdProject.id}`);

      // Create a streaming assistant message
      console.log(`[PROJECT_CREATE] Creating streaming assistant message for project: ${createdProject.id}`);
      
      const streamingMessage = await ctx.prisma.message.create({
        data: {
          content: "",
          role: "ASSISTANT",
          type: "RESULT",
          status: "STREAMING",
          project: {
            connect: {
              id: createdProject.id,
            },
          },
        },
      });

      console.log(`[PROJECT_CREATE] Created streaming message: ${streamingMessage.id} with status: ${streamingMessage.status}`);

      console.log(`[PROJECT_CREATE] Sending Inngest event with streamingMessageId: ${streamingMessage.id}`);

      await inngest.send({
        name: "code-agent/run",
        data: { 
          text: input.content.prompt, 
          projectId: createdProject.id,
          streamingMessageId: streamingMessage.id,
        },
      });

      console.log(`[PROJECT_CREATE] Inngest event sent successfully`);

      return createdProject;
    }),
});
