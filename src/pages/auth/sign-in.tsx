import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import Image from "next/image"
import Link from "next/link"
import { getSession, signIn } from "next-auth/react"

import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"

import { TextField } from "~/components/common/forms/TextField"
import { PageContainer } from "~/components/common/layouts/PageContainer"
import { SignInSchema, signInSchema } from "~/utils/validations/auth"
import { routes } from "~/constants/routes"
import { ErrorCodes, errors } from "~/constants/errors"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx)

    if (session) {
        return {
            redirect: {
                destination: routes.owner.home,
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}


export default function SignIn() {
    const router = useRouter()
    const formMethods = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
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

            router.replace(routes.owner.home)

        } catch (err) {
            console.log(err)
        }
    }

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