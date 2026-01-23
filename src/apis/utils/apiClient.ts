import axios from "axios";

const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

// Interceptor
let refreshPromise: Promise<void> | null = null

apiClient.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config
        if (!originalRequest || err.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(err)
        }
        originalRequest._retry = true

        try {
            if (!refreshPromise) {
                refreshPromise = axios.post('/api/auth/refresh', {}, { withCredentials: true })
                    .then(() => { })
                    .finally(() => { refreshPromise = null })
            }
            await refreshPromise
            return apiClient(originalRequest)
        } catch (refreshErr) {
            refreshPromise = null
            return Promise.reject(refreshErr)
        }
    }
)

export default apiClient
