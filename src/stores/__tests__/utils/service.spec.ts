import { describe, expect, it } from 'vitest'

import { getEmptyServiceWeekData } from '@/stores/utils/service'

import { testData, testState, testTime } from '@/test/data'
import type { ServiceHour, ServiceWeek } from '@/types/models'

const forEveryServiceWeekHour = (
  result: ServiceWeek,
  expected: ServiceWeek,
  action: (result: ServiceHour, expected: ServiceHour) => void
) => {
  expected.serviceDays.forEach((expectedServiceDay, dayIndex) => {
    expectedServiceDay.serviceHours.forEach((expectedServiceHour, hourIndex) => {
      const resultServiceHour = result.serviceDays[dayIndex].serviceHours[hourIndex]
      action(resultServiceHour, expectedServiceHour)
    })
  })
}

describe('Service Utils', () => {
  describe('getEmptyServiceWeekData', () => {
    const { serviceWorkingDays } = testState.showServiceStore.service

    describe('parameters', () => {
      it('throws an error if service is undefined', () => {
        expect(() => getEmptyServiceWeekData(undefined, testTime.week)).toThrow()
      })
    })

    const serviceWeekData = getEmptyServiceWeekData(testState.serviceStore.service, testTime.week)
    const expectedServiceWeekData = testData.emptyServiceWeekData

    const { serviceDays: serviceDays } = serviceWeekData

    describe('week', () => {
      it('contains the correct week', () => {
        expect(serviceWeekData.week).toEqual(testTime.week)
      })

      it('has the correct amount of days', () => {
        expect(serviceDays.length).toEqual(serviceWorkingDays.length)
        expect(serviceDays.length).toEqual(expectedServiceWeekData.serviceDays.length)
      })
    })

    describe('day', () => {
      it('contains the correct day', () => {
        serviceDays.forEach((serviceDay, dayIndex) => {
          expect(serviceDay.day).toEqual(expectedServiceWeekData.serviceDays[dayIndex].day)
        })
      })

      it('has the correct amount of hours', () => {
        serviceDays.forEach((serviceDay, dayIndex) => {
          expect(serviceDay.serviceHours.length).toEqual(
            expectedServiceWeekData.serviceDays[dayIndex].serviceHours.length
          )
        })
      })
    })

    describe('hour', () => {
      it('contains the correct data', () => {
        forEveryServiceWeekHour(serviceWeekData, expectedServiceWeekData, (result, expected) =>
          expect(result.hour).toEqual(expected.hour)
        )
      })

      it('does not designate a user', () => {
        forEveryServiceWeekHour(serviceWeekData, expectedServiceWeekData, (result, expected) => {
          expect(result.designatedUser).toEqual(expected.designatedUser)
          expect(result.designatedUser).toBeUndefined()
        })
      })
    })
  })
})
