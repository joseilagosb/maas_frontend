import axios from 'axios'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'

import { getArrayFromInterval } from '@/utils/common'

import type { ServiceState } from '@/types/stores'

const getDefaultServiceState = () => {
  const selectedWeek = dayjs().week()
  return {
    service: undefined,
    selectedWeek,
    weeks: getArrayFromInterval(1, selectedWeek + 6)
  }
}

export const useServiceStore = defineStore('service', {
  state: (): ServiceState => getDefaultServiceState(),
  getters: {
    from: (state: ServiceState) =>
      dayjs().week(state.selectedWeek).startOf('week').subtract(1, 'day'),
    to: (state: ServiceState) => dayjs().week(state.selectedWeek).endOf('week').add(1, 'day')
  },
  actions: {
    async fetchService(id: number) {
      return axios
        .get(`http://localhost:3000/services/${id}`)
        .then((response) => {
          console.log(response.data)
          const serviceJson = response.data
          this.service = serviceJson.attributes
        })
        .catch((error: Error) => {
          throw error
        })
    }
  }
})
