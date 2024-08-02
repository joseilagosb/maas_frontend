import type {
  Service,
  ServiceDay,
  ServiceHour,
  ServiceWeek,
  ServiceWorkingDay
} from '@/types/models'

import { getArrayFromInterval } from '@/utils/common'

export const getEmptyServiceWeekData = (
  service: Service | undefined,
  week: number
): ServiceWeek => {
  if (!service) {
    throw new Error('Service must not be empty, the service week cannot be generated')
  }

  const serviceWorkingDays = service.serviceWorkingDays

  if (serviceWorkingDays.length === 0) {
    throw new Error('ServiceWorkingDays must not be empty, the service week cannot be generated')
  }

  return {
    id: 0,
    week,
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
}
