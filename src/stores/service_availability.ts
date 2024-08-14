import { defineStore } from 'pinia'
import { useServiceStore } from './service'

import { putAvailability } from '@/services/api'

import { getAvailabilityData } from './utils/service_availability'

import type { ServiceAvailabilityState } from '@/types/stores'

export const useServiceAvailabilityStore = defineStore('service_availability', {
  state: (): ServiceAvailabilityState => ({
    availabilityData: undefined,
    changedAvailability: false
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
    async submitAvailability() {
      const serviceStore = useServiceStore()
      try {
        await putAvailability(
          serviceStore.selectedServiceId,
          serviceStore.selectedWeek,
          this.availabilityData!
        )
      } catch (error) {
        throw error
      }
    }
  }
})
