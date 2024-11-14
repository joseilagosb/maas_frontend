import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

import { getWeek, nthDayOfWeek } from '@/services/date'

import { getService, getServiceWeek, getUserHoursAssignments } from '@/services/api'
import { getEmptyServiceWeekData } from './utils/service'

import type { ServiceState } from '@/types/stores'
import type { Service, ServiceWeek } from '@/types/models'

const getDefaultServiceState = (): ServiceState => {
  const route = useRoute()
  const selectedWeek = route.params.week ? +route.params.week : getWeek()
  const selectedServiceId = +route.params.id!
  return {
    service: undefined,
    userHoursAssignments: [],
    activeWeeks: [],
    selectedServiceId,
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
    },
    numberOfUnassignedHours: (state: ServiceState) => {
      const totalAssignedHours: number = state.userHoursAssignments.reduce(
        (acc, curr) => curr.hoursCount + acc,
        0
      )
      const totalHours = state.service!.serviceWorkingDays.reduce(
        (acc, curr) => curr.to - curr.from + 1 + acc,
        0
      )

      return totalHours - totalAssignedHours
    }
  },
  actions: {
    async fetchService() {
      try {
        const service = await getService(this.selectedServiceId)
        this.service = {
          id: service.id,
          type: service.type,
          name: service.name,
          description: service.description,
          active: service.active,
          serviceWorkingDays: service.serviceWorkingDays
        } as Service
        const activeWeeks = service.serviceWeeks.map(
          (serviceWeek: ServiceWeek) => +serviceWeek.week
        )
        this.activeWeeks = activeWeeks
      } catch (error) {
        throw error
      }
    },
    async fetchUserHoursAssignments() {
      try {
        const userHoursAssignments = await getUserHoursAssignments(
          this.selectedServiceId,
          this.selectedWeek
        )
        this.userHoursAssignments = userHoursAssignments
      } catch (error) {
        throw error
      }
    },
    async fetchServiceWeek(mode: 'show' | 'edit' = 'show') {
      try {
        const selectedWeekData = await getServiceWeek(
          this.selectedServiceId,
          this.selectedWeek,
          mode
        )
        this.selectedWeekData = selectedWeekData
      } catch (error) {
        throw error
      }
    },
    generateEmptyServiceWeek() {
      try {
        const serviceWeekData: ServiceWeek = getEmptyServiceWeekData(
          this.service,
          this.selectedWeek
        )
        this.selectedWeekData = serviceWeekData
      } catch (error) {
        throw error
      }
    }
  }
})
