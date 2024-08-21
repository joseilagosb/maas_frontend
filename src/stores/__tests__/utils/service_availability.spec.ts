import { describe, expect, it } from 'vitest'

import { getAvailabilityData } from '@/stores/utils/service_availability'

import { testData, testState, testTime } from '@/test/data'
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
  const { userHoursAssignments, selectedWeekData } = testState.editServiceStore

  describe('getAvailabilityData', () => {
    describe('parameters', () => {
      it('throws an error if service week data is undefined', () => {
        expect(() => getAvailabilityData(testTime.week, undefined, userHoursAssignments)).toThrow()
      })

      it('throws an error if an empty user hours assignments array is passed', () => {
        expect(() => getAvailabilityData(testTime.week, selectedWeekData, [])).toThrow()
      })

      it('throws an error if service week data without days is passed', () => {
        const weekDataWithoutDays = {
          ...selectedWeekData,
          serviceDays: []
        }
        expect(() =>
          getAvailabilityData(testTime.week, weekDataWithoutDays, userHoursAssignments)
        ).toThrow()
      })

      it('throws an error if service week data with a day without hours is passed', () => {
        const weekDataWithDayWithoutHours = {
          ...selectedWeekData,
          serviceDays: [{ ...selectedWeekData.serviceDays[0], serviceHours: [] }]
        }
        expect(() =>
          getAvailabilityData(testTime.week, weekDataWithDayWithoutHours, userHoursAssignments)
        ).toThrow()
      })
    })

    const availabilityData = getAvailabilityData(
      testTime.week,
      selectedWeekData,
      userHoursAssignments
    )
    const expectedAvailabilityData = testData.serviceAvailability

    describe('week', () => {
      it('contains the correct data', () => {
        expect(availabilityData.week).toEqual(expectedAvailabilityData.week)
      })

      it('has the correct amount of days', () => {
        expect(availabilityData.serviceDays.length).toEqual(
          expectedAvailabilityData.serviceDays.length
        )
      })
    })

    describe('day', () => {
      const expectedServiceDays = expectedAvailabilityData.serviceDays

      it('contains the correct data', () => {
        expectedServiceDays.forEach((expectedServiceDay, dayIndex) => {
          expect(availabilityData.serviceDays[dayIndex].day).toEqual(expectedServiceDay.day)
        })
      })

      it('has the correct amount of hours', () => {
        expectedServiceDays.forEach((expectedServiceDay, dayIndex) => {
          expect(availabilityData.serviceDays[dayIndex].serviceHours.length).toEqual(
            expectedServiceDay.serviceHours.length
          )
        })
      })
    })

    describe('hour', () => {
      it('contains the correct data', () => {
        forEveryAvailabilityHour(availabilityData, expectedAvailabilityData, (result, expected) =>
          expect(result.hour).toEqual(expected.hour)
        )
      })

      it('has the correct amount of available users', () => {
        forEveryAvailabilityHour(availabilityData, expectedAvailabilityData, (result, expected) => {
          expect(Object.keys(result.available).length).toEqual(userHoursAssignments.length)
          expect(Object.keys(result.available).length).toBe(Object.keys(expected.available).length)
        })
      })

      it('assigned the available users correctly', () => {
        forEveryAvailabilityHour(availabilityData, expectedAvailabilityData, (result, expected) =>
          expect(result.available).toEqual(expected.available)
        )
      })
    })
  })
})
