import * as trpc from '@trpc/server'
import * as jwt from 'jsonwebtoken'
import { z } from 'zod'
import { registerOwnerSchema } from '~/components/admin/forms/RegisterOwnerForm'
import { env } from '~/env.mjs'
import { changePasswordSchema } from '~/pages/auth/change-password'
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure
} from '~/server/api/trpc'
import { sendMail } from '~/services/mailing'
import { hashPassword } from '~/utils/encrypt/hashPassword'

const withUserIdSchema = z.object({
    userId: z.string().nonempty()
})

export const ownersRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            const owners = await ctx.prisma.user.findMany({ where: {
                role: 'OWNER',
                isActive: true
            }, select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                identifierCode: true,
                userId: true,
                email: true,
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
            const { email, age, firstName, identifierCode, lastName, phoneNumber, propertyCode } = input

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
                    properties: {
                        create: [
                            {
                                code: propertyCode
                            }
                        ]
                    }
                }
            })

            const token = await jwt.sign({ userId: newOwner.userId }, env.NEXTAUTH_SECRET!)

            await sendMail({
                subject: 'Culmina tu registro',
                to: newOwner.email,
                text: `http://localhost:3000/auth/change-password?token=${token}`
            })

            return {
                status: 201,
                message: "Owner created successfully",
                user: {
                    email
                }
            }
        }),

    delete: protectedProcedure.input(withUserIdSchema).mutation(async ({ input, ctx }) => {
        const { userId } = input

        await ctx.prisma.user.update({
            where: {
                userId
            },
            data: {
                isActive: false
            }
        })

        return {
            status: 200,
            message: "Owner deleted successfully"
        }
    }),

    concretePassword: publicProcedure
        .input(changePasswordSchema.extend({ ...withUserIdSchema.shape }))
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
        }),
})