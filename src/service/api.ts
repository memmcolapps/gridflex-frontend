import { env } from "@/env";
import axios from "axios";

const api = axios.create({
    baseURL: env.NEXT_PUBLIC_BASE_URL
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error?.response?.data?.message === 'Authorization token expired' || error?.response?.status === 401){
            window.dispatchEvent(new Event('auth-token-expired'))
        }

        return Promise.reject(error)
    }
)

export default api;