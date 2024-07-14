import axios from 'axios'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

import { JSONDeserializer } from '@/services/deserializer'
import { firstDayOfWeek, lastDayOfWeek } from '@/utils/dayjs'
import { getArrayFromInterval } from '@/utils/common'

import type { ServiceState } from '@/types/stores'
import type { ServiceDay, ServiceHour, ServiceWeek } from '@/types/models'

const getDefaultServiceState = (): ServiceState => {
  const route = useRoute()
  const selectedWeek = route.params.week ? +route.params.week : dayjs().week()
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
      return axios
        .get(`http://localhost:3000/services/${id}`)
        .then(async (response) => {
          const parsedResponseData = response.data
          const service = await JSONDeserializer.deserialize(parsedResponseData)

          this.service = {
            id: service.id,
            name: service.name,
            active: service.active,
            serviceWorkingDays: service.serviceWorkingDays
          }
          const serviceWeeks = service.serviceWeeks.map((serviceWeek: any) => +serviceWeek.week)
          this.weeks = serviceWeeks
        })
        .catch((error: Error) => {
          throw error
        })
    },
    async fetchUsers() {
      await axios
        .get(`http://localhost:3000/users`)
        .then(async (response) => {
          const parsedResponseData = response.data
          const users = await JSONDeserializer.deserialize(parsedResponseData)
          this.users = users
        })
        .catch((error: Error) => {
          throw error
        })
    },
    async fetchServiceWeek(id: number, mode: 'show' | 'edit' = 'show') {
      let url = `http://localhost:3000/services/${id}/service_weeks/${this.selectedWeek}`
      if (mode === 'edit') {
        url += '/edit'
      }
      await axios
        .get(url)
        .then(async (response) => {
          const parsedResponseData = response.data
          const selectedWeekData = await JSONDeserializer.deserialize(parsedResponseData)
          this.selectedWeekData = selectedWeekData
        })
        .catch((error: Error) => {
          throw error
        })
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
