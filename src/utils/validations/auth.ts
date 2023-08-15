import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(12)
})


// Sign up will collect more data later
// Currently just collects same as login schema
export const signUpSchema = loginSchema.extend({})

export type LoginSchema = z.infer<typeof loginSchema>
export type SignUpSchema = z.infer<typeof signUpSchema>


