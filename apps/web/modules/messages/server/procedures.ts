import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const messagesRouter = createTRPCRouter({
  getMessages: baseProcedure.query(async ({ ctx }) => {
    const messages = await ctx.prisma.message.findMany({
      orderBy: {
        updatedAt: "desc",
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
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdMessage = await ctx.prisma.message.create({
        data: {
          content: input.content.prompt,
          role: "USER",
          type: "RESULT",
        },
      });
      
      await inngest.send({
        name: "code-agent/run",
        data: { text: input.content.prompt },
      });

      return createdMessage;
    }),
});
