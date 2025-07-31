import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('YY년 MM월 DD일(ddd) A h:mm');
};
