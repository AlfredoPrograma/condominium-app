import { type ErrorCodes, errors } from "~/constants/errors"
import { FormProvider, useForm } from "react-hook-form"
import { getSession, signIn, useSession } from "next-auth/react"
import { ErrorMessages } from "~/utils/errors/errorMessages"
import { type GetServerSideProps } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageContainer } from "~/components/common/layouts/PageContainer"
import { TextField } from "~/components/common/forms/TextField"
import { getDashboardRouteByRole } from "~/constants/routes"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export const signInSchema = z.object({
    email: z.string().email({ message: ErrorMessages.INVALID_EMAIL }),
    password: z
        .string()
        .min(4, { message: ErrorMessages.WEAK_PASSWORD })
})

export type SignInSchema = z.infer<typeof signInSchema>

export default function SignIn() {
    const session = useSession()
    const router = useRouter()

    const formMethods = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const handleSignIn = async (data: SignInSchema) => {
        try {
            const response = await signIn("credentials", {
                redirect: false,
                callbackUrl: "/",
                email: data.email,
                password: data.password
            })

            if (!response?.ok) {
                const mappedError = response?.error ?? "Unknown"
                toast(errors[mappedError as ErrorCodes], { position: "top-center", type: "error" })
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const handleRedirect = async () => {
            if (session.status === "authenticated" && session.data) {
                const destination = getDashboardRouteByRole(session.data.user.role)

                await router.replace(destination)
            }
        }

        void handleRedirect()
    }, [session, router])

    return (
        <PageContainer title="Inicia sesión">
            <section className="min-h-screen grid lg:grid-cols-[1fr_2fr]">

                <section className="grid place-items-center">
                    <div className="flex flex-col items-center gap-6">
                        <header className="flex flex-col gap-1 text-center">
                            <h1 className="font-bold text-4xl">
                                <span>¡Bienvenido a </span>
                                <span className="text-primary">Condominium</span>
                                <span>!</span>
                            </h1>

                            <h2 className="text-lg">Gestiona tus responsabilidades residenciales</h2>
                        </header>

                        <FormProvider {...formMethods}>
                            <form onSubmit={formMethods.handleSubmit(handleSignIn)} className="flex flex-col gap-4">
                                <TextField
                                    label="Correo electrónico"
                                    name="email"
                                    id="email"
                                    placeholder="usuario@mail.com"
                                    type="text"
                                />

                                <TextField
                                    label="Contraseña"
                                    name="password"
                                    id="password"
                                    placeholder="*******"
                                    type="password"
                                />

                                <button type="submit" className="btn-primary text-base-100 rounded-md py-2">Iniciar sesión</button>
                            </form>
                        </FormProvider>

                        <footer className="max-w-sm text-sm text-center">
                            <span className="font-semibold">¿Tienes algún problema? </span>
                            <span>Comunícate con el administrador de tu condominio </span>
                            <Link href="#" className="link text-primary-focus">aquí</Link>
                        </footer>
                    </div>

                </section>

                <div className="hidden lg:block">
                    <figure className="h-full w-full relative">
                        <Image
                            src="/images/building-front-page.jpg"
                            alt="Building"
                            fill
                        />
                    </figure>
                </div>
            </section>
        </PageContainer>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx)

    if (session) {
        const destination = getDashboardRouteByRole(session.user.role)

        return {
            redirect: {
                destination,
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}
