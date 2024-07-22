import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

import { getService, getServiceWeek, getUsers } from '@/services/api'

import { firstDayOfWeek, getWeek, lastDayOfWeek } from '@/services/date'
import { getEmptyServiceWeekData } from './utils/service'

import type { ServiceState } from '@/types/stores'
import type { ServiceWeek } from '@/types/models'

const getDefaultServiceState = (): ServiceState => {
  const route = useRoute()
  const selectedWeek = route.params.week ? +route.params.week : getWeek()
  return {
    service: undefined,
    users: [],
    activeWeeks: [],
    selectedWeek,
    selectedWeekData: undefined
  }
}

export const useServiceStore = defineStore('service', {
  state: (): ServiceState => getDefaultServiceState(),
  getters: {
    from: (state: ServiceState) => firstDayOfWeek(state.selectedWeek),
    to: (state: ServiceState) => lastDayOfWeek(state.selectedWeek),
    weekContainsData: (state: ServiceState) => {
      return state.activeWeeks.includes(state.selectedWeek)
    }
  },
  actions: {
    async fetchService(id: number) {
      try {
        const service = await getService(id)
        this.service = {
          id: service.id,
          name: service.name,
          active: service.active,
          serviceWorkingDays: service.serviceWorkingDays
        }
        const activeWeeks = service.serviceWeeks.map((serviceWeek: any) => +serviceWeek.week)
        this.activeWeeks = activeWeeks
      } catch (error) {
        throw error
      }
    },
    async fetchUsers() {
      try {
        const users = await getUsers()
        this.users = users
      } catch (error) {
        throw error
      }
    },
    async fetchServiceWeek(id: number, week: number, mode: 'show' | 'edit' = 'show') {
      try {
        const selectedWeekData = await getServiceWeek(id, week, mode)
        this.selectedWeekData = selectedWeekData
      } catch (error) {
        throw error
      }
    },
    generateEmptyServiceWeek() {
      const serviceWorkingDays = this.service!.serviceWorkingDays
      const serviceWeekData: ServiceWeek = getEmptyServiceWeekData(serviceWorkingDays)

      this.selectedWeekData = serviceWeekData
    }
  }
})
