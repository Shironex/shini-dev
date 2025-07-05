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
      console.log(`[MESSAGE_CREATE] Creating user message for project: ${input.content.projectId}`);
      
      const createdMessage = await ctx.prisma.message.create({
        data: {
          content: input.content.prompt,
          role: "USER",
          type: "RESULT",
          status: "COMPLETED",
          project: {
            connect: {
              id: input.content.projectId,
            },
          },
        },
      });

      console.log(`[MESSAGE_CREATE] Created user message: ${createdMessage.id}`);

      // Create a streaming assistant message
      console.log(`[MESSAGE_CREATE] Creating streaming assistant message`);
      
      const streamingMessage = await ctx.prisma.message.create({
        data: {
          content: "",
          role: "ASSISTANT",
          type: "RESULT",
          status: "STREAMING",
          project: {
            connect: {
              id: input.content.projectId,
            },
          },
        },
      });

      console.log(`[MESSAGE_CREATE] Created streaming message: ${streamingMessage.id} with status: ${streamingMessage.status}`);

      console.log(`[MESSAGE_CREATE] Sending Inngest event with streamingMessageId: ${streamingMessage.id}`);

      await inngest.send({
        name: "code-agent/run",
        data: {
          text: input.content.prompt,
          projectId: input.content.projectId,
          streamingMessageId: streamingMessage.id,
        },
      });

      console.log(`[MESSAGE_CREATE] Inngest event sent successfully`);

      return createdMessage;
    }),
  updateStreaming: baseProcedure
    .input(
      z.object({
        messageId: z.string().min(1, { message: "Message ID is required" }),
        content: z.string(),
        status: z.enum(["STREAMING", "COMPLETED", "FAILED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(`[UPDATE_STREAMING] Updating message ${input.messageId} with status: ${input.status}`);
      
      const updatedMessage = await ctx.prisma.message.update({
        where: {
          id: input.messageId,
        },
        data: {
          content: input.content,
          status: input.status,
        },
      });

      console.log(`[UPDATE_STREAMING] Updated message successfully: ${updatedMessage.id}`);
      
      return updatedMessage;
    }),
});
