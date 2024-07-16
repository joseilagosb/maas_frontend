import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

import { getService, getServiceWeek, getWeekUsersCount } from '@/services/api'
import { firstDayOfWeek, getWeek, lastDayOfWeek } from '@/services/date'
import { getArrayFromInterval } from '@/utils/common'

import type { ServiceState } from '@/types/stores'
import type { ServiceDay, ServiceHour, ServiceWeek } from '@/types/models'

const getDefaultServiceState = (): ServiceState => {
  const route = useRoute()
  const selectedWeek = route.params.week ? +route.params.week : getWeek()
  return {
    service: undefined,
    users: [],
    weeks: [],
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
      return state.weeks.includes(state.selectedWeek)
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
        const serviceWeeks = service.serviceWeeks.map((serviceWeek: any) => +serviceWeek.week)
        this.weeks = serviceWeeks
      } catch (error) {
        throw error
      }
    },
    async fetchWeekUsersCount() {
      try {
        const users = await getWeekUsersCount()
        this.users = users
      } catch (error) {
        throw error
      }
    },
    async fetchServiceWeek(id: number, mode: 'show' | 'edit' = 'show') {
      try {
        const selectedWeekData = await getServiceWeek(id, this.selectedWeek, mode)
        this.selectedWeekData = selectedWeekData
      } catch (error) {
        throw error
      }
    },
    generateEmptyServiceWeek() {
      const serviceWorkingDays = this.service!.serviceWorkingDays

      const serviceWeekData: ServiceWeek = {
        id: 0,
        week: this.selectedWeek,
        serviceDays: serviceWorkingDays!.map((serviceWorkingDay: any) => {
          const hoursArray = getArrayFromInterval(serviceWorkingDay.from, serviceWorkingDay.to)
          const serviceDay: ServiceDay = {
            id: 0,
            day: serviceWorkingDay.day,
            serviceHours: hoursArray.map((hour: any) => {
              const serviceHour: ServiceHour = {
                id: 0,
                hour,
                designatedUser: undefined
              }
              return serviceHour
            })
          }

          return serviceDay
        })
      }

      this.selectedWeekData = serviceWeekData
    }
  }
})
