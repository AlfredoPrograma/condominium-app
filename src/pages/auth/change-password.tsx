import * as jwt from "jsonwebtoken"
import { FormProvider, useForm } from "react-hook-form";
import { type GetServerSideProps, type InferGetServerSidePropsType } from "next";
import { ErrorMessages } from "~/utils/errors/errorMessages";
import { PageContainer } from "~/components/common/layouts";
import { TextField } from "~/components/common/forms/TextField";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { routes } from "~/constants/routes";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const changePasswordSchema = z.object({
    password: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
    repeatedPassword: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
})

const refinedChangePasswordSchema = changePasswordSchema.refine(({ password, repeatedPassword }) => password === repeatedPassword, { message: ErrorMessages.PASSWORDS_MISMATCH, path: ["password"] })

type ChangePasswordSchema = z.infer<typeof refinedChangePasswordSchema>

interface ChangePasswordProps {
    userId: string
}

export default function ChangePassword({ userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()

    const { mutate: mutateConcretePassword } = api.owners.concretePassword.useMutation({
        onSuccess: async () => {
            await router.replace(routes.auth.signIn)
        },

        onError: () => {
            toast("Ha habido un error", { type: "error" })
        }
    })

    const formMethods = useForm<ChangePasswordSchema>({
        resolver: zodResolver(refinedChangePasswordSchema)
    })

    const handleChangePassword = (data: ChangePasswordSchema) => {
        mutateConcretePassword({
            ...data,
            userId
        })
    }

    return (
        <PageContainer title="Cambiar contraseña">
            <section className="flex justify-center p-8">
                <div className="flex flex-col gap-6">
                    <header>
                        <h1 className="text-3xl font-bold">Registro de nuevo propietario</h1>
                    </header>
                    <FormProvider {...formMethods}>
                        <form onSubmit={formMethods.handleSubmit(handleChangePassword)} className="flex flex-col gap-4">
                            <div>
                                <TextField
                                    id="password"
                                    label="Nueva contraseña"
                                    name="password"
                                    type="password"
                                />

                                <TextField
                                    id="repeatedPassword"
                                    label="Repite tu contraseña"
                                    name="repeatedPassword"
                                    type="password"
                                />
                            </div>

                            <footer>
                                <button className="btn btn-primary">Continuar</button>
                            </footer>
                        </form>
                    </FormProvider>
                </div>
            </section>
        </PageContainer>
    )
}

export const getServerSideProps: GetServerSideProps<ChangePasswordProps> = async (ctx) => {
    const redirectToSignIn = {
        redirect: {
            destination: routes.auth.signIn,
            permanent: false
        }
    }

    try {
        const queryParams = ctx.query

        if (!queryParams.token) {
            return redirectToSignIn
        }

        const { userId } = jwt.verify(queryParams.token as string, env.NEXTAUTH_SECRET!) as { userId: string }

        const targetUser = await prisma.user.findUnique({ where: { userId } })

        // TODO: redirect to internal server error or not found error
        if (!targetUser || targetUser.emailVerified) {
            return redirectToSignIn
        }

        return {
            props: {
                userId: targetUser?.userId
            }
        }
    } catch (err) {
        // TODO: redirect to expired or invalid token page
        return redirectToSignIn
    }
}