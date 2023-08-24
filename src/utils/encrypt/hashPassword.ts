import * as bcrypt from "bcrypt"

export async function hashPassword(plain: string) {
    return await bcrypt.hash(plain, 12)
}

export async function isValidPassword(plain: string, hash: string) {
    try {
        return await bcrypt.compare(plain, hash)
    } catch(err) {
        console.error(err)
    }
}