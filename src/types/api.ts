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
