import * as trpc from '@trpc/server'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { signUpSchema } from "~/utils/validations/auth";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input

      const exists = await ctx.prisma.user.findFirst({
        where: { email }
      })

      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "Invalid credentials given"
        })
      }

      await ctx.prisma.user.create({
        data: { password, email }
      })

      return {
        status: 201,
        message: "Account created successfully",
        user: {
          email
        }
      }
    }),

    testSignedIn: protectedProcedure.query(() => {
      return { data: "Hello" }
    })
});
