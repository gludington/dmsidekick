import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { getCompletion } from "../../openai";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  completion: publicProcedure
    .input(z.object({ text: z.string() }).nullish())
    .query(async ({ input }) => {
      const response = await getCompletion(input?.text);
      const choices = response?.choices;
      return {
        message: choices?.length > 0 ? choices[0] : "",
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
