import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from './auth'
import { useServiceStore } from './service'

import type { ServiceAvailabilityState } from '@/types/stores'
import type { CurrentAvailability, ServiceDay, ServiceHour, User } from '@/types/models'

export const useServiceAvailabilityStore = defineStore('service_availability', {
  state: (): ServiceAvailabilityState => ({
    currentAvailability: undefined
  }),
  actions: {
    generateCurrentAvailability() {
      const serviceStore = useServiceStore()

      // const currentAvailability: CurrentAvailability = {}

      // selectedWeekData!.serviceDays.map((serviceDay: ServiceDay) => {
      //   currentAvailability[serviceDay.day] = {}
      //   serviceDay.serviceHours.map((serviceHour: ServiceHour) => {
      //     currentAvailability[serviceDay.day][serviceHour.hour] = {
      //       available: serviceStore.users.map((user: User) => {
      //         if (serviceHour.users?.some((availableUser: User) => availableUser.id === user.id)) {
      //           return true
      //         }
      //         return false
      //       })
      //     }
      //   })
      // })

      const currentAvailability = {
        week: serviceStore.selectedWeek,
        days: serviceStore.selectedWeekData!.serviceDays.map((serviceDay: ServiceDay) => {
          const serviceDayHours = serviceDay.serviceHours.map((serviceHour: ServiceHour) => {
            const availableArr = serviceStore.users.map((user: User) => {
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

      this.currentAvailability = currentAvailability
    }
  }
})
