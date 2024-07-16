import dayjs from 'dayjs'
import 'dayjs/locale/es'
import weekOfYear from 'dayjs/plugin/weekOfYear'

export const getWeek = () => dayjs().week()
export const getYear = () => dayjs().year()

export const applyDatePlugins = () => {
  dayjs.extend(weekOfYear)
  dayjs.locale('es')
}

export const firstDayOfWeek = (week: number) => {
  return dayjs().week(week).startOf('week').subtract(1, 'day')
}

export const lastDayOfWeek = (week: number) => {
  return dayjs().week(week).endOf('week').add(1, 'day')
}

export const formatDate = (date: dayjs.Dayjs, format: string) => {
  return dayjs(date).format(format)
}

export const addToDate = (type: 'day' | 'week' | 'month', date: dayjs.Dayjs, days: number) => {
  if (type === 'day') {
    return dayjs(date).add(days, 'day')
  }
  if (type === 'week') {
    return dayjs(date).add(days, 'week')
  }
  if (type === 'month') {
    return dayjs(date).add(days, 'month')
  }
  return date
}

export const formatDateInSpanish = (date: dayjs.Dayjs) => {
  return dayjs(date).locale('es').format('dddd D [de] MMMM')
}
