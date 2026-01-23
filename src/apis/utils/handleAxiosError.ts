import { isAxiosError } from "axios"
import toast from "react-hot-toast"

interface ErrorResponse {
    message?: string
}

export const handleAxiosError = (err: unknown) => {
    if(isAxiosError(err)){
        if(err.response) {
            const data = err.response.data as ErrorResponse
            // console.error('Server Error:',err)
            toast.error(data.message || 'Server error occurred')
            return 
        }

        if(err.request){
            // console.error('Network Error:',err.request)
            toast.error('Network error - no response from server')
            return
        }

        // console.error('Axios Error:',err.message)
        toast.error(err.message)
        return
    }

    // console.error('Unknown Error:',err)
    toast.error('Unexpected error occurred')
}

