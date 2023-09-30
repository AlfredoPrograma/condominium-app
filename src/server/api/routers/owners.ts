import * as jwt from "jsonwebtoken"
import * as trpc from "@trpc/server"
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure
} from "~/server/api/trpc"
import { changePasswordSchema } from "~/pages/auth/change-password"
import { env } from "~/env.mjs"
import { hashPassword } from "~/utils/encrypt/hashPassword"
import { registerOwnerSchema } from "~/components/admin/forms/RegisterOwnerForm"
import { sendMail } from "~/services/mailing"
import { z } from "zod"

const withUserIdSchema = z.object({
    userId: z.string().nonempty()
})

export const ownersRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            const owners = await ctx.prisma.user.findMany({ 
            where: {
                role: "OWNER",
                isActive: true
            }, 
            select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                identifierCode: true,
                userId: true,
                email: true,
                age: true,
                properties: {
                    select: {
                        propertyId: true,
                        code: true
                    }
                },
            },
        })

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

            const registerAndNotify = async () => {
                return await ctx.prisma.$transaction(async (tx) => {
                    try {
                        const newOwner = await tx.user.create({
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
            
                        const token = jwt.sign({ userId: newOwner.userId }, env.NEXTAUTH_SECRET!)
            
                        await sendMail({
                            subject: "Culmina tu registro",
                            to: newOwner.email,
                            // TODO: Change this to the actual url and send a template
                            text: `http://localhost:8080/auth/change-password?token=${token}`
                        })
                    } catch(err) {
                        await tx.user.delete({ where: { email } })

                        throw new trpc.TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "An error ocurred while creating the owner"
                        })
                    }
                })
            }

            await registerAndNotify()

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

