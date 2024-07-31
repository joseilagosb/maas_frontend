import { describe, expect, it } from 'vitest'

import { getEmptyServiceWeekData } from '@/stores/utils/service'

import { testState, testTime } from '@/test/data'
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
      it('throws an error if an empty service working days is passed', () => {
        expect(() => getEmptyServiceWeekData([], testTime.week)).toThrow()
      })
    })

    const resultServiceWeekData = getEmptyServiceWeekData(serviceWorkingDays, testTime.week)
    const expectedServiceWeekData = testState.emptyServiceWeekData

    const { serviceDays: resultServiceDays } = resultServiceWeekData

    describe('week', () => {
      it('contains the correct week', () => {
        expect(resultServiceWeekData.week).toEqual(testTime.week)
      })

      it('has the correct amount of days', () => {
        expect(resultServiceDays.length).toEqual(serviceWorkingDays.length)
        expect(resultServiceDays.length).toEqual(expectedServiceWeekData.serviceDays.length)
      })
    })

    describe('day', () => {
      it('contains the correct day', () => {
        resultServiceDays.forEach((resultServiceDay, dayIndex) => {
          expect(resultServiceDay.day).toEqual(expectedServiceWeekData.serviceDays[dayIndex].day)
        })
      })

      it('has the correct amount of hours', () => {
        resultServiceDays.forEach((resultServiceDay, dayIndex) => {
          expect(resultServiceDay.serviceHours.length).toEqual(
            expectedServiceWeekData.serviceDays[dayIndex].serviceHours.length
          )
        })
      })
    })

    describe('hour', () => {
      it('contains the correct data', () => {
        forEveryServiceWeekHour(
          resultServiceWeekData,
          expectedServiceWeekData,
          (result, expected) => expect(result.hour).toEqual(expected.hour)
        )
      })

      it('does not designate a user', () => {
        forEveryServiceWeekHour(
          resultServiceWeekData,
          expectedServiceWeekData,
          (result, expected) => {
            expect(result.designatedUser).toEqual(expected.designatedUser)
            expect(result.designatedUser).toBeUndefined()
          }
        )
      })
    })
  })
})
