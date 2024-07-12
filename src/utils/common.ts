import dayjs from 'dayjs'

export const getArrayFromInterval = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, k) => k + start)
}

export const dayOfMonth = (day: dayjs.Dayjs): number => {
  return +day.format('D')
}
