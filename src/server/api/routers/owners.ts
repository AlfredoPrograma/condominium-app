import * as trpc from '@trpc/server'
import { registerOwnerSchema } from '~/components/admin/forms/RegisterOwnerForm'
import {
    createTRPCRouter,
    protectedProcedure
} from '~/server/api/trpc'
import { hashPassword } from '~/utils/encrypt/hashPassword'

export const ownersRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            const owners = await ctx.prisma.user.findMany({ where: {
                role: 'OWNER'
            }, select: {
                userId: true,
                email: true
            }})

            return {
                status: 200,
                message: "Owners found sucessfully",
                owners
            }
        }),

    create: protectedProcedure
        .input(registerOwnerSchema)
        .mutation(async ({ input, ctx }) => {
            const { email, password, age, firstName, identifierCode, lastName, phoneNumber } = input

            const exists = await ctx.prisma.user.findFirst({
                where: { email }
            })

            if (exists) {
                throw new trpc.TRPCError({
                code: "CONFLICT",
                message: "Invalid credentials given"
                })
            }

            const hashedPassword = await hashPassword(password)

            await ctx.prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    age: Number(age),
                    identifierCode,
                    phoneNumber,
                    email, 
                    password: hashedPassword, 
                }
            })

            return {
                status: 201,
                message: "Owner created successfully",
                user: {
                    email
                }
            }
        })
})