import { format, utcToZonedTime } from 'date-fns-tz';

export function formatInTimeZone(date: string | Date | number, fmt: string, tz: string) {
  return format(utcToZonedTime(date, tz), fmt, { timeZone: tz });
}
