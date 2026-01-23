
interface ConfigType {
    httpOnly: boolean
    secure: boolean
    sameSite: 'lax' | 'none'
}

export const cookieConfig: ConfigType = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
}

