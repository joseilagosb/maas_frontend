import { describe, expect, it } from 'vitest'

import { getAvailabilityData } from '@/stores/utils/service_availability'

import { testState, testTime } from '@/test/data'
import type { Availability, AvailabilityHour } from '@/types/models'

const forEveryAvailabilityHour = (
  result: Availability,
  expected: Availability,
  action: (result: AvailabilityHour, expected: AvailabilityHour) => void
) => {
  expected.serviceDays.forEach((expectedDay, dayIndex) => {
    expectedDay.serviceHours.forEach((expectedHour, hourIndex) => {
      const resultHour = result.serviceDays[dayIndex].serviceHours[hourIndex]
      action(resultHour, expectedHour)
    })
  })
}

describe('Service Availability Utils', () => {
  const { users, selectedWeekData } = testState.editServiceStore

  describe('getAvailabilityData', () => {
    describe('parameters', () => {
      it('throws an error if an empty users array is passed', () => {
        expect(() => getAvailabilityData(testTime.week, selectedWeekData, [])).toThrow()
      })

      it('throws an error if service week data without days is passed', () => {
        const weekDataWithoutDays = {
          ...selectedWeekData,
          serviceDays: []
        }
        expect(() => getAvailabilityData(testTime.week, weekDataWithoutDays, users)).toThrow()
      })

      it('throws an error if service week data with a day without hours is passed', () => {
        const weekDataWithDayWithoutHours = {
          ...selectedWeekData,
          serviceDays: [{ ...selectedWeekData.serviceDays[0], serviceHours: [] }]
        }
        expect(() =>
          getAvailabilityData(testTime.week, weekDataWithDayWithoutHours, users)
        ).toThrow()
      })
    })

    const currentAvailability = getAvailabilityData(testTime.week, selectedWeekData, users)
    const { currentAvailability: expectedCurrentAvailability } = testState.serviceAvailabilityStore

    describe('week', () => {
      it('contains the correct data', () => {
        expect(currentAvailability.week).toEqual(expectedCurrentAvailability.week)
      })

      it('has the correct amount of days', () => {
        expect(currentAvailability.serviceDays.length).toEqual(
          expectedCurrentAvailability.serviceDays.length
        )
      })
    })

    describe('day', () => {
      const expectedServiceDays = expectedCurrentAvailability.serviceDays

      it('contains the correct data', () => {
        expectedServiceDays.forEach((expectedServiceDay, dayIndex) => {
          expect(currentAvailability.serviceDays[dayIndex].day).toEqual(expectedServiceDay.day)
        })
      })

      it('has the correct amount of hours', () => {
        expectedServiceDays.forEach((expectedServiceDay, dayIndex) => {
          expect(currentAvailability.serviceDays[dayIndex].serviceHours.length).toEqual(
            expectedServiceDay.serviceHours.length
          )
        })
      })
    })

    describe('hour', () => {
      it('contains the correct data', () => {
        forEveryAvailabilityHour(
          currentAvailability,
          expectedCurrentAvailability,
          (result, expected) => expect(result.hour).toEqual(expected.hour)
        )
      })

      it('has the correct amount of available users', () => {
        forEveryAvailabilityHour(
          currentAvailability,
          expectedCurrentAvailability,
          (result, expected) => {
            expect(result.available.length).toEqual(users.length)
            expect(result.available.length).toEqual(expected.available.length)
          }
        )
      })

      it('assigned the available users correctly', () => {
        forEveryAvailabilityHour(
          currentAvailability,
          expectedCurrentAvailability,
          (result, expected) => expect(result.available).toEqual(expected.available)
        )
      })
    })
  })
})
