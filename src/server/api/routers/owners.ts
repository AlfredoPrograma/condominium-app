import * as trpc from '@trpc/server'
import { z } from 'zod'
import { registerOwnerSchema } from '~/components/admin/forms/RegisterOwnerForm'
import { changePasswordSchema } from '~/pages/auth/change-password'
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure
} from '~/server/api/trpc'
import { sendMail } from '~/services/mailing'
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
            const { email, age, firstName, identifierCode, lastName, phoneNumber } = input

            const exists = await ctx.prisma.user.findFirst({
                where: { email }
            })

            if (exists) {
                throw new trpc.TRPCError({
                code: "CONFLICT",
                message: "Invalid credentials given"
                })
            }

            const newOwner = await ctx.prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    age: Number(age),
                    identifierCode,
                    phoneNumber,
                    email, 
                }
            })

            await sendMail({
                subject: 'Culmina tu registro',
                to: newOwner.email,
                text: `http://localhost:3000/auth/change-password?userId=${newOwner.userId}`
            })

            return {
                status: 201,
                message: "Owner created successfully",
                user: {
                    email
                }
            }
        }),
    concretePassword: publicProcedure
        .input(changePasswordSchema.extend({ userId: z.string().nonempty() }))
        .mutation(async ({ input, ctx }) => {
            const { password, repeatedPassword, userId } = input

            if (password !== repeatedPassword) {
                throw new trpc.TRPCError({
                    code: "BAD_REQUEST",
                    message: "Password and password confirmation are mistmaching"
                })
            }

            const hashedPassword = await hashPassword(password) 

             await ctx.prisma.user.update({ where: { userId }, data: {
                password: hashedPassword,
                emailVerified: new Date()
            }})

            return {
                status: 200,
                message: "Owner has concreted its registration",
            }
        })
    
})