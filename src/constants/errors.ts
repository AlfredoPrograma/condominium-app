export const errors = {
    "CredentialsSignin": "Credenciales inválidas",
    "Unknown": "Oops! Algo ha salido mal. Intente más tarde"
} as const

export type ErrorCodes = keyof typeof errors