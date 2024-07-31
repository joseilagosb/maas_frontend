import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

import { getWeek, nthDayOfWeek } from '@/services/date'

import { getService, getServiceWeek, getUsers } from '@/services/api'
import { getEmptyServiceWeekData } from './utils/service'

import type { ServiceState } from '@/types/stores'
import type { Service, ServiceWeek } from '@/types/models'

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
    weekContainsData: (state: ServiceState) => {
      return state.activeWeeks.includes(state.selectedWeek)
    },
    dayOfServiceWeek() {
      return (day: 'first' | 'last') => {
        const selectedWeekDataAvailable = this.weekContainsData && this.selectedWeekData

        // Se busca primero en selectedWeekData, si no está disponible se busca en serviceWorkingDays
        // Esto se hace para los registros históricos ya que no siempre van a coincidir con los horarios actuales para
        // un servicio en particular
        const selectedDay = selectedWeekDataAvailable
          ? this.selectedWeekData!.serviceDays.at(day === 'first' ? 0 : -1)!.day
          : this.service!.serviceWorkingDays.at(day === 'first' ? 0 : -1)!.day
        const dayDate = nthDayOfWeek(this.selectedWeek, selectedDay)
        return dayDate
      }
    }
  },
  actions: {
    async fetchService(id: number) {
      try {
        const service = await getService(id)
        this.service = {
          id: service.id,
          type: service.type,
          name: service.name,
          active: service.active,
          serviceWorkingDays: service.serviceWorkingDays
        } as Service
        const activeWeeks = service.serviceWeeks.map((serviceWeek: any) => +serviceWeek.week)
        this.activeWeeks = activeWeeks
      } catch (error) {
        throw error
      }
    },
    async fetchUsers() {
      try {
        const users = await getUsers()
        if (!users) {
          throw new Error('No users were found')
        }
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
      try {
        const serviceWeekData: ServiceWeek = getEmptyServiceWeekData(
          serviceWorkingDays,
          this.selectedWeek
        )

        this.selectedWeekData = serviceWeekData
      } catch (error) {
        throw error
      }
    }
  }
})
