import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  invoke: baseProcedure.input(z.object({
    text: z.string(),
  })).mutation(async ({ input }) => {
    const response = await inngest.send({
      name: "test/hello.world",
      data: { text: input.text },
    });

    return response;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;