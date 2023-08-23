import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { TextField } from "~/components/common/forms/TextField"
import { Modal, ModalProps } from "~/components/common/modals/Modal"
import { api } from "~/utils/api"
import { ErrorMessages } from "~/utils/errors/errorMessages"
import { Owner } from "../tables/OwnersTable"

export const registerOwnerSchema = z.object({
    firstName: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
    lastName: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
    age: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
    // TODO: identifier code should have a pattern
    identifierCode: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
    // TODO: identifier code should have a pattern
    phoneNumber: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED }),
    email: z.string().email({ message: ErrorMessages.INVALID_EMAIL }),
    propertyCode: z.string().nonempty({ message: ErrorMessages.FIELD_REQUIRED })
})
    .refine(({ age }) => Number(age) >= 18, { message: ErrorMessages.NOT_ADULT, path: ['age'] })

export type RegisterOwnerSchema = z.infer<typeof registerOwnerSchema>

interface RegisterOwnerFormProps extends ModalProps {
    owner: Owner | null
}

export function RegisterOwnerForm({ id, title, owner, onClose }: RegisterOwnerFormProps) {
    const trpcUtils = api.useContext()
    const [isOpen, setIsOpen] = useState(false)

    const formMethods = useForm<RegisterOwnerSchema>({
        resolver: zodResolver(registerOwnerSchema)
    })

    const { mutate: mutateRegisterOwner, isLoading } = api.owners.create.useMutation({
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
        onClose?.()
    }

    const handlePreloadOwner = (data: Owner | null) => {
        if (data) {
            const { userId, ...rest } = data
            const preload: RegisterOwnerSchema = {
                ...rest,
                propertyCode: rest.properties[0]!.code,
                age: rest.age.toString()
            }

            Object.entries(preload).forEach(([field, value]) => {
                formMethods.setValue(field as keyof RegisterOwnerSchema, value)
            })
        }
    }

    return (
        <Modal id={id} title={title} onClose={handleReset} onOpen={() => handlePreloadOwner(owner)} isOpen={isOpen} setIsOpen={setIsOpen} width="max-w-2xl">
            <FormProvider {...formMethods}>
                <form noValidate className="flex flex-col gap-6" onSubmit={formMethods.handleSubmit(handleRegisterOwner)}>
                    <div>
                        <div className="flex gap-4">
                            <TextField
                                id="firstName"
                                name="firstName"
                                type="text"
                                label="Nombre"
                                placeholder="John"
                            />

                            <TextField
                                id="lastName"
                                name="lastName"
                                type="text"
                                label="Apellido"
                                placeholder="Doe"
                            />

                            <TextField
                                id="age"
                                name="age"
                                type="number"
                                label="Edad"
                                placeholder="18"
                            />
                        </div>

                        <div className="flex gap-4">
                            <TextField
                                id="identifierCode"
                                name="identifierCode"
                                type="text"
                                label="Cédula de identidad"
                                placeholder="V-5.555.555"
                            />

                            <TextField
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                label="Número telefónico"
                                placeholder="426-555-555"
                            />
                        </div>

                        <div className="grid grid-cols-[5fr_2fr] gap-4">
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                label="Correo electrónico"
                                placeholder="prueba@correo.com"
                            />

                            <TextField
                                id="propertyCode"
                                name="propertyCode"
                                type="text"
                                label="Código de propiedad"
                                placeholder="AT-1"
                            />
                        </div>
                    </div>

                    <footer className="flex justify-end">
                        {isLoading ?
                            <button className="btn btn-primary">
                                <span className="loading loading-spinner"></span>
                                Creando
                            </button>
                            :
                            <button type="submit" className="btn btn-primary">Crear</button>
                        }
                    </footer>
                </form>
            </FormProvider>
        </Modal>
    )
}