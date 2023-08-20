import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { TextField } from "~/components/common/forms/TextField"
import { Modal, ModalProps } from "~/components/common/modals/Modal"
import { api } from "~/utils/api"

export const registerOwnerSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido " }),
    password: z.string()
        .min(4, { message: "La contraseña debe tener al menos 4 caracteres" })
})

export type RegisterOwnerSchema = z.infer<typeof registerOwnerSchema>

export function RegisterOwnerForm({ id, title }: ModalProps) {
    const trpcUtils = api.useContext()
    const [isOpen, setIsOpen] = useState(false)

    const formMethods = useForm<RegisterOwnerSchema>({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(registerOwnerSchema)
    })

    const { mutate: mutateRegisterOwner } = api.owners.create.useMutation({
        onSuccess: () => {
            trpcUtils.invalidate(undefined, { queryKey: ['owners.getAll'] })
            toast("Propietario creado exitosamente", { type: 'success' })
            setIsOpen(false)
        },
        onError: () => {
            toast("Hubo un error durante la creación del propietario", { type: 'error' })
        }
    })


    const handleRegisterOwner = (data: RegisterOwnerSchema) => {
        mutateRegisterOwner(data)
    }

    const handleReset = () => {
        formMethods.reset()
    }

    return (
        <Modal id={id} title={title} onClose={handleReset} isOpen={isOpen} setIsOpen={setIsOpen}>
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
        </Modal>
    )
}