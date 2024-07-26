import { testTime } from '@/test/data'
import type dayjs from 'dayjs'

export const mockDateService = {
  getWeek: () => testTime.week,
  getYear: () => testTime.year,
  applyDatePlugins: (_: any) => {},
  addToDate: (_: any, date: typeof dayjs, __: number) => date,
  substractToDate: (_: any, date: typeof dayjs, __: number) => date,
  formatDateInSpanish: (_: any) => testTime.date.inSpanish,
  firstDayOfWeek: () => testTime.startOfWeek,
  lastDayOfWeek: () => testTime.endOfWeek,
  nthDayOfWeek: (_: dayjs.Dayjs, day: number) => testTime.startOfWeek,
  formatDate: (_: any, __: any) => '12/07/2024'
}
