import { defineStore } from 'pinia'
import { useServiceStore } from './service'

import { getCurrentAvailability, getEmptyCurrentAvailability } from './utils/service_availability'

import type { ServiceAvailabilityState } from '@/types/stores'
import type { CurrentAvailability } from '@/types/models'

export const useServiceAvailabilityStore = defineStore('service_availability', {
  state: (): ServiceAvailabilityState => ({
    currentAvailability: undefined,
    changedAvailability: false
  }),
  actions: {
    generateCurrentAvailability() {
      const serviceStore = useServiceStore()

      const currentAvailability: CurrentAvailability = getCurrentAvailability(
        serviceStore.selectedWeek,
        serviceStore.selectedWeekData!,
        serviceStore.users
      )

      this.currentAvailability = currentAvailability
    },
    generateEmptyCurrentAvailability() {
      const serviceStore = useServiceStore()

      const currentAvailability = getEmptyCurrentAvailability(
        serviceStore.selectedWeek,
        serviceStore.selectedWeekData!,
        serviceStore.users
      )

      this.currentAvailability = currentAvailability
    }
  }
})
