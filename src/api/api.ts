import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// 응답 인터셉터
api.interceptors.response.use(
    undefined, // 성공은 그대로
    (error) => {
        if (axios.isAxiosError(error)) {
            // 에러 메세지 래핑
            const msg =
                error.response?.data?.message ||
                error.message ||
                "요청 처리 중 오류가 발생했습니다.";
            return Promise.reject(new Error(msg));
        }
        return Promise.reject(error);
    }
);

export function isAxiosError<T = unknown>(err: unknown): err is AxiosError<T> {
    return axios.isAxiosError(err);
}

export default api;
