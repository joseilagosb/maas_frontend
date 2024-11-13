import { defineStore } from 'pinia'
import { useServiceStore } from './service'

import { putAvailability } from '@/services/api'

import { getAvailabilityData, updateAvailabilityChanges } from './utils/service_availability'

import type { ServiceAvailabilityState } from '@/types/stores'
import { useAuthStore } from './auth'

export const useServiceAvailabilityStore = defineStore('service_availability', {
  state: (): ServiceAvailabilityState => ({
    availabilityData: undefined,
    changedAvailability: false,
    availabilityChanges: {}
  }),
  actions: {
    generateAvailability() {
      const serviceStore = useServiceStore()
      try {
        const availabilityData = getAvailabilityData(
          serviceStore.selectedWeek,
          serviceStore.selectedWeekData,
          serviceStore.userHoursAssignments
        )
        this.availabilityData = availabilityData
      } catch (error) {
        throw error
      }
    },
    updateAvailabilityChanges(day: number, hour: number, marked: boolean) {
      try {
        const newAvailabilityChanges = updateAvailabilityChanges(
          this.availabilityChanges,
          day,
          hour,
          marked
        )
        this.availabilityChanges = newAvailabilityChanges
      } catch (error) {
        throw error
      }
    },
    async submitAvailability() {
      const authStore = useAuthStore()
      const serviceStore = useServiceStore()
      try {
        await putAvailability(
          serviceStore.selectedServiceId,
          serviceStore.selectedWeek,
          this.availabilityData!,
          this.availabilityChanges,
          authStore.user
        )
      } catch (error) {
        throw error
      }
    }
  }
})
