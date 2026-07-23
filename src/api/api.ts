import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
});

/**
 * 401 응답 시 호출할 콜백.
 * AuthProvider 마운트 시점에 registerUnauthorizedHandler()로 등록된다.
 */
let unauthorizedHandler: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void): void {
    unauthorizedHandler = handler;
}

// 응답 인터셉터
api.interceptors.response.use(
    undefined, // 성공은 그대로
    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            const isLoginPage = window.location.pathname === "/login";
            const isSessionCheck = error.config?.url === "/users/me";

            // 401: 토큰 없음 / 만료 → 로그아웃 처리
            // 예외 1) 로그인 페이지 → 잘못된 비밀번호 등이므로 제외
            // 예외 2) /users/me → 세션 확인 용도, navigate 없이 AuthProvider가 직접 처리
            if (status === 401 && !isLoginPage && !isSessionCheck) {
                unauthorizedHandler?.();
            }

            // 403: 권한 없음 → 로그인 여부와 무관하므로 강제 로그아웃 하지 않음

            // /users/me는 AuthProvider가 401 여부를 직접 판단해야 하므로 원본 에러 전파
            if (isSessionCheck) {
                return Promise.reject(error);
            }

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
