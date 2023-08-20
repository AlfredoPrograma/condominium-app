import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { TextField } from "~/components/common/forms/TextField"

const registerOwnerSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido " }),
    password: z.string()
        .min(4, { message: "La contraseña debe tener al menos 4 caracteres" })
})

type RegisterOwnerSchema = z.infer<typeof registerOwnerSchema>

export function RegisterOwnerForm() {
    const formMethods = useForm<RegisterOwnerSchema>({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(registerOwnerSchema)
    })

    const handleRegisterOwner = (data: RegisterOwnerSchema) => {
        console.log(data)
    }

    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-6" onSubmit={formMethods.handleSubmit(handleRegisterOwner)}>
                <div>
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Correo electrónico"
                        placeholder="prueba@correo.com"
                    />

                    <TextField
                        id="password"
                        name="password"
                        type="password"
                        label="Contraseña"
                        placeholder="******"
                    />
                </div>

                <footer className="flex justify-end">
                    <button type="submit" className="btn btn-primary">Crear</button>
                </footer>
            </form>
        </FormProvider>
    )
}