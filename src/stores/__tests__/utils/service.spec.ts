import { describe, expect, it } from 'vitest'

import { getEmptyServiceWeekData } from '@/stores/utils/service'
import { getArrayFromInterval } from '@/utils/common'

import type { ServiceWorkingDay } from '@/types/models'
import { testTime } from '@/test/data'

describe('Service Utils', () => {
  describe('getEmptyServiceWeekData', () => {
    const serviceWorkingDays: ServiceWorkingDay[] = [{ id: 1, day: 1, from: 10, to: 22 }]
    const emptyServiceWeekData = getEmptyServiceWeekData(serviceWorkingDays, testTime.week)

    it('contains the correct week', () => {
      expect(emptyServiceWeekData.week).toEqual(testTime.week)
    })

    it('contains the correct service days', () => {
      const serviceDays = emptyServiceWeekData.serviceDays
      expect(serviceDays.length).toEqual(serviceWorkingDays.length)
      serviceDays.forEach((serviceDay, dayIndex) => {
        expect(serviceDay.day).toEqual(serviceWorkingDays[dayIndex].day)
      })
    })

    describe('service hours', () => {
      const serviceDays = emptyServiceWeekData.serviceDays
      const hoursArray = getArrayFromInterval(serviceWorkingDays[0].from, serviceWorkingDays[0].to)

      it('contains the correct service hours', () => {
        serviceDays.forEach((serviceDay) => {
          const serviceHours = serviceDay.serviceHours
          expect(serviceHours.length).toEqual(hoursArray.length)
          serviceHours.forEach((serviceHour, hourIndex) => {
            expect(serviceHour.hour).toEqual(hoursArray[hourIndex])
          })
        })
      })

      it('does not designate a user', () => {
        serviceDays.forEach((serviceDay) => {
          const serviceHours = serviceDay.serviceHours
          serviceHours.forEach((serviceHour) => {
            expect(serviceHour.designatedUser).toBeUndefined()
          })
        })
      })
    })
  })
})
