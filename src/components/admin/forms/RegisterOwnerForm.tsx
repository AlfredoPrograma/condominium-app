import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { TextField } from "~/components/common/forms/TextField"
import { api } from "~/utils/api"

export const registerOwnerSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido " }),
    password: z.string()
        .min(4, { message: "La contraseña debe tener al menos 4 caracteres" })
})

export type RegisterOwnerSchema = z.infer<typeof registerOwnerSchema>

export function RegisterOwnerForm() {
    const trpcUtils = api.useContext()

    const { mutate: mutateRegisterOwner } = api.owners.create.useMutation({
        onSuccess: () => {
            trpcUtils.invalidate(undefined, { queryKey: ['owners.getAll'] })
            toast("Propietario creado exitosamente", { type: 'success' })
        },
        onError: () => {
            toast("Hubo un error durante la creación del propietario", { type: 'error' })
        }
    })

    const formMethods = useForm<RegisterOwnerSchema>({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(registerOwnerSchema)
    })

    const handleRegisterOwner = (data: RegisterOwnerSchema) => {
        mutateRegisterOwner(data)
    }

    return (
        <FormProvider {...formMethods}>
            <form noValidate className="flex flex-col gap-6" onSubmit={formMethods.handleSubmit(handleRegisterOwner)}>
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