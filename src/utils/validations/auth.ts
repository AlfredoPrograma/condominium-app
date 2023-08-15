import { z } from "zod"

export const signInSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z
        .string()
        .min(4, { message: "La contraseña debe tener al menos 4 caracteres"})
        .max(12, { message: "La contraseña debe tener como máximo 12 caracteres"})
})


// Sign up will collect more data later
// Currently just collects same as login schema
export const signUpSchema = signInSchema.extend({})

export type SignInSchema = z.infer<typeof signInSchema>
export type SignUpSchema = z.infer<typeof signUpSchema>


