/**
 * 전화번호 문자열을 하이픈(-) 포함 형식으로 변환
 * - 최대 11자리까지만 입력 허용
 * - 예: "0101" → "010-1"
 *       "0101234" → "010-1234"
 *       "01012345678" → "010-1234-5678"
 *       "0212345678"  → "02-1234-5678"
 */
export function formatPhoneNumber(value: string): string {
  // 숫자만 추출
  const digits = value.replace(/\D/g, '').substring(0, 11);

  if (digits.startsWith('02')) {
    // 서울 지역번호 (02)
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return digits.replace(/(\d{2})(\d{0,4})/, '$1-$2');
    return digits.replace(/(\d{2})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
  } else {
    // 휴대폰/기타 지역번호
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return digits.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    return digits.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
  }
}
