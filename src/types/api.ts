/**
 * 백엔드 공통 에러 응답 바디 형태.
 * code로 세션 만료(UNAUTHORIZED)와 비밀번호 불일치(PASSWORD_MISMATCH) 등을 구분한다.
 */
export interface ApiErrorResponse {
  code?: string;
  message?: string;
}

export const ERROR_CODE = {
  UNAUTHORIZED: "UNAUTHORIZED",
  PASSWORD_MISMATCH: "PASSWORD_MISMATCH",
} as const;

/**
 * api.ts 인터셉터가 모든 요청 실패에 대해 던지는 공통 에러.
 * 호출부는 axios를 몰라도 status/code만으로 응답을 판단할 수 있다.
 */
export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
  }
}
