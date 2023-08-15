import { signIn } from "next-auth/react"
import { ChangeEvent, FormEvent, useState } from "react"
import { PageContainer } from "~/components/common/layouts/PageContainer"

export default function SignIn() {
    const [signInForm, setSignInForm] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const res = await signIn("credentials", {
                callbackUrl: "/",
                email: signInForm.email,
                password: signInForm.password
            })

            console.log(res)
        } catch (err) {
            console.error(err)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setSignInForm({ ...signInForm, [name]: value })
    }

    return (
        <PageContainer title="Sign in">
            <section className="min-h-screen grid md:grid-cols-[1fr_2fr]">
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
                        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 max-w-xs">
                            <div className="form-control w-full max-w-xs">
                                <label htmlFor="email" className="label">
                                    <span className="label-text font-semibold">Correo electrónico</span>
                                </label>
                                <input onChange={handleChange} value={signInForm.email} type="text" name="email" id="email" className="input input-bordered w-full max-w-xs" placeholder="usuario@mail.com" />
                            </div>

                            <div className="form-control w-full max-w xs">
                                <label htmlFor="password" className="label">
                                    <span className="label-text font-semibold">Contraseña</span>
                                </label>
                                <input onChange={handleChange} value={signInForm.password} type="password" name="password" id="password" className="input input-bordered w-full max-w-xs" placeholder="******" />
                            </div>

                            <button type="submit" className="btn-primary rounded-md py-2">Iniciar sesión</button>
                        </form>
                    </div>
                </section>

                <div className="bg-black hidden md:block">

                </div>
            </section>
        </PageContainer>
    )
}