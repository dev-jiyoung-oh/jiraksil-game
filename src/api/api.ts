import axios from "axios";
import { ApiError, ERROR_CODE, type ApiErrorResponse } from "@/types/api";

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
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const status = error.response?.status;
            const code = error.response?.data?.code;

            const isSessionCheck = error.config?.url === "/users/me";
            const isPasswordMismatch = code === ERROR_CODE.PASSWORD_MISMATCH;

            // 401: 세션 없음/만료(code: "UNAUTHORIZED") → 로그아웃 처리
            // 예외 1) /users/me → 세션 확인 용도, navigate 없이 AuthProvider가 직접 처리
            // 예외 2) code가 "PASSWORD_MISMATCH" → 로그인 실패, 비밀번호 재확인,
            //         게임/문의 비밀번호 검증 등 세션과 무관한 401이므로 제외
            if (status === 401 && !isSessionCheck && !isPasswordMismatch) {
                unauthorizedHandler?.();
            }

            // 403: 권한 없음 → 로그인 여부와 무관하므로 강제 로그아웃 하지 않음

            const msg =
                error.response?.data?.message ||
                error.message ||
                "요청 처리 중 오류가 발생했습니다.";
            return Promise.reject(new ApiError(msg, { status, code }));
        }
        return Promise.reject(error);
    }
);

export default api;
