import type {
  CurrentAvailability,
  ServiceDay,
  ServiceHour,
  ServiceWeek,
  User
} from '@/types/models'

export const getCurrentAvailability = (
  selectedWeek: number,
  selectedWeekData: ServiceWeek,
  users: User[]
) => {
  const currentAvailability: CurrentAvailability = {
    week: selectedWeek,
    days: selectedWeekData.serviceDays.map((serviceDay: ServiceDay) => {
      const serviceDayHours = serviceDay.serviceHours.map((serviceHour: ServiceHour) => {
        const availableArr = users.map((user: User) => {
          if (serviceHour.users?.some((availableUser: User) => availableUser.id === user.id)) {
            return true
          }
          return false
        })

        return {
          hour: serviceHour.hour,
          available: availableArr
        }
      })

      return {
        day: serviceDay.day,
        hours: serviceDayHours
      }
    })
  }

  return currentAvailability
}

export const getEmptyCurrentAvailability = (
  selectedWeek: number,
  selectedWeekData: ServiceWeek,
  users: User[]
) => {
  const currentAvailability: CurrentAvailability = {
    week: selectedWeek,
    days: selectedWeekData.serviceDays.map((serviceDay: ServiceDay) => {
      const serviceDayHours = serviceDay.serviceHours.map((serviceHour: ServiceHour) => {
        const availableArr = Array(users.length).fill(false)
        return {
          hour: serviceHour.hour,
          available: availableArr
        }
      })
      return {
        day: serviceDay.day,
        hours: serviceDayHours
      }
    })
  }

  return currentAvailability
}
