import { hashSync } from 'bcrypt'

export const hashPasswordTransform = {
    to(password: string): string {
        return hashSync(password, 10) // If salt most than 16, you can be performance problens
    },
    from(hash: string): string {
        return hash
    }
}
