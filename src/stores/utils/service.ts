import type { ServiceDay, ServiceHour, ServiceWeek, ServiceWorkingDay } from '@/types/models'

import { getArrayFromInterval } from '@/utils/common'

export const getEmptyServiceWeekData = (serviceWorkingDays: ServiceWorkingDay[]) => {
  const serviceWeekData: ServiceWeek = {
    id: 0,
    week: 0,
    serviceDays: serviceWorkingDays.map((serviceWorkingDay: ServiceWorkingDay) => {
      const hoursArray = getArrayFromInterval(serviceWorkingDay.from, serviceWorkingDay.to)
      const serviceDay: ServiceDay = {
        id: 0,
        day: serviceWorkingDay.day,
        serviceHours: hoursArray.map((hour: number) => {
          const serviceHour: ServiceHour = {
            id: 0,
            hour,
            designatedUser: undefined
          }
          return serviceHour
        })
      }

      return serviceDay
    })
  }

  return serviceWeekData
}
