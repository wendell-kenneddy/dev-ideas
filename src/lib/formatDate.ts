import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function formatDate(date: number | Date) {
  return format(date, 'dd MMM yyy', {
    locale: enUS
  });
}
