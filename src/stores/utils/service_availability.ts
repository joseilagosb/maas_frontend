import type {
  Availability,
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
          availableArr = userHoursAssignments.map((user: UserHoursAssignment) =>
            serviceHour.users!.some((availableUser: User) => availableUser.id === user.id)
          )
        } else {
          availableArr = Array(userHoursAssignments.length).fill(false)
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
