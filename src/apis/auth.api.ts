import apiClient from "./utils/apiClient"

export const loginUser = async (payload: {
    email: string
    password: string
}) => {
    const res = await apiClient.post('/auth/login', payload)
    return res.data
}

export const logoutUser = async (

) => {
    const res = await apiClient.post('/auth/logout', {})
    return res.data
}

export const registerUser = async (payload: {
    email: string
    password: string
}) => {
    const res = await apiClient.post('/auth/register', payload)
    return res.data
}

export const authorizeUser = async () => {
    const res = await apiClient.get('/auth/me')
    return res.data
}

export const sendEmailVerification = async () => {
    const res = await apiClient.post('/auth/verify-email/resend', {})
    return res.data
}

export const verifyEmail = async (token: string) => {
    const res = await apiClient.post('/auth/verify-email', { token })
    return res.data
}
