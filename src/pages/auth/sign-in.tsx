import { signIn } from "next-auth/react"
import { FormEvent } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { TextField } from "~/components/common/forms/TextField"
import { PageContainer } from "~/components/common/layouts/PageContainer"
import { SignInSchema, signInSchema } from "~/utils/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"

export default function SignIn() {
    const formMethods = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const handleSignIn = async (data: SignInSchema) => {
        try {
            const res = await signIn("credentials", {
                redirect: false,
                callbackUrl: "/",
                email: data.email,
                password: data.password
            })

            console.log(res)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <PageContainer title="Sign in">
            <section className="min-h-screen grid lg:grid-cols-[1fr_2fr]">
                <section className="grid place-items-center">
                    <div className="flex flex-col items-center gap-6">
                        <header className="flex flex-col gap-2 text-center">
                            <h1 className="font-bold text-3xl">
                                <span>¡Bienvenido a </span>
                                <span className="text-primary">Condominium</span>
                                <span>!</span>
                            </h1>

                            <h2>Gestiona tus responsabilidades residenciales</h2>
                        </header>

                        <FormProvider {...formMethods}>
                            <form onSubmit={formMethods.handleSubmit(handleSignIn)} className="flex flex-col gap-4 max-w-xs">
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

                                <button type="submit" className="btn-primary rounded-md py-2">Iniciar sesión</button>
                            </form>
                        </FormProvider>
                    </div>
                </section>

                <div className="bg-black hidden lg:block">

                </div>
            </section>
        </PageContainer>
    )
}