import type {
  Availability,
  AvailabilityChanges,
  ServiceDay,
  ServiceHour,
  ServiceWeek,
  User,
  UserHoursAssignment
} from '@/types/models'

export const getAvailabilityData = (
  selectedWeek: number,
  selectedWeekData: ServiceWeek | undefined,
  userHoursAssignments: UserHoursAssignment[]
): Availability => {
  if (!selectedWeekData) {
    throw new Error('No service week data found, the availability cannot be calculated')
  }

  if (userHoursAssignments.length === 0) {
    throw new Error('No users were passed, the availability cannot be calculated')
  }

  if (selectedWeekData.serviceDays.length === 0) {
    throw new Error('No service days found, the availability cannot be calculated')
  }

  return {
    week: selectedWeek,
    serviceDays: selectedWeekData.serviceDays.map((serviceDay: ServiceDay) => {
      if (serviceDay.serviceHours.length === 0) {
        throw new Error('Service day has no service hours, the availability cannot be calculated')
      }
      const serviceDayHours = serviceDay.serviceHours.map((serviceHour: ServiceHour) => {
        let availableArr
        if (serviceHour.users) {
          availableArr = userHoursAssignments.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.id]: serviceHour.users!.some(
                (availableUser: User) => availableUser.id === curr.id
              )
            }),
            {}
          )
        } else {
          availableArr = userHoursAssignments.reduce(
            (acc, curr) => ({ ...acc, [curr.id]: false }),
            {}
          )
        }

        return {
          hour: serviceHour.hour,
          available: availableArr
        }
      })

      return {
        day: serviceDay.day,
        serviceHours: serviceDayHours
      }
    })
  }
}

export const updateAvailabilityChanges = (
  availabilityChanges: AvailabilityChanges,
  day: number,
  hour: number,
  marked: boolean
) => {
  const resultAvailabilityChanges = JSON.parse(JSON.stringify(availabilityChanges))

  if (!resultAvailabilityChanges[day]) {
    resultAvailabilityChanges[day] = {}
  }

  if (resultAvailabilityChanges[day][hour]) {
    delete resultAvailabilityChanges[day][hour]
  } else {
    resultAvailabilityChanges[day][hour] = { marked: marked }
  }

  if (Object.keys(resultAvailabilityChanges[day]).length === 0) {
    delete resultAvailabilityChanges[day]
  }

  return resultAvailabilityChanges
}
