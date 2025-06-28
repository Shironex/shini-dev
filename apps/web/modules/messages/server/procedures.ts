import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.message.findMany({
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          fragment: true,
        },
        where: {
          projectId: input.projectId,
        },
      });
      return messages;
    }),
  create: baseProcedure
    .input(
      z.object({
        content: z.object({
          prompt: z
            .string()
            .min(1, { message: "Prompt is required" })
            .max(1000, { message: "Prompt must be less than 1000 characters" }),
          projectId: z.string().min(1, { message: "Project ID is required" }),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdMessage = await ctx.prisma.message.create({
        data: {
          content: input.content.prompt,
          role: "USER",
          type: "RESULT",
          project: {
            connect: {
              id: input.content.projectId,
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          text: input.content.prompt,
          projectId: input.content.projectId,
        },
      });

      return createdMessage;
    }),
});
