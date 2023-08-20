import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, GetServerSidePropsResult, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { TextField } from "~/components/common/forms/TextField";
import { PageContainer } from "~/components/common/layouts";
import { routes } from "~/constants/routes";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { ErrorMessages } from "~/utils/errors/errorMessages";

export const changePasswordSchema = z.object({
    password: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
    repeatedPassword: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
})

const refinedChangePasswordSchema = changePasswordSchema.refine(({ password, repeatedPassword }) => password === repeatedPassword, { message: ErrorMessages.PASSWORDS_MISMATCH, path: ['password'] })

type ChangePasswordSchema = z.infer<typeof refinedChangePasswordSchema>

interface ChangePasswordProps {
    userId: string
}

export default function ChangePassword({ userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()

    const { mutate: mutateConcretePassword } = api.owners.concretePassword.useMutation({
        onSuccess: () => {
            router.replace(routes.auth.signIn)
        },

        onError: () => {
            toast('Ha habido un error', { type: 'error' })
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
                        <h1 className="text-3xl font-bold">Registro de nuevo residente</h1>
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

    const queryParams = ctx.query

    if (!queryParams.userId) {
        return redirectToSignIn
    }

    const targetUser = await prisma.user.findUnique({ where: { userId: queryParams.userId as string } })

    if (!targetUser) {
        return redirectToSignIn
    }

    if (targetUser?.password) {
        return redirectToSignIn
    }

    return {
        props: {
            userId: targetUser?.userId
        }
    }
}