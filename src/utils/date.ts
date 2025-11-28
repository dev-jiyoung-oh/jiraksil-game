import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

/**
 * 날짜를 다양한 포맷으로 변환하는 유틸
 * 
 * @param date - 날짜 문자열 또는 Date 객체
 * @param format - dayjs 포맷 문자열 (기본: 화면 표시용)
 * @returns 포맷팅된 문자열
 */
export const formatDateTime = (date: string | Date, format = 'YY년 MM월 DD일(ddd) A h:mm') => {
  return dayjs(date).format(format);
};

/**
 * 서버 LocalDateTime 저장용(KST 유지)
 * 예: 2025-11-27T18:48:26
 */
export const toLocalDateTimeString = (date: string | Date) => {
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
};
