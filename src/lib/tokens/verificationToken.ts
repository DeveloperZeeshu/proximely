import crypto from 'crypto'

export const createEmailVerifyToken = () => {
    return crypto.randomBytes(32).toString('hex')
}

