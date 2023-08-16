import * as bcrypt from 'bcrypt'

export async function hashPassword(plain: string) {
    try {
        return await bcrypt.hash(plain, 12)

    } catch(err) {
        console.error(err)
    }
}

export async function validatePassword(plain: string, hash: string) {
    try {
        return await bcrypt.compare(plain, hash)
    } catch(err) {
        console.error(err)
    }
}